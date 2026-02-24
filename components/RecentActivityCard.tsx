import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface RecentActivityCardProps {
    title: string;
    subtitle: string;
    imageUrl: string | number;
    timestamp: string;
}

function getTimeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
}

export function RecentActivityCard({ title, subtitle, imageUrl, timestamp }: RecentActivityCardProps) {
    const timeAgo = getTimeAgo(timestamp);

    return (
        <View style={styles.card}>
            <Image
                source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
                style={styles.image}
                contentFit="cover"
                transition={200}
            />

            <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
                style={styles.gradient}
            />

            {/* Header: Badge + Time */}
            <View style={styles.header}>
                <View style={styles.badge}>
                    <CheckCircle2 size={12} color="#4ADE80" strokeWidth={3} />
                    <Text style={styles.badgeText}>COMPLETED</Text>
                </View>
                <Text style={styles.timeText}>{timeAgo}</Text>
            </View>

            {/* Content: Title + Subtitle */}
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        height: 140, // Compact height
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: Colors.dark.cardBackground,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    header: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 100,
        gap: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        fontFamily: 'PlusJakartaSans-Bold',
    },
    timeText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontFamily: 'PlusJakartaSans-Medium',
    },
    content: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'PlusJakartaSans-Bold',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        fontFamily: 'PlusJakartaSans-Medium',
    },
});
