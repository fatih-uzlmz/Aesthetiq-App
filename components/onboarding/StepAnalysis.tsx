import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface StepAnalysisProps {
    onNext: () => void;
}

export const StepAnalysis: React.FC<StepAnalysisProps> = ({ onNext }) => {
    return (
        <View style={styles.container}>
            <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                <Text style={styles.title}>Your discipline is <Text style={{ color: '#EF4444' }}>FADING</Text></Text>
                <Text style={styles.subtitle}>
                    You have the desire to improve, but your daily habits are actively sabotaging your momentum.
                </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.chartContainer}>
                <Svg height="250" width={width - 48} viewBox="0 0 300 250">
                    <Defs>
                        {/* Gradient for the line itself, changing from white/green to red as it falls */}
                        <LinearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                            <Stop offset="0" stopColor="#E2E8F0" stopOpacity="1" />
                            <Stop offset="0.3" stopColor="#34D399" stopOpacity="1" />
                            <Stop offset="0.8" stopColor="#EF4444" stopOpacity="1" />
                        </LinearGradient>

                    </Defs>

                    {/* Chart Background/Axis Base */}
                    <Rect x="0" y="0" width="300" height="250" fill="transparent" />

                    {/* X and Y Axes */}
                    <Path d="M 20 20 L 20 230" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
                    <Path d="M 20 230 L 280 230" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />

                    {/* Axis Labels */}
                    <SvgText x="150" y="248" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="12" fontWeight="500">
                        Time
                    </SvgText>
                    <SvgText x="10" y="125" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="12" fontWeight="500" rotation="-90" origin="10, 125">
                        Performance
                    </SvgText>

                    {/* The Line Curve: Starts middle-low, bumps up (motivation), then crashes down (friction) */}
                    <Path
                        d="M 22 120 Q 80 70, 140 120 T 278 230"
                        fill="none"
                        stroke="url(#lineGrad)"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />

                    {/* Peak / Motivation Point */}
                    <Circle cx="81" cy="94" r="5" fill="#34D399" />
                    <SvgText x="81" y="70" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600">
                        Initial Motivation
                    </SvgText>

                    {/* Trough / Reality Point */}
                    <Circle cx="260" cy="216" r="5" fill="#EF4444" />
                    <SvgText x="272" y="170" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600">
                        Friction &amp;
                    </SvgText>
                    <SvgText x="272" y="187" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600">
                        Burnout
                    </SvgText>
                </Svg>
            </Animated.View>

            <Animated.View
                entering={FadeInDown.delay(600).duration(600)}
                style={styles.infoBox}
            >
                <Text style={styles.infoText}>
                    Motivation gets you started, but it&apos;s unreliable. Discipline is what keeps you going when it gets hard.
                </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(900).duration(600)} style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={onNext}>
                    <Text style={styles.buttonText}>Let&apos;s Go</Text>
                </TouchableOpacity>
            </Animated.View>
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
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    infoBox: {
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        marginBottom: 20,
    },
    infoText: {
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        lineHeight: 20,
    },
    footer: {
        marginTop: 'auto',
        paddingBottom: 40,
        width: '100%',
    },
    button: {
        backgroundColor: '#fff',
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    }
});
