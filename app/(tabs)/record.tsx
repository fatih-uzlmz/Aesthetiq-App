import { ScreenGradient } from '@/components/ScreenGradient';
import { Colors } from '@/constants/theme';
import { useSession } from '@/ctx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Dumbbell, Brain, Footprints, BookOpen, HeartPulse, Laptop, Settings } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PRESET_HABITS } from '../habit-setup';

export default function ActionScreen() {
    const { session } = useSession();
    const router = useRouter();
    const [habits, setHabits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadHabits = async () => {
        try {
            const val = await AsyncStorage.getItem('user_habits');
            if (val) {
                let parsedHabits: any[] = JSON.parse(val);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                let updated = false;
                parsedHabits = parsedHabits.map(h => {
                    if (h.streak > 0) {
                        if (h.last_completed) {
                            const lastDate = new Date(h.last_completed);
                            lastDate.setHours(0, 0, 0, 0);
                            
                            const diffTime = today.getTime() - lastDate.getTime();
                            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                            
                            // If more than 1 calendar day has passed since last completion, break streak
                            if (diffDays > 1) {
                                h.streak = 0;
                                updated = true;
                            }
                        } else {
                            // Legacy fallback: if there is a streak but no completion date tracked, reset it to allow the new system to take over cleanly
                            h.streak = 0;
                            updated = true;
                        }
                    }
                    return h;
                });

                if (updated) {
                    await AsyncStorage.setItem('user_habits', JSON.stringify(parsedHabits));
                }
                setHabits(parsedHabits);
            }
        } catch (e) {
            console.error('Failed to load habits', e);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadHabits();
        }, [])
    );

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getFormattedDate = () => {
        const date = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    };

    const username = session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.username || 'Challenger';
    const firstName = username.split(' ')[0];

    const handleHabitPress = (habit: any) => {
        router.push({
            pathname: '/camera',
            params: { habitId: habit.id, habitName: habit.name }
        });
    };

    const renderIcon = (id: string, color: string) => {
        if (id.includes('gym') || id.includes('training')) return <Dumbbell color={color} size={24} />;
        if (id.includes('deepwork')) return <Brain color={color} size={24} />;
        if (id.includes('walk')) return <Footprints color={color} size={24} />;
        if (id.includes('read')) return <BookOpen color={color} size={24} />;
        if (id.includes('meditate')) return <HeartPulse color={color} size={24} />;
        if (id.includes('code')) return <Laptop color={color} size={24} />;
        return <Check color={color} size={24} />;
    };

    const getHabitImage = (id: string) => {
        const found = PRESET_HABITS.find(ph => ph.id === id);
        return found?.image || require('@/assets/images/aesthetic/gym_1.png');
    };

    if (loading) {
        return (
            <ScreenGradient>
                <SafeAreaView style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                </SafeAreaView>
            </ScreenGradient>
        );
    }

    const totalStreak = habits.reduce((acc, curr) => acc + (curr.streak || 0), 0);

    return (
        <ScreenGradient>
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    <View style={styles.header}>
                        <View style={styles.headerRow}>
                            <View>
                                <Text style={styles.dateText}>{getFormattedDate().toUpperCase()}</Text>
                                <Text style={styles.greetingText}>{getGreeting()}, {firstName}</Text>
                            </View>
                            
                            <View style={styles.headerActions}>
                                {totalStreak > 0 && (
                                    <View style={styles.streakPill}>
                                        <Text style={styles.streakPillText}>{totalStreak} 🔥</Text>
                                    </View>
                                )}
                                
                                {__DEV__ && (
                                    <TouchableOpacity 
                                        style={[styles.iconButton, { backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }]}
                                        onPress={async () => {
                                            await AsyncStorage.removeItem('user_habits');
                                            router.push('/habit-setup');
                                        }}
                                    >
                                        <Text style={{color: '#EF4444', fontSize: 10, fontWeight: '900'}}>DEV</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity 
                                    style={styles.iconButton}
                                    onPress={() => router.push('/settings')}
                                >
                                    <Settings size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        {totalStreak === 0 && (
                            <View style={styles.emptyStateContainer}>
                                <Text style={styles.emptyStateText}>You haven't completed anything yet.</Text>
                                <Text style={styles.emptyStateSubtext}>Your first post starts your streak.</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.habitsContainer}>
                        {habits.length === 0 ? (
                            <View style={styles.noHabitsBox}>
                                <Text style={{ color: '#fff', textAlign: 'center' }}>No habits found.</Text>
                            </View>
                        ) : (
                            habits.map((habit, index) => (
                                <TouchableOpacity 
                                    key={habit.id || index.toString()} 
                                    style={styles.habitCard}
                                    activeOpacity={0.85}
                                    onPress={() => handleHabitPress(habit)}
                                >
                                    <ImageBackground source={getHabitImage(habit.id)} style={styles.cardImage} resizeMode="cover">
                                        <LinearGradient
                                            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.95)']}
                                            style={styles.cardGradient}
                                        />
                                        
                                        <View style={styles.habitContent}>
                                            <View style={styles.habitHeader}>
                                                <View style={styles.iconContainer}>
                                                    {renderIcon(habit.id, '#fff')}
                                                </View>
                                                <View style={styles.streakBadge}>
                                                    <Text style={styles.streakBadgeText}>{habit.streak || 0} DAY STREAK</Text>
                                                </View>
                                            </View>
                                            
                                            <View style={styles.habitFooter}>
                                                <Text style={styles.habitName}>{habit.name}</Text>
                                                <View style={styles.habitCta}>
                                                    <Text style={styles.habitCtaText}>POST PROOF</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>

                    <View style={{ height: 120 }} />
                </ScrollView>
            </SafeAreaView>
        </ScreenGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: 24, paddingTop: 40 },
    
    header: { marginBottom: 32 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    
    dateText: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
    greetingText: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
    
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    streakPill: {
        backgroundColor: 'rgba(251,191,36,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(251,191,36,0.3)',
    },
    streakPillText: {
        color: '#FBBF24',
        fontWeight: '800',
        fontSize: 12,
        letterSpacing: 0.5,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },

    emptyStateContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: 'rgba(255,191,36,0.1)',
        borderLeftWidth: 3,
        borderLeftColor: '#FBBF24',
        borderRadius: 8,
    },
    emptyStateText: { color: '#fff', fontSize: 14, fontWeight: '700' },
    emptyStateSubtext: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 },
    habitsContainer: { gap: 24 },
    noHabitsBox: { padding: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 },
    
    habitCard: {
        width: '100%',
        height: 220, 
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: '#111',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
    cardImage: { width: '100%', height: '100%' },
    cardGradient: { ...StyleSheet.absoluteFillObject },
    
    habitContent: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
    },
    habitHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    streakBadge: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    streakBadgeText: {
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '700',
        fontSize: 10,
        letterSpacing: 1,
    },
    
    habitFooter: { gap: 10 },
    habitName: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 1,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    habitCta: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    habitCtaText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 11,
        letterSpacing: 2,
    }
});
