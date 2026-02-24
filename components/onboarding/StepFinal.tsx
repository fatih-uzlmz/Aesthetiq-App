import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Defs, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CHART_HEIGHT = 220;
const CHART_WIDTH = width - 96; // 48 (screen padding) + 48 (card padding)

interface StepFinalProps {
    onNext: () => void;
}

export function StepFinal({ onNext }: StepFinalProps) {
    // Graph Configuration
    const START_Y = CHART_HEIGHT - 40;
    const END_Y_HIGH = 40; // High point for "Consistency"
    const END_Y_LOW = CHART_HEIGHT - 40; // Low point for "Without" (stays flat/dips)
    // Pull points left by 20px to prevent hitting the edge visually
    const GRAPH_END_X = CHART_WIDTH - 20;

    // Path 1: "Without Lock In" - Red, dashed, relatively flat with slight dip
    // Cubic Bezier: Start -> Control1 -> Control2 -> End
    // Control points pull it slightly down to simulate "stagnation" or "drift"
    const pathLow = `
        M 0,${START_Y} 
        C ${GRAPH_END_X * 0.4},${START_Y + 10} 
          ${GRAPH_END_X * 0.7},${START_Y + 15} 
          ${GRAPH_END_X},${END_Y_LOW}
    `;

    // Path 2: "With Lock In" - Green, exponential growth
    // Starts flat, then curves up aggressively
    const pathHigh = `
        M 0,${START_Y} 
        C ${GRAPH_END_X * 0.5},${START_Y} 
          ${GRAPH_END_X * 0.75},${START_Y - 40} 
          ${GRAPH_END_X},${END_Y_HIGH}
    `;

    // Area under the green curve for gradient fill
    const pathHighArea = `
        ${pathHigh} 
        L ${GRAPH_END_X},${CHART_HEIGHT} 
        L 0,${CHART_HEIGHT} 
        Z
    `;

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.headerTitle}>
                    Your Journey Starts Now
                </Text>

                <View style={styles.chartContainer}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartTitle}>Discipline Path</Text>
                        <Text style={styles.brandTitle}>AESTHETIQ</Text>
                    </View>

                    <View style={styles.graphArea}>
                        <Svg width={CHART_WIDTH} height={CHART_HEIGHT} style={{ overflow: 'visible' }}>
                            <Defs>
                                <SvgLinearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0" stopColor="#10B981" stopOpacity="0.2" />
                                    <Stop offset="1" stopColor="#10B981" stopOpacity="0" />
                                </SvgLinearGradient>
                            </Defs>

                            {/* Green Area Fill */}
                            <Path
                                d={pathHighArea}
                                fill="url(#gradGreen)"
                            />

                            {/* "Without" Path - Red Dotted */}
                            <Path
                                d={pathLow}
                                stroke="#EF4444"
                                strokeWidth={3}
                                strokeDasharray="6, 8"
                                strokeLinecap="round"
                                fill="none"
                            />

                            {/* "With" Path - Green Solid */}
                            <Path
                                d={pathHigh}
                                stroke="#10B981"
                                strokeWidth={4}
                                strokeLinecap="round"
                                fill="none"
                            />

                            {/* Start Point */}
                            <Circle cx="0" cy={START_Y} r="6" fill="#fff" />

                            {/* End Point Red */}
                            <Circle cx={GRAPH_END_X} cy={END_Y_LOW} r="6" fill="#EF4444" />

                            {/* End Point Green */}
                            <Circle cx={GRAPH_END_X} cy={END_Y_HIGH} r="6" fill="#10B981" />
                        </Svg>

                        {/* Labels - Positioned relative to the end points */}

                        {/* Green Label */}
                        <View style={[styles.labelContainer, { top: END_Y_HIGH - 10, right: 20 }]}>
                            <Text style={[styles.labelText, { color: '#10B981' }]}>Consistency{'\n'}With Aesthetiq</Text>
                        </View>

                        {/* Red Label */}
                        <View style={[styles.labelContainer, { top: END_Y_LOW + 15, right: 20 }]}>
                            <Text style={[styles.labelText, { color: '#EF4444' }]}>Without{'\n'}Aesthetiq</Text>
                        </View>

                        {/* X-Axis Labels */}
                        <View style={styles.xAxis}>
                            <Text style={styles.axisLabel}>Week 1</Text>
                            <Text style={styles.axisLabel}>Week 2</Text>
                            <Text style={styles.axisLabel}>Week 3</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.footerText}>
                    Become the person you always knew you could be.
                </Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={onNext}
                    activeOpacity={0.9}
                    style={styles.buttonShadow}
                >
                    <LinearGradient
                        colors={['#2563EB', '#1D4ED8']} // Blue gradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.nextButton}
                    >
                        <Text style={[styles.nextButtonText, { color: '#fff' }]}>See what's possible</Text>
                        <ArrowRight size={20} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
    },
    chartContainer: {
        width: '100%',
        backgroundColor: 'rgba(22, 22, 30, 0.6)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: 40,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    brandTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: 1,
    },
    graphArea: {
        height: CHART_HEIGHT,
        width: '100%',
        position: 'relative',
        // Ensure labels can render outside if needed, though we clamp them
        marginBottom: 20,
    },
    labelContainer: {
        position: 'absolute',
        backgroundColor: 'rgba(20, 20, 30, 0.8)', // Slight background for readability
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        // Align rigth side of label with right side of graph
        alignItems: 'flex-end',
    },
    labelText: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'right',
        lineHeight: 16,
    },
    xAxis: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: -30,
        left: 0,
        right: 0,
    },
    axisLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
    },
    footerText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        maxWidth: '80%',
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
    },
    buttonShadow: {
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    nextButton: {
        paddingVertical: 18,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButtonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
