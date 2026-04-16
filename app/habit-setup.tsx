import { AnimatedGradient } from '@/components/AnimatedGradient';
import { Colors } from '@/constants/theme';
import { useSession } from '@/ctx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Dumbbell, Brain, Footprints, BookOpen, HeartPulse, Laptop } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const PRESET_HABITS = [
    { id: 'h_gym', name: 'Training', icon: 'Dumbbell', image: require('@/assets/images/aesthetic/gym_1.png') },
    { id: 'h_deepwork', name: 'Deep Work', icon: 'Brain', image: require('@/assets/images/aesthetic/study_1.png') },
    { id: 'h_walk', name: '10k Steps', icon: 'Footprints', image: require('@/assets/images/challenge_reading.jpg') },
    { id: 'h_read', name: 'Reading', icon: 'BookOpen', image: require('@/assets/images/challenge_sunrise.png') },
    { id: 'h_meditate', name: 'Meditate', icon: 'HeartPulse', image: require('@/assets/images/challenge_walk_1.jpg') },
    { id: 'h_code', name: 'Coding', icon: 'Laptop', image: require('@/assets/images/aesthetic/study_2.png') },
];

export default function HabitSetupScreen() {
    const { completeOnboarding } = useSession();
    const router = useRouter();
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // If they already have habits, skip this (useful for logins)
        AsyncStorage.getItem('user_habits').then((val) => {
            if (val) {
                const habits = JSON.parse(val);
                if (habits && habits.length === 3) {
                    completeOnboarding();
                    router.replace('/(tabs)');
                }
            }
        });
    }, []);

    const toggleHabit = (id: string) => {
        if (selected.includes(id)) {
            setSelected(selected.filter((h) => h !== id));
        } else {
            if (selected.length < 3) {
                setSelected([...selected, id]);
            }
        }
    };

    const handleContinue = async () => {
        if (selected.length !== 3) return;
        setLoading(true);
        
        const finalizedHabits = PRESET_HABITS.filter(h => selected.includes(h.id)).map(h => ({
            id: h.id,
            name: h.name,
            streak: 0
        }));

        try {
            await AsyncStorage.setItem('user_habits', JSON.stringify(finalizedHabits));
            completeOnboarding();
            router.replace('/(tabs)');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderIcon = (iconName: string, color: string) => {
        switch (iconName) {
            case 'Dumbbell': return <Dumbbell color={color} size={28} />;
            case 'Brain': return <Brain color={color} size={28} />;
            case 'Footprints': return <Footprints color={color} size={28} />;
            case 'BookOpen': return <BookOpen color={color} size={28} />;
            case 'HeartPulse': return <HeartPulse color={color} size={28} />;
            case 'Laptop': return <Laptop color={color} size={28} />;
            default: return <Check color={color} size={28} />;
        }
    };

    return (
        <AnimatedGradient>
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <View style={styles.header}>
                    <Text style={styles.title}>CHOOSE YOUR HABITS</Text>
                    <Text style={styles.subtitle}>Commit to 3 core habits.</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {PRESET_HABITS.map((habit) => {
                        const isSelected = selected.includes(habit.id);
                        return (
                            <TouchableOpacity
                                key={habit.id}
                                style={[styles.card, isSelected && styles.cardSelected]}
                                onPress={() => toggleHabit(habit.id)}
                                activeOpacity={0.8}
                            >
                                <ImageBackground source={habit.image} style={styles.cardImage} resizeMode="cover">
                                    <LinearGradient
                                        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
                                        style={styles.cardGradient}
                                    />
                                    <View style={styles.cardContent}>
                                        <View style={styles.iconWrapper}>
                                            {renderIcon(habit.icon, '#fff')}
                                        </View>
                                        <Text style={styles.cardTitle}>{habit.name}</Text>
                                    </View>
                                    
                                    <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                                        {isSelected && <Check size={16} color="#000" strokeWidth={3} />}
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        );
                    })}
                    <View style={{ height: 40 }} />
                </ScrollView>

                <View style={styles.footer}>
                    <Text style={styles.counter}>{selected.length} / 3 Selected</Text>
                    <TouchableOpacity
                        style={[styles.button, selected.length !== 3 && styles.buttonDisabled]}
                        disabled={selected.length !== 3 || loading}
                        onPress={handleContinue}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.buttonText}>START CRUSHING IT</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </AnimatedGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'space-between' },
    header: { marginTop: 20, marginBottom: 20, paddingHorizontal: 24 },
    title: { fontSize: 32, fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: 2 },
    subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: 8, fontWeight: '500' },
    
    scrollContent: { paddingHorizontal: 24, paddingBottom: 20, gap: 16 },
    
    card: {
        width: '100%',
        height: 140, // Nice large cinematic ratio
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
        backgroundColor: '#111'
    },
    cardSelected: {
        borderColor: '#fff',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    cardContent: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
    },
    cardTitle: { 
        color: '#fff', 
        fontSize: 24, 
        fontWeight: '800', 
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    
    checkbox: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxActive: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    
    footer: { paddingHorizontal: 24, paddingBottom: 20, paddingTop: 10, backgroundColor: 'transparent' },
    counter: { textAlign: 'center', color: 'rgba(255,255,255,0.8)', marginBottom: 16, fontWeight: '700', fontSize: 14 },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    buttonDisabled: {
        opacity: 0.3,
        shadowOpacity: 0,
    },
    buttonText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1.5 },
});
