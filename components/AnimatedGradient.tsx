import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

export function AnimatedGradient({ children }: { children: React.ReactNode }) {
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 1500 }), // Hold Grey
                withTiming(0, { duration: 4500, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 1000 }) // Hold Black
            ),
            -1,
            false // Don't reverse the sequence, just loop it
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return (
        <View style={styles.container}>
            {/* Base Layer - Pure Black */}
            <LinearGradient
                colors={['#000000', '#111111', '#000000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Animated Layer - Deep Charcoal Shifting */}
            <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
                <LinearGradient
                    colors={['#000000', '#2D2D2D', '#000000']} // Visible charcoal highlight
                    start={{ x: 0.2, y: 0.2 }} // Different angle to create "movement" feel when fading
                    end={{ x: 0.8, y: 0.8 }}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>

            {/* Content */}
            <View style={styles.content}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
        zIndex: 1,
    },
});
