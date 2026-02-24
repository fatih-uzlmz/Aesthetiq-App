import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ChallengeCardProps {
    title: string;
    subtitle: string;
    image: any;
}

export function ChallengeCard({ title, subtitle, image }: ChallengeCardProps) {
    return (
        <View style={styles.container}>
            <Image source={image} style={styles.image} contentFit="cover" transition={200} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    <View style={styles.textContainer}>
                        <Text style={styles.title} numberOfLines={1}>{title}</Text>
                        <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <ArrowRight size={16} color="#fff" />
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 200,
        height: 140,
        borderRadius: 16,
        overflow: 'hidden',
        marginRight: 12,
        backgroundColor: Colors.dark.cardBackground,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        justifyContent: 'flex-end',
        padding: 12,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    textContainer: {
        flex: 1,
        marginRight: 8,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '500',
    },
    iconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
