import { CHALLENGES } from '@/constants/data';
import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { AlertTriangle, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface Props {
    user: any;
    profile: any;
    completedCount: number;
    streak: number;
}

export function DashboardHeader({ user, profile, completedCount, streak }: Props) {
    const router = useRouter();
    const [greeting, setGreeting] = useState('');
    const [dailyChallenges, setDailyChallenges] = useState<any[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isRiskBannerVisible, setIsRiskBannerVisible] = useState(true);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    const [testHour, setTestHour] = useState<number | null>(null);

    useEffect(() => {
        // 1. Set Greeting
        const hour = testHour !== null ? testHour : new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        // 2. Load Daily Focus Challenges (Locked In)
        const loadDailyChallenges = async () => {
            const CACHE_KEY_IDS = 'daily_lockin_ids';

            try {
                const json = await AsyncStorage.getItem(CACHE_KEY_IDS);
                if (json) {
                    const ids = JSON.parse(json);
                    const challenges = CHALLENGES.filter(c => ids.includes(c.id));
                    // Reorder to match selection order if possible, or just use filtered
                    // (Filter preserves CHALLENGES order, which is fine)
                    if (challenges.length > 0) {
                        setDailyChallenges(challenges);
                        return;
                    }
                }

                // Fallback: Pick a single random one if nothing locked in (e.g. before lock-in flow)
                // In reality, route guard prevents this, but for safety:
                const daily = CHALLENGES.filter(c => c.category === 'Daily' && !c.isTimeSpecific);
                const random = daily[Math.floor(Math.random() * daily.length)];
                setDailyChallenges([random]);

            } catch (e) {
                console.log('Error loading daily challenges:', e);
            }
        };

        loadDailyChallenges();
    }, [testHour]);

    // const stats removed

    const currentHour = testHour !== null ? testHour : new Date().getHours();
    // Show banner if (Real conditions met) OR (Testing Afternoon)
    const showRiskBanner = (isRiskBannerVisible && completedCount === 0 && currentHour >= 12) || (testHour === 14);

    const toggleTestMode = () => {
        if (testHour === null) setTestHour(9); // Start Test: Morning (9 AM)
        else if (testHour === 9) setTestHour(14); // Next: Afternoon (2 PM) - Risk Banner
        else setTestHour(null); // Reset to Real Time
    };

    return (
        <View style={styles.container}>
            {/* 1. Header & Greeting */}
            <View style={styles.headerRow}>
                <View>
                    <TouchableOpacity onPress={toggleTestMode}>
                        <Text style={styles.date}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            {testHour !== null && <Text style={{ color: '#F59E0B' }}> • TEST: {testHour < 12 ? 'MORN' : 'AFT'}</Text>}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.greeting}>{greeting},</Text>
                    <Text style={styles.username}>{profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Friend'}</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/profile')}>
                    <Image
                        source={profile?.avatar_url ? { uri: profile.avatar_url } : require('@/assets/images/profile_pic.jpg')}
                        style={styles.avatar}
                    />
                </TouchableOpacity>
            </View>

            {/* 2. Stats Row - REMOVED */}

            {/* 2.5 Risk Awareness Banner */}
            {showRiskBanner && (
                <View style={styles.riskBanner}>
                    <View style={styles.riskContent}>
                        <AlertTriangle size={18} color="#F59E0B" style={{ marginTop: 2 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.riskTitle}>You haven't shown up today.</Text>
                            <Text style={styles.riskSubtitle}>One action protects your streak.</Text>
                        </View>
                        <TouchableOpacity onPress={() => setIsRiskBannerVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <X size={16} color="rgba(255,255,255,0.4)" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* 3. Daily Focus Card */}
            {/* 3. Daily Focus Card Carousel */}
            {dailyChallenges.length > 0 && (
                <View style={styles.sectionContainer}>
                    {/* Morning Motivation (Before 12 PM) */}
                    {currentHour < 12 && (
                        <Text style={{
                            color: 'rgba(255,255,255,0.5)',
                            fontStyle: 'italic',
                            fontSize: 14,
                            marginBottom: 8,
                            paddingHorizontal: 4
                        }}>
                            It's a new day, make it count.
                        </Text>
                    )}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>Daily Focus</Text>
                        {/* Optional counter */}
                        {dailyChallenges.length > 1 && (
                            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{activeIndex + 1}/{dailyChallenges.length}</Text>
                        )}
                    </View>

                    <FlatList
                        data={dailyChallenges}
                        keyExtractor={(item) => item.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={width - 40 + 12} // width - padding + gap (approx) - actually we want single item per view here to match layout? 
                        // The original was full width of container (width - 40).
                        // Let's stick to standard paging.
                        decelerationRate="fast"
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={viewabilityConfig}
                        renderItem={({ item }) => (
                            <Link href={{ pathname: '/challenge/[id]', params: { id: item.id } }} asChild>
                                <TouchableOpacity activeOpacity={0.9} style={{ width: width - 40, marginRight: 0 }}>
                                    <View style={styles.dailyCard}>
                                        <Image source={item.image} style={styles.dailyImage} contentFit="cover" />
                                        <LinearGradient
                                            colors={['transparent', 'rgba(0,0,0,0.9)']}
                                            style={styles.dailyOverlay}
                                        />
                                        <View style={styles.dailyContent}>
                                            <View style={styles.dailyBadge}>
                                                <Text style={styles.dailyBadgeText}>DAILY GOAL</Text>
                                            </View>
                                            <Text style={styles.dailyTitle}>{item.title}</Text>
                                            <Text style={styles.dailySubtitle}>{item.duration ? `${item.duration} Min • ` : ''}{item.xp} XP</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Link>
                        )}
                    />

                    {/* Dots for carousel */}
                    {dailyChallenges.length > 1 && (
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12, gap: 6 }}>
                            {dailyChallenges.map((_, i) => (
                                <View
                                    key={i}
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.2)'
                                    }}
                                />
                            ))}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        gap: 24,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        // removed paddingHorizontal to aligning with parent container
    },
    date: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    greeting: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '300',
    },
    username: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: -4,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    statLabel: {
        color: Colors.dark.textSecondary,
        fontSize: 10,
        fontWeight: '600',
    },
    // Risk Banner Styles
    riskBanner: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)', // Muted Amber
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
        overflow: 'hidden',
    },
    riskContent: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
        alignItems: 'flex-start',
    },
    riskTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 2,
    },
    riskSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },
    sectionContainer: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 16,
    },
    dailyCard: {
        height: 200,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#1E1E1E',
        position: 'relative',
    },
    dailyImage: {
        width: '100%',
        height: '100%',
    },
    dailyOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80%',
    },
    dailyContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
    },
    dailyBadge: {
        backgroundColor: Colors.dark.primary,
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 8,
    },
    dailyBadgeText: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    dailyTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    dailySubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '500',
    },
});
