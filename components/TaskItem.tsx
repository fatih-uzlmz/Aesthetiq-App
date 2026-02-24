import { Colors, Gradients } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Circle } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TaskItemProps {
    title: string;
    description: string;
    isCompleted?: boolean;
}

export function TaskItem({ title, description, isCompleted = false }: TaskItemProps) {
    // We removed the internal state and onPress handler to allow the parent Link to handle navigation.
    // The completion state should ideally be controlled from outside or removed if not needed for the list view.

    return (
        <View style={styles.touchable}>
            <LinearGradient
                colors={Gradients.card}
                style={[styles.container, isCompleted && styles.completedContainer]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.content}>
                    <Text style={[styles.title, isCompleted && styles.completedText]}>{title}</Text>
                    <Text style={[styles.description, isCompleted && styles.completedText]}>{description}</Text>
                </View>
                <View style={styles.iconContainer}>
                    {isCompleted ? (
                        <CheckCircle size={24} color={Colors.dark.success} />
                    ) : (
                        <Circle size={24} color={Colors.dark.icon} />
                    )}
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    touchable: {
        marginBottom: 12,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    completedContainer: {
        opacity: 0.6,
    },
    content: {
        flex: 1,
        marginRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: Colors.dark.text,
    },
    description: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: Colors.dark.textSecondary,
    },
    iconContainer: {
        padding: 4,
    },
});
