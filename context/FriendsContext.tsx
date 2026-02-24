import { supabase } from '@/lib/supabase';
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

type Profile = {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
};

type FriendshipRow = {
    id: string;
    status: 'pending' | 'accepted';
    requester_id: string;
    receiver_id: string;
    requester: Profile;
    receiver: Profile;
};

export type Friend = {
    friendshipId: string;
    userId: string;
    username: string | null;
    fullName: string | null;
    avatarUrl: string | null;
};

export type FriendActivity = {
    id: string;
    created_at: string;
    image_url: string;
    caption: string;
    challenge_id: string;
    user_id: string;
    profiles: {
        username: string | null;
        full_name: string | null;
        avatar_url: string | null;
    };
};

type FriendsContextValue = {
    friends: Friend[];
    friendsActivity: FriendActivity[];
    pendingIncoming: Friend[];
    pendingOutgoing: Friend[];
    loading: boolean;
    refresh: () => Promise<void>;
    sendFriendRequest: (receiverId: string) => Promise<void>;
    acceptFriendRequest: (friendshipId: string) => Promise<void>;
    deleteFriendship: (friendshipId: string) => Promise<void>;
};

const FriendsContext = createContext<FriendsContextValue | undefined>(
    undefined,
);

export function FriendsProvider({ children }: { children: ReactNode }) {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [friendsActivity, setFriendsActivity] = useState<FriendActivity[]>([]);
    const [pendingIncoming, setPendingIncoming] = useState<Friend[]>([]);
    const [pendingOutgoing, setPendingOutgoing] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setCurrentUserId(session.user.id);
                loadFriendships(session.user.id);
            } else {
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setCurrentUserId(session.user.id);
                loadFriendships(session.user.id);
            } else {
                setFriends([]);
                setFriendsActivity([]);
                setPendingIncoming([]);
                setPendingOutgoing([]);
                setCurrentUserId(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    async function loadFriendships(userId: string) {
        setLoading(true);

        const { data, error } = await supabase
            .from('friendships')
            .select(
                `
        id,
        status,
        requester_id,
        receiver_id,
        requester:requester_id ( id, username, full_name, avatar_url ),
        receiver:receiver_id ( id, username, full_name, avatar_url )
      `,
            )
            .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);

        if (error) {
            console.log('loadFriendships error', error);
            setLoading(false);
            return;
        }

        const rows = (data ?? []) as unknown as FriendshipRow[];

        const accepted: Friend[] = [];
        const incoming: Friend[] = [];
        const outgoing: Friend[] = [];

        for (const row of rows) {
            const isRequester = row.requester_id === userId;
            // If I am requester, the "friend" is the receiver.
            const other = isRequester ? row.receiver : row.requester;

            // Guard against deleted profiles or null references
            if (!other) continue;

            const friendObj: Friend = {
                friendshipId: row.id,
                userId: other.id,
                username: other.username,
                fullName: other.full_name,
                avatarUrl: other.avatar_url,
            };

            if (row.status === 'accepted') {
                accepted.push(friendObj);
            } else {
                if (isRequester) {
                    outgoing.push(friendObj); // I requested, waiting for them
                } else {
                    incoming.push(friendObj); // They requested, waiting for me
                }
            }
        }

        setFriends(accepted);
        setPendingIncoming(incoming);
        setPendingOutgoing(outgoing);

        // Fetch Friends' Activity for the accepted friends
        if (accepted.length > 0) {
            const friendIds = accepted.map(f => f.userId);

            // Get Start of Today
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const { data: postsData, error: postsError } = await supabase
                .from('posts')
                .select(`
                    id,
                    created_at,
                    image_url,
                    caption,
                    challenge_id,
                    user_id
                `)
                .in('user_id', friendIds)
                .gte('created_at', today.toISOString()) // "Reset everyday at midnight"
                .order('created_at', { ascending: false });

            if (!postsError && postsData && postsData.length > 0) {
                // Manually fetch profiles
                const userIds = [...new Set(postsData.map(p => p.user_id))];

                const { data: profilesData, error: profilesError } = await supabase
                    .from('profiles')
                    .select('id, username, full_name, avatar_url')
                    .in('id', userIds);

                if (profilesData && !profilesError) {
                    const profilesMap = new Map(profilesData.map(p => [p.id, p]));

                    const combinedActivity = postsData.map(post => ({
                        ...post,
                        profiles: profilesMap.get(post.user_id) || {
                            username: 'Unknown',
                            full_name: 'Unknown',
                            avatar_url: null
                        }
                    }));

                    setFriendsActivity(combinedActivity as unknown as FriendActivity[]);
                } else {
                    setFriendsActivity([]);
                }
            } else {
                setFriendsActivity([]);
            }


        } else {
            setFriendsActivity([]);
        }

        setLoading(false);
    }

    async function sendFriendRequest(receiverId: string) {
        if (!currentUserId) return;

        const { error } = await supabase.from('friendships').insert({
            requester_id: currentUserId,
            receiver_id: receiverId,
            status: 'pending',
        });

        if (error) {
            console.log('sendFriendRequest error', error);
            throw error;
        }

        await loadFriendships(currentUserId);
    }

    async function acceptFriendRequest(friendshipId: string) {
        if (!currentUserId) return;

        const { error } = await supabase
            .from('friendships')
            .update({ status: 'accepted' })
            .eq('id', friendshipId);

        if (error) {
            console.log('acceptFriendRequest error', error);
            return;
        }

        await loadFriendships(currentUserId);
    }

    async function deleteFriendship(friendshipId: string) {
        if (!currentUserId) return;

        const { error } = await supabase
            .from('friendships')
            .delete()
            .eq('id', friendshipId);

        if (error) {
            console.log('deleteFriendship error', error);
            return;
        }

        await loadFriendships(currentUserId);
    }

    const value: FriendsContextValue = {
        friends,
        friendsActivity,
        pendingIncoming,
        pendingOutgoing,
        loading,
        refresh: async () => {
            if (currentUserId) await loadFriendships(currentUserId);
        },
        sendFriendRequest,
        acceptFriendRequest,
        deleteFriendship,
    };

    return (
        <FriendsContext.Provider value={value}>
            {children}
        </FriendsContext.Provider>
    );
}

export function useFriends() {
    const ctx = useContext(FriendsContext);
    if (!ctx) {
        throw new Error('useFriends must be used inside FriendsProvider');
    }
    return ctx;
}
