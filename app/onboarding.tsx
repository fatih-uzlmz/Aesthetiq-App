import { AnimatedGradient } from '@/components/AnimatedGradient';
import { useSession } from '@/ctx';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Star, Zap } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, Easing, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import New Steps
import { StepAnalysis } from '@/components/onboarding/StepAnalysis';
import { StepAnalyzing } from '@/components/onboarding/StepAnalyzing';
import { StepArea } from '@/components/onboarding/StepArea';
import { StepFinal } from '@/components/onboarding/StepFinal';
import { StepFocus } from '@/components/onboarding/StepFocus';
import { StepIntro } from '@/components/onboarding/StepIntro';
import { StepPlan } from '@/components/onboarding/StepPlan';
import { StepSymptoms } from '@/components/onboarding/StepSymptoms';
import { StepTimeWaste } from '@/components/onboarding/StepTimeWaste';

const { width, height } = Dimensions.get('window');

type OnboardingStep = 'landing' | 'intro' | 'focus' | 'area' | 'timewaste' | 'symptoms' | 'analyzing' | 'analysis' | 'plan' | 'final';

const FloatingHero = () => {
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 3000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const translateY1 = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -15] });
    const translateY2 = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }); // Slower/Less movement
    const translateY3 = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }); // Faster

    return (
        <View style={styles.heroContainer}>
            {/* Card 1: Habit Tracker (Top Right) */}
            <Animated.View style={[styles.glassCard, styles.card1, { transform: [{ translateY: translateY1 }] }]}>
                <View style={styles.cardHeader}>
                    <View style={[styles.iconBox, { backgroundColor: 'rgba(52, 211, 153, 0.2)' }]}>
                        <CheckCircle size={14} color="#34D399" />
                    </View>
                    <Text style={styles.cardTitle}>Morning Routine</Text>
                </View>
                <View style={styles.habitRow}>
                    <View style={[styles.habitDot, styles.habitDotActive]} />
                    <View style={[styles.habitDot, styles.habitDotActive]} />
                    <View style={[styles.habitDot, styles.habitDotActive]} />
                    <View style={[styles.habitDot, styles.habitDotActive]} />
                    <View style={styles.habitDot} />
                </View>
            </Animated.View>

            {/* Card 2: Focus Timer (Center Left) */}
            <Animated.View style={[styles.glassCard, styles.card2, { transform: [{ translateY: translateY2 }] }]}>
                <View style={styles.cardHeader}>
                    <View style={[styles.iconBox, { backgroundColor: 'rgba(96, 165, 250, 0.2)' }]}>
                        <Clock size={14} color="#60A5FA" />
                    </View>
                    <Text style={styles.cardTitle}>Deep Work</Text>
                </View>
                <View style={styles.timerBarBg}>
                    <View style={[styles.timerBarFill, { width: '65%' }]} />
                </View>
                <Text style={styles.cardSubtext}>45m remaining</Text>
            </Animated.View>

            {/* Card 3: XP Badge (Bottom Right) */}
            <Animated.View style={[styles.glassCard, styles.card3, { transform: [{ translateY: translateY3 }] }]}>
                <View style={styles.cardHeader}>
                    <View style={[styles.iconBox, { backgroundColor: 'rgba(251, 191, 36, 0.2)' }]}>
                        <Zap size={14} color="#FBBF24" />
                    </View>
                    <Text style={styles.cardTitle}>Daily Streak</Text>
                </View>
                <Text style={styles.xpText}>🔥 12 Days</Text>
            </Animated.View>
        </View>
    );
};

export default function OnboardingScreen() {
    const router = useRouter();
    const { completeOnboarding, session } = useSession();

    // State Management
    const [step, setStep] = useState<OnboardingStep>('landing');
    const [loading, setLoading] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const testimonials = [
        "I don't usually stick to apps like this... but something about this one hit different.",
        "Finally an app that actually helped me build real discipline. My screen time dropped by 3 hours in the first week.",
    ];

    const handleTestimonialScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / (width - 48));
        setActiveTestimonial(index);
    };

    // Data Collection
    const [onboardingData, setOnboardingData] = useState({
        focus: '',
        areas: [] as string[],
        hoursWasted: 0,
        symptoms: [] as string[]
    });

    const goToStep = (nextStep: OnboardingStep) => {
        // LayoutAnimation can conflict with Reanimated entering animations causing crashes.
        // Removed to prevent "See what's possible" crash. Components handle their own entry animations.
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setStep(nextStep);
    };

    const handleLandingStart = () => goToStep('intro');

    const handleIntroNext = () => goToStep('focus');

    const handleFocusNext = (data: { focus: string }) => {
        setOnboardingData(prev => ({ ...prev, ...data }));
        goToStep('area');
    };

    const handleAreaNext = (data: { areas: string[] }) => {
        setOnboardingData(prev => ({ ...prev, ...data }));
        goToStep('timewaste');
    };

    const handleTimeWasteNext = (data: { hoursWasted: number }) => {
        setOnboardingData(prev => ({ ...prev, ...data }));
        goToStep('symptoms');
    };

    const handleSymptomsNext = (data: { symptoms: string[] }) => {
        setOnboardingData(prev => ({ ...prev, ...data }));
        goToStep('analyzing');
    };

    const handleAnalyzingNext = () => goToStep('analysis');

    const handleAnalysisNext = () => goToStep('final');

    const handleFinalNext = () => goToStep('plan');

    const handlePlanNext = () => handleFinish();

    const handleFinish = async () => {
        setLoading(true);
        try {
            // Default Protocol
            const today = new Date().toDateString();
            const defaultIds = ['c_new_1', 'c_new_2', 'c6', 'c_new_4']; // Phone-Free, Reading, Study, Walk
            await AsyncStorage.multiSet([
                ['daily_lockin_date', today],
                ['daily_lockin_ids', JSON.stringify(defaultIds)],
                // generic header focus
                ['daily_focus_date', today],
                ['daily_focus_id', defaultIds[0]]
            ]);

            // Simplify data for 'discipline_reason' text field if needed,
            // or store full object in a JSON column if one exists.
            const disciplineReason = `${onboardingData.focus} | Areas: ${onboardingData.areas.join(', ')} | Wasted: ${onboardingData.hoursWasted}h`;

            // Ensure we have a session before updating user
            let currentSession = session;
            if (!currentSession) {
                // Try to get session directly
                const { data } = await supabase.auth.getSession();
                currentSession = data.session;
            }

            if (currentSession) {
                // Update user metadata / profile
                const { error } = await supabase.auth.updateUser({
                    data: {
                        discipline_reason: disciplineReason,
                        onboarding_data: onboardingData
                    }
                });

                if (error) console.log("Update user error (non-fatal):", error);

                if (currentSession?.user) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .update({
                            discipline_reason: disciplineReason,
                            // If you have a jsonb column for details:
                            // onboarding_details: onboardingData
                        })
                        .eq('id', currentSession.user.id);

                    if (profileError) console.log("Profile update error:", profileError);
                }
            } else {
                console.log("No session found during onboarding finish with skipped auth. Starting fresh.");
                // Optionally trigger anonymous sign in here if critical, but for now just proceed to app
            }

            // Complete
            completeOnboarding();

        } catch (error: any) {
            console.error('Error saving onboarding:', error);
            // Don't block user if saving fails
            completeOnboarding();
        } finally {
            setLoading(false);
        }
    };

    // Render Steps
    const renderContent = () => {
        switch (step) {
            case 'landing':
                return (
                    <View style={styles.landingContent}>
                        {/* Header / Logo */}
                        <View style={styles.landingHeader}>
                            <View style={styles.headerBlock}>
                                <Text style={styles.brandTitle}>AESTHETIQ</Text>

                            </View>
                        </View>

                        {/* Hero Visuals */}
                        <FloatingHero />

                        {/* Main CTA Content */}
                        <View style={styles.bottomSection}>
                            <View style={styles.textBlock}>
                                <Text style={styles.headline}>
                                    Your reset starts now.
                                </Text>

                            </View>

                            {/* Testimonials Carousel */}
                            <ScrollView
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={handleTestimonialScroll}
                                style={styles.testimonialScroll}
                                contentContainerStyle={styles.testimonialScrollContent}
                            >
                                {testimonials.map((text, idx) => (
                                    <View key={idx} style={[styles.testimonialCard, { width: width - 48 }]}>
                                        <View style={styles.starsRow}>
                                            {[1, 2, 3, 4, 5].map(i => <Star key={`${idx}-${i}`} size={14} color="#FBBF24" fill="#FBBF24" />)}
                                        </View>
                                        <Text style={styles.testimonialText}>
                                            "{text}"
                                        </Text>
                                    </View>
                                ))}
                            </ScrollView>
                            {/* Pagination Dots */}
                            <View style={styles.dotsRow}>
                                {testimonials.map((_, idx) => (
                                    <View
                                        key={idx}
                                        style={[
                                            styles.dot,
                                            idx === activeTestimonial && styles.dotActive,
                                        ]}
                                    />
                                ))}
                            </View>

                            <TouchableOpacity
                                onPress={handleLandingStart}
                                activeOpacity={0.9}
                                style={styles.buttonShadow}
                            >
                                <LinearGradient
                                    colors={['#909090', '#E0E0E0', '#909090']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.startButton}
                                >
                                    <Text style={styles.startButtonText}>Start Quiz</Text>
                                    <ArrowRight size={20} color="#000" />
                                </LinearGradient>
                            </TouchableOpacity>


                        </View>
                    </View>
                );
            case 'intro':
                return <StepIntro onNext={handleIntroNext} />;
            case 'focus':
                return <StepFocus onNext={handleFocusNext} />;
            case 'area':
                return <StepArea onNext={handleAreaNext} />;
            case 'timewaste':
                return <StepTimeWaste onNext={handleTimeWasteNext} />;
            case 'symptoms':
                return <StepSymptoms onNext={handleSymptomsNext} />;
            case 'analyzing':
                return <StepAnalyzing onNext={handleAnalyzingNext} />;
            case 'analysis':
                return <StepAnalysis onNext={handleAnalysisNext} />;
            case 'plan':
                return <StepPlan onNext={handlePlanNext} />;
            case 'final':
                return <StepFinal onNext={handleFinalNext} />;
            default:
                return null;
        }
    };

    return (
        <AnimatedGradient>
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                {/* Back button for steps (optional, maybe top left) */}
                {step !== 'landing' && step !== 'intro' && step !== 'analyzing' && (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            // Simple back logic
                            if (step === 'focus') setStep('intro');
                            if (step === 'area') setStep('focus');
                            if (step === 'timewaste') setStep('area');
                            if (step === 'symptoms') setStep('timewaste');
                            if (step === 'analysis') setStep('symptoms'); // Skip analyzing on back? Or go back to symptoms.
                            if (step === 'plan') setStep('analysis');
                            if (step === 'final') setStep('plan');
                        }}
                    >
                        <ArrowLeft color="rgba(255,255,255,0.5)" size={24} />
                    </TouchableOpacity>
                )}

                {/* DEV SKIP BUTTON - Remove in production */}
                <TouchableOpacity
                    style={{ position: 'absolute', top: 60, right: 24, zIndex: 999, padding: 8, backgroundColor: 'rgba(255,0,0,0.3)', borderRadius: 8 }}
                    onPress={() => {
                        const steps: OnboardingStep[] = ['landing', 'intro', 'focus', 'area', 'timewaste', 'symptoms', 'analyzing', 'analysis', 'plan', 'final'];
                        const currentIndex = steps.indexOf(step);
                        if (currentIndex < steps.length - 1) {
                            // LayoutAnimation can conflict, verify if safe or remove
                            setStep(steps[currentIndex + 1]);
                        }
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>DEV SKIP ⏩</Text>
                </TouchableOpacity>

                {renderContent()}

                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.loadingText}>Finalizing your plan...</Text>
                    </View>
                )}
            </SafeAreaView>
        </AnimatedGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    landingContent: { flex: 1, padding: 24, paddingBottom: 10 },
    landingHeader: { alignItems: 'flex-start', paddingTop: 0, paddingHorizontal: 16, zIndex: 10 },
    headerBlock: { marginBottom: 10 },
    brandTitle: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase', lineHeight: 24 },
    brandSubtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '500', marginTop: 4 },

    // Floating Hero Styles
    heroContainer: { height: height * 0.45, position: 'relative', marginTop: 20 },
    glassCard: {
        position: 'absolute',
        backgroundColor: 'rgba(22, 22, 30, 0.6)',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    card1: { top: 0, right: -20, width: 220, zIndex: 2 },
    card2: { top: 90, left: -20, width: 230, zIndex: 3 },
    card3: { top: 190, right: 16, width: 160, zIndex: 1 },

    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
    iconBox: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    cardTitle: { color: '#fff', fontSize: 13, fontWeight: '600' },
    cardSubtext: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 6 },

    habitRow: { flexDirection: 'row', gap: 6 },
    habitDot: { width: 24, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.1)' },
    habitDotActive: { backgroundColor: '#34D399' },

    timerBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginTop: 4, width: '100%' },
    timerBarFill: { height: '100%', backgroundColor: '#60A5FA', borderRadius: 3 },

    xpText: { color: '#fff', fontSize: 18, fontWeight: '800' },

    // Bottom Section
    bottomSection: { flex: 1, justifyContent: 'flex-end', paddingBottom: 20 },
    textBlock: { marginBottom: 30, alignItems: 'center' },
    headline: { fontSize: 36, fontWeight: '800', color: '#fff', lineHeight: 40, textAlign: 'center', marginBottom: 12 },
    subheadline: { fontSize: 16, color: 'rgba(255,255,255,0.6)', fontWeight: '400', textAlign: 'center' },

    testimonialCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        height: 120,
        justifyContent: 'flex-start',
    },
    starsRow: { flexDirection: 'row', gap: 4, marginBottom: 8 },
    testimonialText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontStyle: 'italic', lineHeight: 20 },
    testimonialScroll: { marginBottom: 0, height: 120, overflow: 'visible' },
    testimonialScrollContent: { alignItems: 'flex-start' },
    dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 12, marginBottom: 24 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' },
    dotActive: { backgroundColor: '#fff' },

    buttonShadow: {
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    startButton: {
        paddingVertical: 18,
        borderRadius: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    startButtonText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
    loginLink: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },

    // Global Elements
    backButton: {
        position: 'absolute',
        top: 60, // approximate safe area
        left: 24,
        zIndex: 50,
        padding: 8,
    },
    loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
    loadingText: { color: '#fff', fontSize: 16, marginTop: 16, fontWeight: '600' }
});

