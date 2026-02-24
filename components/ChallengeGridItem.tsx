import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

interface ChallengeGridItemProps {
    title: string;
    subtitle: string;
    image: any;
    friendsParticipants?: any[];
    xp?: number;
}

const { width } = Dimensions.get('window');
// Calculate card width based on 2 columns with padding
// Total padding: 40 (Screen Section) + 32 (Grid Container) = 72
// Gap: ~15
const CARD_WIDTH = (width - 72 - 15) / 2;

export function ChallengeGridItem({ title, subtitle, image, friendsParticipants = [], xp }: ChallengeGridItemProps) {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={image} style={styles.image} resizeMode="cover" />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.gradient}
                />

                {/* Friends Avatars */}
                {friendsParticipants.length > 0 && (
                    <View style={styles.avatarsContainer}>
                        {friendsParticipants.slice(0, 3).map((participant, index) => (
                            <Image
                                key={index}
                                source={participant.image}
                                style={[
                                    styles.avatar,
                                    { zIndex: 3 - index, marginLeft: index > 0 ? -10 : 0 }
                                ]}
                            />
                        ))}
                    </View>
                )}

                <View style={styles.overlay}>
                    <View style={styles.xpBadge}>
                        <Text style={styles.xpText}>{xp || 100} XP</Text>
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        marginBottom: 20,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 0.8, // Taller than wide
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 8,
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    avatarsContainer: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#000',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        padding: 12,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    xpBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
    },
    xpText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    content: {
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.dark.text,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 13,
        color: Colors.dark.textSecondary,
    },
});
