import { FeedPost } from '@/components/FeedPost';
import { ScreenGradient } from '@/components/ScreenGradient';
import { POSTS } from '@/constants/data';
import { Colors } from '@/constants/theme';
import { useFriends } from '@/context/FriendsContext';
import { supabase } from '@/lib/supabase';
import { Link } from 'expo-router';
import { Plus, Trophy, UserCheck, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SearchResult = {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    type: 'user';
} | {
    id: string;
    title: string;
    description: string;
    image_url: string;
    type: 'challenge';
};

export default function FriendsScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [viewMode, setViewMode] = useState<'posts' | 'leaderboard'>('posts');

    // Friends Context Logic
    const { friends, sendFriendRequest, pendingOutgoing } = useFriends();

    // Mock filtering for Friends feed
    const friendsPosts = POSTS;

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        try {
            // Parallel search: Users & Challenges

            // 1. Search Users
            const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select('*')
                .ilike('username', `%${query}%`)
                .limit(5);

            // 2. Search Challenges (Mocked for now)
            const mockChallengeResults = [
                { id: 'c1', title: 'Morning Mile', description: 'Run 1 mile every morning', image_url: '', type: 'challenge' as const },
                { id: 'c2', title: 'Read 30 Mins', description: 'Read a book for 30 mins', image_url: '', type: 'challenge' as const }
            ].filter(c => c.title.toLowerCase().includes(query.toLowerCase()));

            const results: SearchResult[] = [];

            if (userData) {
                results.push(...userData.map(u => ({ ...u, type: 'user' as const })));
            }
            results.push(...mockChallengeResults);

            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const handleAddFriend = async (userId: string) => {
        try {
            await sendFriendRequest(userId);
            Alert.alert('Success', 'Friend request sent!');
        } catch (error) {
            Alert.alert('Error', 'Could not send request.');
        }
    };

    const getFriendStatus = (userId: string) => {
        if (friends.some(f => f.userId === userId)) return 'friend';
        if (pendingOutgoing.some(f => f.userId === userId)) return 'pending';
        return 'none';
    };

    const renderSearchResult = ({ item }: { item: SearchResult }) => {
        if (item.type === 'user') {
            const status = getFriendStatus(item.id);
            return (
                <View style={styles.resultItem}>
                    <View style={styles.userInfo}>
                        <Image
                            source={item.avatar_url ? { uri: item.avatar_url } : require('@/assets/images/profile_pic.jpg')}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.resultTitle}>{item.full_name || item.username}</Text>
                            <Text style={styles.resultSubtitle}>@{item.username}</Text>
                        </View>
                    </View>

                    {status === 'none' ? (
                        <TouchableOpacity style={styles.addButton} onPress={() => handleAddFriend(item.id)}>
                            <UserPlus size={16} color={Colors.dark.text} />
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={[styles.addButton, styles.addedButton]}>
                            <UserCheck size={16} color={Colors.dark.textSecondary} />
                            <Text style={[styles.addButtonText, { color: Colors.dark.textSecondary }]}>
                                {status === 'friend' ? 'Friends' : 'Sent'}
                            </Text>
                        </View>
                    )}
                </View>
            );
        } else {
            return (
                <View style={styles.resultItem}>
                    <View style={styles.userInfo}>
                        <View style={[styles.avatar, { backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center' }]}>
                            <Trophy size={20} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.resultTitle}>{item.title}</Text>
                            <Text style={styles.resultSubtitle}>Challenge</Text>
                        </View>
                    </View>
                </View>
            );
        }
    };

    return (
        <ScreenGradient>
            <SafeAreaView style={styles.container} edges={['top']}>
                {/* Header: Search Bar */}
                <View style={styles.header}>
                    <Text style={styles.sectionTitle}>Friends</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
                        <View style={styles.addStoryContainer}>
                            <Link href="/add-friends" asChild>
                                <TouchableOpacity style={styles.addStoryButton}>
                                    <View style={styles.plusIconContainer}>
                                        <Plus size={20} color="#fff" />
                                    </View>
                                </TouchableOpacity>
                            </Link>
                            <Text style={styles.addStoryText}>add friends to see their activity</Text>
                        </View>
                    </ScrollView>
                </View>

                {/* Content */}
                {searchQuery ? (
                    // SEARCH RESULTS VIEW
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item.id}
                        renderItem={renderSearchResult}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    {isSearching ? 'No results found.' : 'Search for friends...'}
                                </Text>
                            </View>
                        }
                    />
                ) : (
                    // TOGGLE VIEW (Posts vs Leaderboard)
                    <View style={{ flex: 1 }}>
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[styles.toggleButton, viewMode === 'posts' && styles.activeToggle]}
                                onPress={() => setViewMode('posts')}
                            >
                                <Text style={[styles.toggleText, viewMode === 'posts' && styles.activeText]}>Posts</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.toggleButton, viewMode === 'leaderboard' && styles.activeToggle]}
                                onPress={() => setViewMode('leaderboard')}
                            >
                                <Text style={[styles.toggleText, viewMode === 'leaderboard' && styles.activeText]}>Leaderboard</Text>
                            </TouchableOpacity>
                        </View>

                        {viewMode === 'posts' ? (
                            // POSTS VIEW
                            friendsPosts.length > 0 ? (
                                <FlatList
                                    data={friendsPosts}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <FeedPost
                                            username={item.username}
                                            challengeTitle={item.challengeTitle}
                                            imageUrl={item.imageUrl}
                                            likes={item.likes || Math.floor(Math.random() * 1000) + 500}
                                            caption={item.caption || item.description}
                                            timestamp={item.timestamp === 'Trending now' ? '2 hours ago' : item.timestamp}
                                        />
                                    )}
                                    contentContainerStyle={styles.listContent}
                                    showsVerticalScrollIndicator={false}
                                />
                            ) : (
                                <View style={styles.emptyFriendsContainer}>
                                    <Text style={styles.emptyFriendsText}>add friends to see their posts</Text>
                                </View>
                            )
                        ) : (
                            // LEADERBOARD VIEW
                            <View style={styles.leaderboardContainer}>
                                <View style={styles.leaderboardHeader}>
                                    <Trophy size={20} color={Colors.dark.primary} />
                                    <Text style={styles.leaderboardTitle}>Weekly Competition</Text>
                                </View>

                                {friends.length > 0 ? (
                                    <View style={styles.leaderboardList}>
                                        {[
                                            { id: 'u1', name: 'Sarah', score: 2400, avatar: require('@/assets/images/avatar_3.png'), rank: 1 },
                                            { id: 'me', name: 'You', score: 1850, avatar: require('@/assets/images/profile_pic.jpg'), rank: 2 },
                                            { id: 'u2', name: 'Mike', score: 1200, avatar: require('@/assets/images/avatar_1.png'), rank: 3 },
                                        ].map((user, index) => (
                                            <View key={user.id} style={[styles.rankItem, user.id === 'me' && styles.rankItemActive]}>
                                                <Text style={[styles.rankNumber, { color: index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : '#b45309' }]}>
                                                    #{user.rank}
                                                </Text>
                                                <Image source={user.avatar} style={styles.rankAvatar} />
                                                <Text style={styles.rankName}>{user.name}</Text>
                                                <Text style={styles.rankScore}>{user.score} XP</Text>
                                            </View>
                                        ))}
                                    </View>
                                ) : (
                                    <View style={styles.emptyContainer}>
                                        <Text style={styles.emptyLeaderboardText}>add friends to see leaderboard</Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                )}
            </SafeAreaView>
        </ScreenGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    listContent: {
        padding: 0,
        paddingBottom: 100,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: Colors.dark.textSecondary,
        fontSize: 16,
    },
    emptyFriendsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyFriendsText: {
        color: Colors.dark.textSecondary,
        fontSize: 16,
        fontStyle: 'italic',
        opacity: 0.7,
    },
    feedItem: {
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    feedHeader: {
        color: 'rgba(255,255,255,0.6)', // Muted text
        fontSize: 14,
        marginBottom: 8,
        paddingLeft: 4,
    },
    feedUser: {
        color: '#fff',
        fontWeight: 'bold',
    },
    // Leaderboard Styles
    leaderboardContainer: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    leaderboardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    leaderboardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    leaderboardList: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 4,
    },
    rankItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        gap: 12,
    },
    rankItemActive: {
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    rankNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        width: 24,
    },
    rankAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#333',
    },
    rankName: {
        flex: 1,
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    rankScore: {
        color: Colors.dark.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyLeaderboardText: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        fontStyle: 'italic',
        marginLeft: 28,
        marginTop: -4,
    },
    // Search Result Styles
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.dark.cardBackground,
    },
    resultTitle: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    resultSubtitle: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    addedButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    addButtonText: {
        color: Colors.dark.text,
        fontWeight: '600',
        fontSize: 12,
    },
    // Toggle Styles
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 25,
        padding: 4,
        alignSelf: 'center',
        marginBottom: 16,
    },
    toggleButton: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 20,
    },
    activeToggle: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    toggleText: {
        color: Colors.dark.textSecondary,
        fontWeight: '600',
        fontSize: 14,
    },
    activeText: {
        color: '#fff',
    },
    // Friends Rail Styles
    sectionTitle: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        marginLeft: 4,
    },
    storiesContainer: {
        marginBottom: 20,
    },
    addStoryContainer: {
        alignItems: 'center',
        marginRight: 16,
        gap: 8,
    },
    addStoryText: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        fontStyle: 'italic',
        opacity: 0.6,
        width: 120, // Constrain width for wrapping if needed
        textAlign: 'center',
    },
    addStoryButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.05)', // Subtle background
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusIconContainer: {
        // Removed inner container styling to keep it distinct but simple, or just center the icon
        justifyContent: 'center',
        alignItems: 'center',
    },
});
