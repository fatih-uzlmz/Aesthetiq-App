import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { Plus } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useFriends } from '@/context/FriendsContext';
import { useRouter } from 'expo-router';

export function FriendsSection() {
    const { friends } = useFriends();
    const router = useRouter();

    const handleAddFriend = () => {
        router.push('/add-friends');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FRIENDS</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Add Friend Button */}
                <TouchableOpacity style={styles.friendItem} onPress={handleAddFriend}>
                    <View style={styles.addIconContainer}>
                        <Plus size={24} color={Colors.dark.text} />
                    </View>
                    <Text style={styles.name}>Add</Text>
                </TouchableOpacity>

                {friends.map((friend) => (
                    <TouchableOpacity key={friend.userId} style={styles.friendItem}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={friend.avatarUrl ? { uri: friend.avatarUrl } : require('@/assets/images/profile_pic.jpg')}
                                style={styles.avatar}
                                contentFit="cover"
                            />
                            {/* TODO: Add real online status */}
                            {/* <View style={styles.onlineIndicator} /> */}
                        </View>
                        <Text style={styles.name} numberOfLines={1}>{friend.fullName?.split(' ')[0] || friend.username}</Text>

                        {/* TODO: Add real activity/challenge status */}
                        <Text style={styles.statusTextTime}>{friend.username}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
        marginBottom: 16, // Add spacing below the section
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.dark.textSecondary,
        marginLeft: 16,
        marginBottom: 16,
        letterSpacing: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 20,
    },
    friendItem: {
        alignItems: 'center',
        width: 70,
    },
    addIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderStyle: 'dashed',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 8,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: Colors.dark.border,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#4ade80',
        borderWidth: 2,
        borderColor: '#000',
    },
    name: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.dark.text,
        textAlign: 'center',
        marginBottom: 2,
    },
    statusTextChallenge: {
        fontSize: 10,
        color: '#4ade80', // Green for challenge
        textAlign: 'center',
    },
    statusTextTime: {
        fontSize: 10,
        color: Colors.dark.textSecondary, // Gray for time
        textAlign: 'center',
    },
});
