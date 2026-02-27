import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface StepAnalysisProps {
    onNext: () => void;
}

export const StepAnalysis: React.FC<StepAnalysisProps> = ({ onNext }) => {
    return (
        <View style={styles.container}>
            <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                <Text style={styles.title}>We got some <Text style={{ color: '#EF4444' }}>BAD</Text> news...</Text>
                <Text style={styles.subtitle}>
                    Your responses show 35% <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>more</Text> signs of poor lifestyle habits compared to the average.
                </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.chartContainer}>
                <Svg height="300" width={width - 48} viewBox="0 0 300 300">
                    <Defs>
                        <LinearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="#F87171" stopOpacity="1" />
                            <Stop offset="1" stopColor="#991B1B" stopOpacity="1" />
                        </LinearGradient>
                        <LinearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="#34D399" stopOpacity="1" />
                            <Stop offset="1" stopColor="#064E3B" stopOpacity="1" />
                        </LinearGradient>
                        <LinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="rgba(255,255,255,0.1)" stopOpacity="1" />
                            <Stop offset="1" stopColor="rgba(255,255,255,0.02)" stopOpacity="1" />
                        </LinearGradient>
                    </Defs>

                    {/* Chart Background/Axis */}
                    <Rect x="0" y="0" width="300" height="300" fill="transparent" />

                    {/* Your Score Bar */}
                    {/* Shadow/Glow effect simulated with opacity layer behind or just rich gradient */}
                    <Rect
                        x="50"
                        y="50"
                        width="80"
                        height="200"
                        fill="url(#redGrad)"
                        rx="12"
                    />
                    <SvgText
                        x="90"
                        y="40"
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="20"
                        fontWeight="bold"
                    >
                        47%
                    </SvgText>
                    <SvgText
                        x="90"
                        y="275"
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.6)"
                        fontSize="14"
                        fontWeight="500"
                    >
                        Your Score
                    </SvgText>

                    {/* Average Bar */}
                    <Rect
                        x="170"
                        y="180"
                        width="80"
                        height="70"
                        fill="url(#greenGrad)"
                        rx="12"
                    />
                    <SvgText
                        x="210"
                        y="170"
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="20"
                        fontWeight="bold"
                    >
                        12%
                    </SvgText>
                    <SvgText
                        x="210"
                        y="275"
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.6)"
                        fontSize="14"
                        fontWeight="500"
                    >
                        Average
                    </SvgText>
                </Svg>
            </Animated.View>

            <Animated.View
                entering={FadeInDown.delay(600).duration(600)}
                style={styles.infoBox}
            >
                <Text style={styles.infoText}>
                    This is normal. People in your age group often face extra challenges with self-commitment.
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
