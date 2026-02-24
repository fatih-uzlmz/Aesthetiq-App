import { ScreenGradient } from '@/components/ScreenGradient';
import { StreakChart } from '@/components/StreakChart';
import { Colors, Gradients } from '@/constants/theme';
import { useSession } from '@/ctx';
import { supabase } from '@/lib/supabase';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Flame, Target, Trophy } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ActivityScreen() {
    const router = useRouter();
    const { session } = useSession();
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        if (session?.user) {
            fetchHistory();
        }
    }, [session]);

    const fetchHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('created_at')
                .eq('user_id', session?.user.id)
                .order('created_at', { ascending: false });

            if (data) {
                setPosts(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Process stats
    const stats = useMemo(() => {
        if (!posts.length) return { activeDays: 0, streak: 0, completion: 0 };

        const uniqueDays = new Set(posts.map(p => new Date(p.created_at).toDateString()));
        const activeDays = uniqueDays.size;

        // Calculate Longest Streak
        const sortedDates = Array.from(uniqueDays)
            .map(d => new Date(d))
            .sort((a, b) => a.getTime() - b.getTime());

        let maxStreak = 0;
        let currentStreak = 0;
        let prevDate: Date | null = null;

        sortedDates.forEach(date => {
            if (!prevDate) {
                currentStreak = 1;
            } else {
                const diffTime = Math.abs(date.getTime() - prevDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    currentStreak++;
                } else {
                    if (currentStreak > maxStreak) maxStreak = currentStreak;
                    currentStreak = 1;
                }
            }
            prevDate = date;
        });
        if (currentStreak > maxStreak) maxStreak = currentStreak;

        // Calculate Completion % (Active Days in Current Year / Days in Current Year so far)
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - startOfYear.getTime());
        const daysElapsed = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

        // Filter for this year's active days
        const currentYear = today.getFullYear();
        const thisYearActiveDays = Array.from(uniqueDays).filter(d => new Date(d).getFullYear() === currentYear).length;

        const completion = Math.round((thisYearActiveDays / daysElapsed) * 100);

        return { activeDays: thisYearActiveDays, streak: maxStreak, completion };
    }, [posts]);

    // Generate Month List (Last 12 months)
    const months = useMemo(() => {
        const list = [];
        const today = new Date();
        for (let i = 0; i < 12; i++) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            list.push({
                name: d.toLocaleString('default', { month: 'long' }),
                year: d.getFullYear(),
                monthIndex: d.getMonth(), // 0-11
                key: `${d.getFullYear()}-${d.getMonth()}`
            });
        }
        return list;
    }, []);

    const getMonthData = (year: number, monthIndex: number) => {
        // 1. Stats for the Calendar Month
        const monthPosts = posts.filter(p => {
            const d = new Date(p.created_at);
            return d.getFullYear() === year && d.getMonth() === monthIndex;
        });
        const activeDaysCount = new Set(monthPosts.map(p => new Date(p.created_at).toDateString())).size;

        // 2. Grid Data: Real Calendar Alignment
        // Calculate empty padding slots based on the first day of the month
        const firstDayOfMonth = new Date(year, monthIndex, 1);
        // getDay() returns 0 (Sun) to 6 (Sat). We want 0 (Mon) to 6 (Sun) if we start on Monday.
        // Let's assume standard Monday start for consistency with StreakChart headers [M, T, W...]
        let startDay = firstDayOfMonth.getDay(); // 0=Sun, 1=Mon...
        // Convert to Mon=0, Sun=6
        const paddingCount = startDay === 0 ? 6 : startDay - 1;

        // Get total days in month
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

        // Calculate weeks needed
        const weeks = Math.ceil((paddingCount + daysInMonth) / 7);
        const totalCells = weeks * 7;

        // Initialize with -1 (transparent) for padding/future, 0 for empty active days
        const data = new Array(totalCells).fill(-1);

        // Fill effective days with 0 (default empty)
        for (let i = 0; i < daysInMonth; i++) {
            data[paddingCount + i] = 0;
        }

        // Fill active days
        monthPosts.forEach(p => {
            const d = new Date(p.created_at);
            if (d.getFullYear() === year && d.getMonth() === monthIndex) {
                const dayOfMonth = d.getDate(); // 1 - 31
                const index = paddingCount + (dayOfMonth - 1);
                if (index >= 0 && index < totalCells) {
                    // Increment level, capped at 4? Or simple counter?
                    // StreakChart logic maps raw numbers.
                    // Current logic accumulates counts.
                    if (data[index] === -1) data[index] = 1; // Should not happen if init loop worked
                    else data[index] += 1;
                }
            }
        });

        // Map counts to levels (0-4)
        const levels = data.map(count => {
            if (count === -1) return -1; // Keep transparent
            if (count === 0) return 0;
            if (count === 1) return 2;
            if (count === 2) return 3;
            return 4;
        });

        return { data: levels, activeCount: activeDaysCount, weeks };
    };

    if (loading) {
        return (
            <ScreenGradient>
                <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
                    <ActivityIndicator color={Colors.dark.primary} size="large" />
                </SafeAreaView>
            </ScreenGradient>
        );
    }

    return (
        <ScreenGradient>
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                            <ArrowLeft size={24} color="#fff" />
                        </BlurView>
                    </TouchableOpacity>
                    <Text style={styles.title}>Year in Review</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                    {/* Header Stats Grid */}
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Flame size={20} color={Colors.dark.primary} style={styles.statIcon} />
                            <Text style={styles.statValue}>{stats.activeDays}</Text>
                            <Text style={styles.statLabel}>Active Days</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Trophy size={20} color="#FBBF24" style={styles.statIcon} />
                            <Text style={styles.statValue}>{stats.streak}</Text>
                            <Text style={styles.statLabel}>Longest Streak</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Target size={20} color="#60A5FA" style={styles.statIcon} />
                            <Text style={styles.statValue}>{stats.completion}%</Text>
                            <Text style={styles.statLabel}>Consistency</Text>
                        </View>
                    </View>

                    {/* Monthly Breakdown */}
                    {months.map((month, index) => {
                        const { data, activeCount, weeks } = getMonthData(month.year, month.monthIndex);

                        // Skip rendering future months empty if we want, but "Year in Review" usually shows all history? 
                        // Actually, logic generates backwards from today, so these are PAST months. Correct.

                        // Dummy Rank Logic
                        const rank = Math.floor(Math.random() * 10) + 1;
                        const getRankColor = (r: number) => {
                            if (r === 1) return '#FBBF24';
                            if (r === 2) return '#9CA3AF';
                            if (r === 3) return '#B45309';
                            return Colors.dark.textSecondary;
                        };
                        const getRankSuffix = (r: number) => {
                            if (r === 1) return 'st';
                            if (r === 2) return 'nd';
                            if (r === 3) return 'rd';
                            return 'th';
                        };

                        return (
                            <View key={month.key} style={styles.monthSection}>
                                <Text style={styles.monthTitle}>{month.name}</Text>
                                <View style={styles.monthContent}>
                                    {/* Left: Grid */}
                                    <View style={styles.monthGrid}>
                                        <StreakChart
                                            weeks={weeks}
                                            orientation="vertical"
                                            cellSize={24}
                                            showLegend={false}
                                            data={data}
                                        />
                                    </View>

                                    {/* Right: Stats Panel */}
                                    <LinearGradient
                                        colors={Gradients.card}
                                        style={styles.monthStats}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        <View style={styles.monthStatItem}>
                                            <Text style={styles.monthStatValue}>{activeCount}</Text>
                                            <Text style={styles.monthStatLabel}>Days Active</Text>
                                        </View>
                                        <View style={styles.divider} />
                                        <View style={styles.monthStatItem}>
                                            <Text style={[styles.monthStatValue, { color: getRankColor(rank) }]}>
                                                {rank}{getRankSuffix(rank)}
                                            </Text>
                                            <Text style={styles.monthStatLabel}>Friends Ranking</Text>
                                        </View>
                                    </LinearGradient>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            </SafeAreaView>
        </ScreenGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        overflow: 'hidden',
        borderRadius: 20,
    },
    blurContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.dark.cardBackground,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    statIcon: {
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
    },
    monthSection: {
        marginBottom: 32,
    },
    monthTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 16,
        textAlign: 'left',
    },
    monthContent: {
        flexDirection: 'row',
        gap: 16,
    },
    monthGrid: {
        alignItems: 'flex-start',
    },
    monthStats: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    monthStatItem: {
        alignItems: 'flex-start',
    },
    monthStatValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 4,
    },
    monthStatLabel: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.dark.border,
        marginVertical: 12,
    },
});
