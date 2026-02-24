import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.5;
const RADIUS = CIRCLE_SIZE / 2;
const STROKE_WIDTH = 15;
const CIRCUMFERENCE = 2 * Math.PI * (RADIUS - STROKE_WIDTH / 2);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text); // Just in case we animate text props

// Using TextInput for animated numbers is a common trick, but here we'll just update text via state or simple reanimated text logic
// For simplicity in this "sleek" UI, let's use a state-based text update synced with animation or a Reanimated Text component

interface StepAnalyzingProps {
    onNext: () => void;
}

export function StepAnalyzing({ onNext }: StepAnalyzingProps) {
    const progress = useSharedValue(0);
    const opacity = useSharedValue(1);
    const textOpacity = useSharedValue(0); // For the final hopeful message
    const mainContainerOpacity = useSharedValue(1); // To fade out the loading UI

    const [loadingText, setLoadingText] = React.useState("Running analysis...");
    const [percent, setPercent] = React.useState(0);

    useEffect(() => {
        // Animate Progress
        progress.value = withTiming(1, { duration: 2500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });

        // Text Sequence
        const timer1 = setTimeout(() => setLoadingText("Looking for patterns..."), 800);
        const timer2 = setTimeout(() => setLoadingText("Calculating potential..."), 1600);
        const timer3 = setTimeout(() => setLoadingText("Finalizing plan..."), 2200);

        // Update percentage number for display
        const interval = setInterval(() => {
            setPercent(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Non-linear increment to look cooler
                return Math.min(100, p + Math.floor(Math.random() * 3) + 1);
            });
        }, 20); // 20ms * 100 steps ~= 2s

        // Transition to "Hopeful Message" after loading
        const totalDuration = 2500;

        // At 2.5s, fade out loading UI, fade in Message
        setTimeout(() => {
            mainContainerOpacity.value = withTiming(0, { duration: 500 });
            textOpacity.value = withDelay(500, withTiming(1, { duration: 1000 }));

            // Wait for message to be read, then move next
            setTimeout(() => {
                onNext();
            }, 3000); // 2.5s load + 1s fade + 1.5s read
        }, totalDuration);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearInterval(interval);
        };
    }, []);

    const animatedCircleProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
        };
    });

    const loadingStyle = useAnimatedStyle(() => ({
        opacity: mainContainerOpacity.value
    }));

    const messageStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: interpolate(textOpacity.value, [0, 1], [20, 0]) }]
    }));

    // Calculate percent based on the shared value for smoother lock? 
    // Actually the interval approach is fine for the "hacker" feel.

    return (
        <View style={styles.container}>
            {/* Loading UI */}
            <Animated.View style={[styles.centerContent, loadingStyle]}>
                <Text style={styles.header}>Analyzing Your Responses...</Text>

                <View style={styles.circleContainer}>
                    <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
                        <Defs>
                            <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                                <Stop offset="0" stopColor="#10B981" stopOpacity="0.8" />
                                <Stop offset="1" stopColor="#34D399" stopOpacity="1" />
                            </SvgLinearGradient>
                        </Defs>
                        {/* Background Track */}
                        <Circle
                            cx={CIRCLE_SIZE / 2}
                            cy={CIRCLE_SIZE / 2}
                            r={RADIUS - STROKE_WIDTH / 2}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth={STROKE_WIDTH}
                            fill="none"
                        />
                        {/* Progress */}
                        <AnimatedCircle
                            cx={CIRCLE_SIZE / 2}
                            cy={CIRCLE_SIZE / 2}
                            r={RADIUS - STROKE_WIDTH / 2}
                            stroke="url(#grad)"
                            strokeWidth={STROKE_WIDTH}
                            fill="none"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeLinecap="round"
                            rotation="-90"
                            origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
                            animatedProps={animatedCircleProps}
                        />
                    </Svg>
                    <View style={styles.innerCircle}>
                        <Text style={styles.percentText}>{percent}%</Text>
                    </View>
                </View>

                <Text style={styles.loadingText}>{loadingText}</Text>
                <Text style={styles.subText}>Calculating your personalized growth plan...</Text>
            </Animated.View>

            {/* Hopeful Message Layer */}
            <Animated.View style={[styles.messageOverlay, messageStyle]} pointerEvents="none">
                <Text style={styles.hopefulTitle}>You don't lack potential.</Text>
                <Text style={styles.hopefulSubtitle}>You lack a system.</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 40,
    },
    circleContainer: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    innerCircle: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
    },
    loadingText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
        marginBottom: 8,
    },
    subText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
    },
    messageOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    hopefulTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 16,
    },
    hopefulSubtitle: {
        fontSize: 20,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginBottom: 8,
    }
});
