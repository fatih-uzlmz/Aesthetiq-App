import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2, Clock } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface ActivityBannerProps {
    title: string;
    subtitle: string;
    image: any;
    timeAgo: string;
    status?: 'completed' | 'in_progress';
}

export function ActivityBanner({ title, subtitle, image, timeAgo, status = 'completed' }: ActivityBannerProps) {
    return (
        <View style={styles.container}>
            <Image source={image} style={styles.image} resizeMode="cover" />
            <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.9)']}
                style={styles.gradient}
            />

            <View style={styles.contentContainer}>
                <View style={styles.topRow}>
                    <View style={styles.statusBadge}>
                        {status === 'completed' ? (
                            <CheckCircle2 size={12} color={Colors.dark.primary} />
                        ) : (
                            <Clock size={12} color="#fbbf24" />
                        )}
                        <Text style={styles.statusText}>
                            {status === 'completed' ? 'Completed' : 'In Progress'}
                        </Text>
                    </View>
                    <Text style={styles.timeText}>{timeAgo}</Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 110,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    contentContainer: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 100,
        gap: 6,
        backdropFilter: 'blur(10px)',
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    timeText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '500',
    },
    textContainer: {
        gap: 2,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
    },
});
