import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

interface FriendActivityCardProps {
    imageUrl: string | number;
    title: string;
    subtitle: string; // Still passed but effectively unused or replaced if we want
    xp: number;
    avatarUrl: string | null;
    width?: number;
    username: string;
    createdAt: string;
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

function getFormattedDate(dateString: string) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date(dateString);
    return `${months[d.getMonth()]} ${d.getDate()}`;
}

export function FriendActivityCard({
    imageUrl,
    title,
    subtitle,
    avatarUrl,
    width = 200,
    username,
    createdAt
}: FriendActivityCardProps) {
    const timeAgo = getTimeAgo(createdAt);
    const dateStr = getFormattedDate(createdAt);

    return (
        <View style={[styles.card, { width }]}>
            <Image
                source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
                style={styles.image}
                contentFit="cover"
                transition={200}
            />

            <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'transparent', 'transparent', 'rgba(0,0,0,0.9)']}
                locations={[0, 0.3, 0.6, 1]}
                style={styles.gradient}
            />

            {/* Header - Top Left */}
            <View style={styles.header}>
                <Image
                    source={avatarUrl ? { uri: avatarUrl } : require('@/assets/images/avatar_1.png')}
                    style={styles.avatar}
                    contentFit="cover"
                />
                <View style={styles.headerText}>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.timeAgo}>{timeAgo}</Text>
                </View>
            </View>

            {/* Content - Bottom */}
            <View style={styles.content}>

                {/* Title & Date */}
                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    <Text style={styles.dateText} numberOfLines={1}>{dateStr}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        height: 220,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: Colors.dark.cardBackground,
        marginRight: 16,
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
        top: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        // Removed border properties as requested
        backgroundColor: '#333',
    },
    headerText: {
        marginLeft: 8,
        justifyContent: 'center',
    },
    username: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'PlusJakartaSans-Bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    timeAgo: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 11,
        fontFamily: 'PlusJakartaSans-Medium',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    content: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
        fontFamily: 'PlusJakartaSans-Bold',
    },
    dateText: { // Renamed from subtitle to dateText to reflect content
        color: Colors.dark.textSecondary,
        fontSize: 12,
        fontFamily: 'PlusJakartaSans-Medium',
    },
});
