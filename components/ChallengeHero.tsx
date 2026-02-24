import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Challenge {
    id: string;
    title: string;
    subtitle: string;
    image: any;
}

interface ChallengeHeroProps {
    challenges: Challenge[];
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const SPACING = 20;

export function ChallengeHero({ challenges }: ChallengeHeroProps) {
    if (!challenges || challenges.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Featured</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + SPACING}
                snapToAlignment="start"
            >
                {challenges.map((challenge, index) => (
                    <Link key={challenge.id} href={`/challenge/${challenge.id}`} asChild>
                        <TouchableOpacity activeOpacity={0.9}>
                            <View style={[
                                styles.card,
                                index === 0 && { marginLeft: 0 },
                                index === challenges.length - 1 && { marginRight: SPACING }
                            ]}>
                                <Image source={challenge.image} style={styles.image} resizeMode="cover" />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
                                    style={styles.gradient}
                                >
                                    <View style={styles.content}>
                                        <Text style={styles.badge}>TRENDING</Text>
                                        <Text style={styles.title}>{challenge.title}</Text>
                                        <Text style={styles.subtitle}>{challenge.subtitle}</Text>

                                        <View style={styles.footer}>
                                            <View style={styles.joinButton}>
                                                <Text style={styles.joinText}>Join Challenge</Text>
                                                <ArrowRight size={16} color="#000" />
                                            </View>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </View>
                        </TouchableOpacity>
                    </Link>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 32,
    },
    heading: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.dark.text,
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    card: {
        width: CARD_WIDTH,
        height: 400,
        borderRadius: 24,
        overflow: 'hidden',
        marginRight: SPACING,
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
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
        height: '60%',
        justifyContent: 'flex-end',
        padding: 24,
    },
    content: {
        gap: 8,
    },
    badge: {
        color: Colors.dark.tint,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 16,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    joinButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 100,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    joinText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 14,
    },
});
