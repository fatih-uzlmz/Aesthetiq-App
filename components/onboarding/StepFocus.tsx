import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface StepFocusProps {
    onNext: (data: { focus: string }) => void;
}

const FOCUS_OPTIONS = [
    "Career Aspiration",
    "Physical Health",
    "Mental Clarity",
    "Breaking Bad Habits",
    "Academic Success"
];

export const StepFocus: React.FC<StepFocusProps> = ({ onNext }) => {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (option: string) => {
        setSelected(option);
        // Auto advance after slight delay
        setTimeout(() => {
            onNext({ focus: option });
        }, 300);
    };

    return (
        <View style={styles.container}>
            <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                <Text style={styles.stepIndicator}>01 / 05</Text>
                <Text style={styles.title}>What is your main focus right now?</Text>
            </Animated.View>

            <View style={styles.list}>
                {FOCUS_OPTIONS.map((option, index) => (
                    <Animated.View
                        key={option}
                        entering={FadeInDown.delay(300 + (index * 100)).duration(500)}
                    >
                        <TouchableOpacity
                            style={[
                                styles.option,
                                selected === option && styles.optionSelected
                            ]}
                            onPress={() => handleSelect(option)}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.optionText,
                                selected === option && styles.optionTextSelected
                            ]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    stepIndicator: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 40,
        lineHeight: 38,
    },
    list: {
        gap: 16,
    },
    option: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 16,
    },
    optionSelected: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    optionText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#fff',
    },
    optionTextSelected: {
        color: '#000',
        fontWeight: '600',
    }
});
