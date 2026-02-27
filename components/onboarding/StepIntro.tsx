import { ArrowRight } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface StepIntroProps {
    onNext: () => void;
}

export const StepIntro: React.FC<StepIntroProps> = ({ onNext }) => {
    const opacity1 = useSharedValue(0);
    const opacity2 = useSharedValue(0);
    const buttonOpacity = useSharedValue(0);

    useEffect(() => {
        // Sequence: Text 1 -> Wait -> Text 2 -> Button
        opacity1.value = withTiming(1, { duration: 1000 });

        opacity2.value = withDelay(1500, withTiming(1, { duration: 1000 }));

        buttonOpacity.value = withDelay(3000, withTiming(1, { duration: 800 }));
    }, []);

    const style1 = useAnimatedStyle(() => ({ opacity: opacity1.value }));
    const style2 = useAnimatedStyle(() => ({ opacity: opacity2.value }));
    const buttonStyle = useAnimatedStyle(() => ({ opacity: buttonOpacity.value }));

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Animated.Text style={[styles.text, style1]}>
                    We know why you are here...
                </Animated.Text>

                <Animated.Text style={[styles.subtext, style2]}>
                    You&apos;re tired of starting over.
                </Animated.Text>
            </View>

            <Animated.View style={[styles.footer, buttonStyle]}>
                <TouchableOpacity style={styles.button} onPress={onNext} activeOpacity={0.8}>
                    <Text style={styles.buttonText}>Let&apos;s Fix It</Text>
                    <ArrowRight size={20} color="#000" />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        gap: 20,
    },
    text: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'left',
        lineHeight: 40,
    },
    subtext: {
        fontSize: 24,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'left',
    },
    footer: {
        paddingBottom: 50,
    },
    button: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 40,
        gap: 12,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});
