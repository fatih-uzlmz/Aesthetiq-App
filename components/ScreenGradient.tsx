import { Gradients } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

interface ScreenGradientProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export function ScreenGradient({ children, style }: ScreenGradientProps) {
    return (
        <LinearGradient
            colors={[Gradients.background[0], Gradients.background[1]]}
            style={[styles.container, style]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
