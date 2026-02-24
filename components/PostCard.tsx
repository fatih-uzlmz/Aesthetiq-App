import { CHALLENGES } from '@/constants/data';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Users } from 'lucide-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface PostCardProps {
    id: string;
    challengeId: string;
    username: string; // Keep for fallback or other UI
    challengeTitle: string;
    imageUrl: string | any;
    timestamp: string;
    likes?: number;
    caption?: string;
    participantsCount: string; // Passed from parent
    friendsActivity?: any[]; // Passed from parent
    isCompleted?: boolean;
}

export function PostCard({ id, challengeId, username, challengeTitle, imageUrl, timestamp, likes = 0, participantsCount, friendsActivity = [], isCompleted = false }: PostCardProps) {
    const hasFriends = friendsActivity.length > 0;

    return (
        <Link href={`/challenge/${challengeId}`} asChild>
            <TouchableOpacity style={styles.cardContainer} activeOpacity={0.9}>
                <View style={styles.card}>
                    {/* Background Image */}
                    <Image source={imageUrl} style={styles.image} contentFit="cover" />

                    {/* Dark Overlay for Readability */}
                    <LinearGradient
                        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
                        style={styles.overlay}
                    />

                    {/* Header (Social Context) */}
                    <View style={styles.header}>
                        <View style={[styles.userInfo, !hasFriends && styles.noFriendsContainer]}>
                            {hasFriends ? (
                                <>
                                    <Image
                                        source={friendsActivity[0].avatar} // Access first friend
                                        style={styles.avatar}
                                    />
                                    <Text style={styles.username}>
                                        {friendsActivity[0].name} {friendsActivity.length > 1 ? `+ ${friendsActivity.length - 1} others` : 'joined'}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <View style={styles.noFriendsIcon}>
                                        <Users size={12} color="rgba(255,255,255,0.6)" />
                                    </View>
                                    <Text style={styles.noFriendsText}>No friends participating</Text>
                                </>
                            )}
                        </View>
                        {isCompleted && (
                            <View style={styles.completedBadge}>
                                <Text style={styles.completedText}>COMPLETED</Text>
                            </View>
                        )}
                    </View>

                    {/* Content Overlay */}
                    <View style={styles.content}>
                        {/* Participants Metric */}
                        <View style={styles.metricContainer}>
                            <Users size={14} color="#4ade80" />
                            <Text style={styles.metricText}>{participantsCount} people joined</Text>
                        </View>

                        <View style={styles.bottomRow}>
                            {/* Title */}
                            <Text style={styles.challengeTitle} numberOfLines={2}>{challengeTitle}</Text>

                            {/* XP Pill */}
                            <View style={styles.xpPill}>
                                <Text style={styles.xpText}>{CHALLENGES.find(c => c.id === challengeId)?.xp || 100} XP</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        paddingHorizontal: 4, // Nearly full width
        marginBottom: 16,
    },
    card: {
        height: width * 0.95, // Shorter than 1.1 but substantial
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        zIndex: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 16,
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
    },
    username: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
    timestamp: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '500',
    },
    content: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        zIndex: 10,
    },
    metricContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4, // Reduced space
    },
    metricText: {
        color: '#4ade80',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    completedBadge: {
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.5)',
    },
    completedText: {
        color: '#22c55e', // Darker Green
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    challengeTitle: {
        color: '#fff',
        fontSize: 18, // Reduced from 24
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        flex: 1,
        marginRight: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    actionPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)', // Glassmorphism
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        padding: 4,
    },
    actionButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
    },
    divider: {
        width: 1,
        height: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginHorizontal: 2,
    },
    noFriendsContainer: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    noFriendsIcon: {
        marginRight: 8,
        opacity: 0.8,
    },
    noFriendsText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        fontWeight: '500',
    },
    xpPill: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        backdropFilter: 'blur(10px)',
    },
    xpText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 12,
        letterSpacing: 0.5,
    },
});
