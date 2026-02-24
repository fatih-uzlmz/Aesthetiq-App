import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface StepPlanProps {
    onNext: () => void;
}

const BENEFITS = [
    { text: "Become more focused and disciplined", bold: ["focused", "disciplined"] },
    { text: "Your productivity will improve drastically", bold: ["improve", "drastically"] },
    { text: "You will feel more energized than ever", bold: ["energized"] },
    { text: "Boost your self-worth", bold: ["self-worth"] },
];

export function StepPlan({ onNext }: StepPlanProps) {
    const [targetDate, setTargetDate] = useState("");

    useEffect(() => {
        // Calculate date 90 days from now
        const date = new Date();
        date.setDate(date.getDate() + 90);
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        setTargetDate(date.toLocaleDateString('en-US', options));
    }, []);

    const renderTextWithBold = (item: { text: string, bold: string[] }) => {
        const parts = item.text.split(' ');
        return (
            <Text style={styles.benefitText}>
                {parts.map((word, index) => {
                    const cleanWord = word.replace(/[^a-zA-Z-]/g, ""); // basic cleanup check
                    const isBold = item.bold.some(b => word.toLowerCase().includes(b.toLowerCase()));
                    return (
                        <Text key={index} style={isBold ? styles.boldText : {}}>
                            {word}{" "}
                        </Text>
                    );
                })}
            </Text>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <Text style={styles.headerTitle}>
                        Become the best version of yourself in{'\n'}less than 90 days.
                    </Text>
                    <Text style={styles.subHeader}>
                        Become the best version of yourself by:
                    </Text>

                    <View style={styles.dateBadge}>
                        <Text style={styles.dateText}>{targetDate}</Text>
                    </View>
                </Animated.View>

                <View style={styles.benefitsContainer}>
                    {BENEFITS.map((benefit, index) => (
                        <Animated.View
                            key={index}
                            entering={FadeInDown.delay(300 + (index * 100)).springify()}
                            style={styles.benefitRow}
                        >
                            <View style={styles.checkIcon}>
                                <CheckCircle size={20} color="#10B981" fill="#10B981" />
                            </View>
                            {renderTextWithBold(benefit)}
                        </Animated.View>
                    ))}
                </View>

                <Animated.View
                    entering={FadeInDown.delay(700).springify()}
                    style={styles.testimonialContainer}
                >
                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} color="#FBBF24" fill="#FBBF24" />)}
                        <Text style={styles.ratingText}>4.9</Text>
                    </View>
                    <Text style={styles.testimonialTitle}>Hear what our community is saying</Text>
                    <View style={styles.quoteBox}>
                        <Text style={styles.quoteAuthor}>Anonymous</Text>
                        <View style={styles.starsRowSmall}>
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} color="#FBBF24" fill="#FBBF24" />)}
                        </View>
                        <Text style={styles.quoteText}>
                            "Amazing app! It gives you a personalized goal plan, and keeps count of your streaks. Would definitely recommend it to anyone looking to level up their life journey!"
                        </Text>
                    </View>
                </Animated.View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={onNext}
                    activeOpacity={0.9}
                    style={styles.buttonShadow}
                >
                    <LinearGradient
                        colors={['#fff', '#E0E0E0']} // White button for high contrast
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.nextButton}
                    >
                        <Text style={[styles.nextButtonText, { color: '#000' }]}>Start Your Journey</Text>
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
        paddingTop: 20,
    },
    headerTitle: {
        fontSize: 28, // Scaled for impact
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 34,
    },
    subHeader: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        marginBottom: 16,
    },
    dateBadge: {
        backgroundColor: 'rgba(37, 99, 235, 0.15)', // Blue tint
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(37, 99, 235, 0.3)',
        marginBottom: 32,
    },
    dateText: {
        color: '#60A5FA',
        fontSize: 16,
        fontWeight: 'bold',
    },
    benefitsContainer: {
        gap: 20,
        marginBottom: 40,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    checkIcon: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center'
    },
    benefitText: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
        lineHeight: 22,
    },
    boldText: {
        fontWeight: 'bold',
    },
    testimonialContainer: {
        alignItems: 'center',
    },
    starsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    ratingText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    testimonialTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    quoteBox: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    quoteAuthor: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    starsRowSmall: {
        flexDirection: 'row',
        gap: 2,
        marginVertical: 4,
    },
    quoteText: {
        color: 'rgba(255,255,255,0.8)',
        fontStyle: 'italic',
        fontSize: 13,
        lineHeight: 18,
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
    },
    buttonShadow: {
        shadowColor: "#2563EB",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    nextButton: {
        paddingVertical: 18,
        borderRadius: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
