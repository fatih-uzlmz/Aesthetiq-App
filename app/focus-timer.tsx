import { ScreenGradient } from '@/components/ScreenGradient';
import { useSession } from '@/ctx';
import * as Device from 'expo-device';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Play, Square, Trophy } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, AppState, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Configure Notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true, // Added as per instruction
    }),
});

export default function FocusTimerScreen() {
    const router = useRouter();
    const { id, duration, title, xp } = useLocalSearchParams();
    const { session } = useSession();

    // Parse duration (default 60 mins if missing)
    const initialMinutes = duration ? parseFloat(duration as string) : 60;
    const initialSeconds = Math.round(initialMinutes * 60);

    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const [isActive, setIsActive] = useState(false);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [isCompleted, setIsCompleted] = useState(false); // Added isCompleted state

    // Notification Logic
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            // Optional: console.log(token);
        });
    }, []);

    // Timer Logic: Date-based to support Backgrounding
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;

        if (isActive && endTime) {
            interval = setInterval(() => {
                const now = Date.now();
                const secondsRemaining = Math.max(0, Math.ceil((endTime - now) / 1000));

                setTimeLeft(secondsRemaining);

                if (secondsRemaining <= 0) {
                    handleComplete();
                }
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, endTime]);

    // App State to Prompt User on Exit
    const appState = useRef(AppState.currentState);
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
                if (isActive && timeLeft > 0) {
                    schedulePushNotification("Focus Session Active", "Your timer is still running. Keep going!");
                }
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [isActive, timeLeft]);

    const handleComplete = async () => {
        setIsActive(false);
        setEndTime(null);
        setIsCompleted(true); // Set isCompleted to true
        await schedulePushNotification("Session Complete! 🎉", `You focused for ${initialMinutes} minutes.`);
    };

    const toggleTimer = async () => {
        if (isActive) {
            // Give Up / Pause
            setIsActive(false);
            setEndTime(null);
            await Notifications.cancelAllScheduledNotificationsAsync(); // Cancel scheduled notifications
        } else {
            // Start
            setIsActive(true);
            const end = Date.now() + timeLeft * 1000;
            setEndTime(end);

            // Schedule "Timer Done" notification
            if (timeLeft > 0) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Focus Session Complete! 🎉",
                        body: `You did it! Come back to claim your ${xp || 100} XP.`,
                        sound: true,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                        seconds: timeLeft,
                        repeats: false,
                    },
                });
            }
        }
    };

    const resetTimer = () => {
        setIsActive(false);
        setEndTime(null);
        setIsCompleted(false); // Reset isCompleted
        setTimeLeft(initialSeconds);
        Notifications.cancelAllScheduledNotificationsAsync(); // Cancel scheduled notifications
    };

    const handleShareAndClaim = () => {
        // Navigate back to challenge with 'completed' flag to trigger post flow
        router.dismissAll();
        router.push({
            pathname: "/challenge/[id]",
            params: { id: id as string, completed: 'true' }
        });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Render Summary View if Completed
    if (isCompleted) {
        return (
            <ScreenGradient>
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { zIndex: 1 }]}>
                            <ArrowLeft size={24} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ width: 40 }} />
                    </View>
                    <View style={styles.content}>
                        <View style={styles.summaryCircle}>
                            <Trophy color="#eab308" strokeWidth={1.5} size={80} />
                        </View>
                        <Text style={styles.summaryTitle}>Session Complete!</Text>
                        <Text style={styles.summarySubtitle}>You focused for {initialMinutes} minutes.</Text>

                        <View style={styles.xpCard}>
                            <Text style={styles.xpLabel}>EARNED</Text>
                            <Text style={[styles.xpValue, { color: '#eab308' }]}>+{xp || 100} XP</Text>
                        </View>

                        <TouchableOpacity onPress={handleShareAndClaim} style={styles.controlButton}>
                            <LinearGradient
                                colors={['#ffffff', '#e2e8f0']}
                                style={styles.gradientButton}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={[styles.buttonText, { color: '#000' }]}>Proof & Post</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ScreenGradient>
        );
    }

    return (
        <ScreenGradient>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { zIndex: 1 }]}>
                        <ArrowLeft size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Focus Mode</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.content}>
                    <Text style={styles.challengeTitle}>{title}</Text>
                    <Text style={styles.challengeSubtitle}>{isActive ? "Deep Work in Progress" : "Ready to Start?"}</Text>

                    {/* Timer Circle */}
                    <View style={styles.timerContainer}>
                        <View style={styles.timerCircle}>
                            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                        </View>
                    </View>

                    <Text style={styles.instructionText}>
                        {isActive
                            ? "You can lock your phone. Leaving the app triggers a reminder."
                            : "Press Start to begin your session."}
                    </Text>

                    {/* Controls */}
                    <TouchableOpacity onPress={toggleTimer} style={styles.controlButton}>
                        <LinearGradient
                            colors={isActive ? ['#eab308', '#a16207'] : ['#22c55e', '#15803d']}
                            style={styles.gradientButton}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            {isActive ? <Square fill="#fff" color="#fff" size={24} /> : <Play fill="#fff" color="#fff" size={24} />}
                            <Text style={styles.buttonText}>
                                {isActive ? "Give Up" : "Start Focus"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Reset (Only if paused/stopped and not at start) */}
                    {!isActive && timeLeft !== initialSeconds && (
                        <TouchableOpacity onPress={resetTimer} style={styles.resetButton}>
                            <Text style={styles.resetButtonText}>Reset Timer</Text>
                        </TouchableOpacity>
                    )}

                </View>
            </SafeAreaView>
        </ScreenGradient>
    );
}

// Notification Helper
async function schedulePushNotification(title: string, body: string) {
    // Only schedule if we have permission logic handled (best effort)
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: true,
            },
            trigger: null, // Immediate
        });
    } catch (e) {
        console.log("Failed to schedule notification", e);
    }
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (!Device.isDevice) {
        // Simulator - silently fail or just return
        console.log('Must use physical device for Push Notifications');
        return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        Alert.alert('Permission missing', 'Enable notifications to use Focus Mode effectively!');
        return;
    }
    // Handle error if token generation fails
    try {
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        return token;
    } catch (e) {
        console.log(e);
        return;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    challengeTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    challengeSubtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        marginBottom: 40,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    timerContainer: {
        width: width * 0.7,
        height: width * 0.7,
        borderRadius: (width * 0.7) / 2,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    timerCircle: {
        width: '100%',
        height: '100%',
        borderRadius: (width * 0.7) / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerText: {
        color: '#fff',
        fontSize: 64,
        fontVariant: ['tabular-nums'],
        fontWeight: '200',
    },
    instructionText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    controlButton: {
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        marginBottom: 16,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        gap: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    resetButton: {
        padding: 10,
    },
    resetButtonText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        fontWeight: '600',
    },
    summaryCircle: {
        marginBottom: 24,
    },
    summaryTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    summarySubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 32,
        textAlign: 'center',
    },
    xpCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 40,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    xpLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 1,
        marginBottom: 4,
    },
    xpValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#22c55e',
    },
});
