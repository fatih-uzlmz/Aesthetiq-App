import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, LayoutAnimation, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface StepSymptomsProps {
    onNext: (data: { symptoms: string[] }) => void;
}

const SECTIONS = [
    {
        title: "Mental",
        items: [
            "Feeling unmotivated",
            "Lack of ambition to pursue goals",
            "Difficulty concentrating",
            "Poor memory or brain fog",
            "General anxiety"
        ]
    },
    {
        title: "Physical",
        items: [
            "Chronic tiredness or fatigue",
            "Sleep problems",
            "Headaches or muscle tension",
            "Neglecting physical health",
            "Restlessness or inability to sleep"
        ]
    },
    {
        title: "Social & Relationships",
        items: [
            "Avoiding friends or family",
            "Strained relationships",
            "More frequent conflicts",
            "Feeling isolated or lonely",
            "Low confidence in social situations"
        ]
    },
    {
        title: "Performance & Achievement",
        items: [
            "Missing important deadlines",
            "Producing rushed or subpar work",
            "Lack of progress in career or goals",
            "Fear of committing to new goals"
        ]
    }
];

export function StepSymptoms({ onNext }: StepSymptomsProps) {
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

    const toggleSymptom = (symptom: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedSymptoms(prev => {
            if (prev.includes(symptom)) {
                return prev.filter(s => s !== symptom);
            } else {
                return [...prev, symptom];
            }
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Symptoms</Text>

            <View style={styles.warningContainer}>
                <Text style={styles.warningText}>
                    Procrastination can have serious{'\n'}negative impacts psychologically.
                </Text>
            </View>

            <Text style={styles.subtext}>Select all symptoms you&apos;ve been acquiring:</Text>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {SECTIONS.map((section, sectionIndex) => (
                    <Animated.View
                        key={section.title}
                        entering={FadeInDown.delay(sectionIndex * 100).springify()}
                        style={styles.sectionContainer}
                    >
                        <Text style={styles.sectionHeader}>{section.title}</Text>
                        <View style={styles.itemsContainer}>
                            {section.items.map((item) => {
                                const isSelected = selectedSymptoms.includes(item);
                                return (
                                    <TouchableOpacity
                                        key={item}
                                        style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                                        onPress={() => toggleSymptom(item)}
                                        activeOpacity={0.8}
                                    >
                                        <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                                            {isSelected && <View style={styles.radioInner} />}
                                        </View>
                                        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </Animated.View>
                ))}

                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={() => onNext({ symptoms: selectedSymptoms })}
                    activeOpacity={0.9}
                    disabled={selectedSymptoms.length === 0}
                    style={[styles.buttonShadow, selectedSymptoms.length === 0 && { opacity: 0.5 }]}
                >
                    <LinearGradient
                        colors={['#FF0000', '#CC0000']} // Red gradient per screenshot
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.nextButton}
                    >
                        <Text style={styles.nextButtonText}>Build my protocol</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    warningContainer: {
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        borderWidth: 1,
        borderColor: '#FF0000',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    warningText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 22,
    },
    subtext: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    sectionContainer: {
        marginBottom: 30,
    },
    sectionHeader: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    itemsContainer: {
        gap: 12,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        gap: 16,
    },
    optionButtonSelected: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: '#fff',
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    radioCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioCircleSelected: {
        borderColor: '#fff',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    optionText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 16,
        flex: 1,
    },
    optionTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        paddingBottom: 40,
        backgroundColor: '#000', // Solid background for button area
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    buttonShadow: {
        shadowColor: "#FF0000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
    },
    nextButton: {
        paddingVertical: 18,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
