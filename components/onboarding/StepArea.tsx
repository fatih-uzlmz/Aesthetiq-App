import { Brain, Briefcase, Heart, MoreHorizontal } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 48 - 16) / 2; // (Screen - Padding - Gap) / 2

interface StepAreaProps {
    onNext: (data: { areas: string[] }) => void;
}

const AREAS = [
    { id: 'health', icon: Heart, label: 'Health/Fitness', color: '#EF4444' },
    { id: 'career', icon: Briefcase, label: 'Money/Business', color: '#10B981' },
    { id: 'mental', icon: Brain, label: 'Spirit/Mentality', color: '#F59E0B' },
    { id: 'other', icon: MoreHorizontal, label: 'Other', color: '#3B82F6' },
];

export const StepArea: React.FC<StepAreaProps> = ({ onNext }) => {
    const [selected, setSelected] = useState<string[]>([]);

    const toggleSelection = (id: string) => {
        setSelected(prev => {
            if (prev.includes(id)) return prev.filter(item => item !== id);
            return [...prev, id];
        });
    };

    const handleContinue = () => {
        if (selected.length > 0) {
            onNext({ areas: selected });
        }
    };

    return (
        <View style={styles.container}>
            <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                <Text style={styles.stepIndicator}>02 / 05</Text>
                <Text style={styles.title}>Which area needs the most attention?</Text>
                <Text style={styles.subtitle}>Can select more than one</Text>
            </Animated.View>

            <View style={styles.grid}>
                {AREAS.map((area, index) => {
                    const isSelected = selected.includes(area.id);
                    const Icon = area.icon;

                    return (
                        <Animated.View
                            key={area.id}
                            entering={FadeInDown.delay(300 + (index * 100)).duration(500)}
                        >
                            <TouchableOpacity
                                style={[
                                    styles.card,
                                    isSelected && { borderColor: area.color, borderWidth: 2, backgroundColor: `${area.color}15` } // 15 = low opacity hex
                                ]}
                                onPress={() => toggleSelection(area.id)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.iconCircle, { backgroundColor: `${area.color}20` }]}>
                                    <Icon size={32} color={area.color} fill={isSelected ? area.color : 'transparent'} />
                                </View>
                                <Text style={styles.cardLabel}>{area.label}</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    );
                })}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={selected.length === 0}
                >
                    <Text style={[styles.buttonText, selected.length === 0 && styles.buttonTextDisabled]}>Next</Text>
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
        marginBottom: 10,
        lineHeight: 38,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 40,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    card: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        marginTop: 'auto',
        paddingBottom: 40,
    },
    button: {
        backgroundColor: '#fff',
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
    buttonTextDisabled: {
        color: 'rgba(255,255,255,0.3)',
    }
});
