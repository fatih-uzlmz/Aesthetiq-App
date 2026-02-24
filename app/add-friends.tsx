import { ScreenGradient } from '@/components/ScreenGradient';
import { Colors } from '@/constants/theme';
import { useFriends } from '@/context/FriendsContext';
import { supabase } from '@/lib/supabase';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, UserCheck, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SearchResult = {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
};

export default function AddFriendsScreen() {
    const router = useRouter();
    const { friends, pendingIncoming, pendingOutgoing, sendFriendRequest, acceptFriendRequest, deleteFriendship } = useFriends();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searching, setSearching] = useState(false);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        // Basic search by username - case insensitive
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .ilike('username', `%${query}%`)
            .limit(10); // Limit results

        setSearching(false);

        if (error) {
            console.error(error);
            return;
        }

        if (data) {
            setSearchResults(data);
        }
    };

    const handleAdd = async (userId: string) => {
        try {
            await sendFriendRequest(userId);
            Alert.alert('Success', 'Friend request sent!');
        } catch (error) {
            Alert.alert('Error', 'Could not send request.');
        }
    };

    const handleAccept = async (friendshipId: string) => {
        try {
            await acceptFriendRequest(friendshipId);
        } catch (error) {
            Alert.alert('Error', 'Could not accept request.');
        }
    };

    const handleDecline = async (friendshipId: string) => {
        try {
            await deleteFriendship(friendshipId);
        } catch (error) {
            Alert.alert('Error', 'Could not decline request.');
        }
    };

    const getFriendStatus = (userId: string) => {
        if (friends.some(f => f.userId === userId)) return 'friend';
        if (pendingOutgoing.some(f => f.userId === userId)) return 'pending';
        if (pendingIncoming.some(f => f.userId === userId)) return 'incoming';
        return 'none';
    };

    return (
        <ScreenGradient>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color={Colors.dark.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Add Friends</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {/* Friend Requests Section */}
                    {pendingIncoming.length > 0 && (
                        <View style={styles.requestsSection}>
                            <Text style={styles.sectionTitle}>Friend Requests</Text>
                            {pendingIncoming.map(request => (
                                <View key={request.friendshipId} style={styles.friendItem}>
                                    <View style={styles.userInfo}>
                                        <Image
                                            source={request.avatarUrl ? { uri: request.avatarUrl } : require('@/assets/images/profile_pic.jpg')}
                                            style={styles.avatar}
                                            contentFit="cover"
                                        />
                                        <View>
                                            <Text style={styles.userName}>{request.fullName || 'No Name'}</Text>
                                            <Text style={styles.userHandle}>{request.username || 'No Username'}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.actionButtons}>
                                        <TouchableOpacity
                                            style={[styles.actionButton, styles.acceptButton]}
                                            onPress={() => handleAccept(request.friendshipId)}
                                        >
                                            <UserCheck size={18} color="#fff" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.actionButton, styles.declineButton]}
                                            onPress={() => handleDecline(request.friendshipId)}
                                        >
                                            <ArrowLeft size={18} color="#fff" style={{ transform: [{ rotate: '45deg' }] }} />
                                            {/* Using rotated ArrowLeft as X icon cross if X not imported, or replace import */}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                            <View style={styles.divider} />
                        </View>
                    )}

                    <View style={styles.searchContainer}>
                        <Search size={20} color={Colors.dark.textSecondary} style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by username..."
                            placeholderTextColor={Colors.dark.textSecondary}
                            value={searchQuery}
                            onChangeText={handleSearch}
                            autoCapitalize="none"
                        />
                    </View>

                    {searchResults.length === 0 ? (
                        <Text style={styles.emptyText}>
                            {searchQuery ? (searching ? 'Searching...' : `No user found for "${searchQuery}"`) : 'Search for a username to add friends'}
                        </Text>
                    ) : (
                        searchResults.map(user => {
                            const status = getFriendStatus(user.id);
                            return (
                                <View key={user.id} style={styles.friendItem}>
                                    <View style={styles.userInfo}>
                                        <Image
                                            source={user.avatar_url ? { uri: user.avatar_url } : require('@/assets/images/profile_pic.jpg')}
                                            style={styles.avatar}
                                            contentFit="cover"
                                        />
                                        <View>
                                            <Text style={styles.userName}>{user.full_name || 'No Name'}</Text>
                                            <Text style={styles.userHandle}>{user.username || 'No Username'}</Text>
                                        </View>
                                    </View>

                                    {status === 'none' ? (
                                        <TouchableOpacity
                                            style={styles.addButton}
                                            onPress={() => handleAdd(user.id)}
                                        >
                                            <UserPlus size={20} color={Colors.dark.text} />
                                            <Text style={styles.addButtonText}>Add</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={[styles.addButton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.dark.border }]}>
                                            <UserCheck size={20} color={Colors.dark.textSecondary} />
                                            <Text style={[styles.addButtonText, { color: Colors.dark.textSecondary }]}>
                                                {status === 'friend' ? 'Friends' : 'Sent'}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            );
                        })
                    )}
                </ScrollView>
            </SafeAreaView>
        </ScreenGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    content: {
        padding: 20,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.dark.cardBackground,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark.text,
        marginBottom: 2,
    },
    userHandle: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.text,
    },
    emptyText: {
        color: Colors.dark.textSecondary,
        fontStyle: 'italic',
        marginTop: 20,
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.cardBackground,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: Colors.dark.text,
        fontSize: 16,
    },
    requestsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 12,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    acceptButton: {
        backgroundColor: Colors.dark.primary,
    },
    declineButton: {
        backgroundColor: '#EF4444', // Red for decline
    },
    divider: {
        height: 1,
        backgroundColor: Colors.dark.border,
        marginVertical: 16,
    },
});
