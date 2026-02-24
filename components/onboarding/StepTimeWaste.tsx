import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 80;
const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface StepTimeWasteProps {
    onNext: (data: { hoursWasted: number }) => void;
}

export const StepTimeWaste: React.FC<StepTimeWasteProps> = ({ onNext }) => {
    const [hours, setHours] = useState(0);

    // Simpler slider logic for MVP: Just tap/drag on a track
    // Let's use a simpler approach for the slider to avoid complex gesture state management in this snippet
    // We'll simulate a slider with a simple view that updates on touch

    return (
        <View style={styles.container}>
            <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                <Text style={styles.title}>How many hours a week do you waste on distractions?</Text>
                <Text style={styles.subtitle}>Eg. doom scrolling, procrastinating...</Text>
            </Animated.View>

            {/* Gauge */}
            <View style={styles.gaugeContainer}>
                <Svg height="200" width="200" viewBox="0 0 200 200">
                    <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                            <Stop offset="0" stopColor="#EF4444" stopOpacity="1" />
                            <Stop offset="1" stopColor="#F87171" stopOpacity="1" />
                        </LinearGradient>
                    </Defs>
                    {/* Background Circle */}
                    <Circle
                        cx="100"
                        cy="100"
                        r={RADIUS}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="15"
                        fill="transparent"
                        strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                        strokeLinecap="round"
                    />
                    {/* Progress Circle (Inverted for visual effect, simpler) */}
                    <Circle
                        cx="100"
                        cy="100"
                        r={RADIUS}
                        stroke="url(#grad)"
                        strokeWidth="15"
                        fill="transparent"
                        strokeDasharray={`${CIRCUMFERENCE}`}
                        strokeDashoffset={CIRCUMFERENCE - (CIRCUMFERENCE * (hours / 100))}
                        strokeLinecap="round"
                        rotation="-90"
                        origin="100, 100"
                    />
                </Svg>
                <View style={styles.gaugeTextContainer}>
                    <Text style={styles.gaugeValue}>{hours}h</Text>
                </View>
            </View>

            {/* Simple Slider UI using a row of buttons or just use a simpler Reanimated implementation? 
                Let's do a simple range slider using standard Slider if available, or just a custom track.
                Since we can't easily drag without GestureHandler root setup properly (which might be handled in _layout), 
                I'll stick to a simple touchable track.
            */}
            {/* 
                Reverting to custom slider to avoid native dependency issues if user cannot rebuild.
                Improving smoothness by using direct touch handling.
            */}
            <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Slide to adjust</Text>
                <View
                    style={styles.sliderTrack}
                    onTouchStart={(e) => {
                        const touchX = e.nativeEvent.locationX;
                        let h = Math.round((touchX / SLIDER_WIDTH) * 100);
                        h = Math.max(0, Math.min(100, h));
                        setHours(h);
                    }}
                    onTouchMove={(e) => {
                        const touchX = e.nativeEvent.locationX;
                        let h = Math.round((touchX / SLIDER_WIDTH) * 100);
                        h = Math.max(0, Math.min(100, h));
                        setHours(h);
                    }}
                >
                    <View style={[styles.sliderFill, { width: `${hours}%` }]} />
                    <View style={[styles.sliderThumb, { left: `${hours}%` }]} />
                </View>
            </View>

            <View style={styles.footer}>
                <View style={[styles.button, styles.buttonNext]}>
                    <Text style={styles.buttonText} onPress={() => onNext({ hoursWasted: hours })}>Next</Text>
                </View>
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
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        marginBottom: 40,
    },
    gaugeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60,
    },
    gaugeTextContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gaugeValue: {
        fontSize: 48,
        fontWeight: '800',
        color: '#EF4444',
    },
    sliderContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 10,
    },
    sliderLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
    },
    sliderTrack: {
        width: SLIDER_WIDTH,
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 3,
        justifyContent: 'center',
    },
    sliderFill: {
        height: '100%',
        backgroundColor: '#EF4444',
        borderRadius: 3,
    },
    sliderThumb: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        marginLeft: -12, // Center thumb
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
    buttonNext: {
        backgroundColor: '#3B82F6',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        width: '100%',
        textAlign: 'center',
        lineHeight: 56, // Vertically center text
    }
});
