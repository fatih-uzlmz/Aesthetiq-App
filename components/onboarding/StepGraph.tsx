import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, FadeInDown, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 48;
const CHART_HEIGHT = 200;

// Simple Bezier Path roughly matching the green graph
const PATH_D = `M 10 180 C 40 180, 50 160, 80 140 S 110 170, 140 120 S 170 50, 200 100 S 230 150, 260 80 S 290 20, 320 50`;
const PATH_LENGTH = 1000; // Approx

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface StepGraphProps {
    onFinish: () => void;
}

export const StepGraph: React.FC<StepGraphProps> = ({ onFinish }) => {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(1, { duration: 2500, easing: Easing.out(Easing.cubic) });
    }, []);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: PATH_LENGTH * (1 - progress.value),
    }));

    return (
        <View style={styles.container}>
            <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                <Text style={styles.title}>Over time, discipline starts to build naturally</Text>
            </Animated.View>

            <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>Progress over time</Text>
                    <Text style={styles.chartBadge}>LOCK-IN</Text>
                </View>

                <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                    <Defs>
                        <LinearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                            <Stop offset="0" stopColor="#10B981" stopOpacity="1" />
                            <Stop offset="1" stopColor="#34D399" stopOpacity="1" />
                        </LinearGradient>
                    </Defs>

                    {/* Path */}
                    <AnimatedPath
                        d={PATH_D}
                        stroke="#10B981"
                        strokeWidth="5"
                        fill="transparent"
                        strokeDasharray={PATH_LENGTH}
                        animatedProps={animatedProps}
                        strokeLinecap="round"
                    />
                </Svg>

                <View style={styles.chartLabels}>
                    <Text style={styles.label}>0D</Text>
                    <Text style={styles.label}>1W</Text>
                    <Text style={styles.label}>2W</Text>
                    <Text style={styles.label}>4W</Text>
                    <Text style={[styles.label, { color: '#10B981', fontWeight: 'bold' }]}>6W</Text>
                </View>
            </View>

            <Animated.View
                entering={FadeInDown.delay(1000).duration(800)}
                style={styles.pitchContainer}
            >
                <Text style={styles.pitchText}>
                    Many people notice positive changes in their <Text style={styles.highlight}>focus</Text>, <Text style={styles.highlight}>mindset</Text>, and <Text style={styles.highlight}>overall well-being</Text> as they stay consistent with Lock In.
                </Text>
            </Animated.View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={onFinish}>
                    <Text style={styles.buttonText}>Start My Reset</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 32,
    },
    chartCard: {
        width: '100%',
        backgroundColor: 'rgba(22, 22, 30, 0.6)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: 30,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    chartTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    chartBadge: {
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '900',
        letterSpacing: 1,
    },
    chartLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 10,
    },
    label: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        fontWeight: '600',
    },
    pitchContainer: {
        paddingHorizontal: 10,
    },
    pitchText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 28,
    },
    highlight: {
        color: '#10B981',
        fontWeight: '700',
    },
    footer: {
        marginTop: 'auto',
        paddingBottom: 40,
        width: '100%',
    },
    button: {
        backgroundColor: '#3B82F6',
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    }
});
