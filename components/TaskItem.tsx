import { CheckCircle, Circle } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TaskItemProps {
    title: string;
    description: string;
    isCompleted?: boolean;
}

export function TaskItem({ title, description, isCompleted = false }: TaskItemProps) {
    const [completed, setCompleted] = useState(isCompleted);

    return (
        <TouchableOpacity
            style={[styles.container, completed && styles.completedContainer]}
            onPress={() => setCompleted(!completed)}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                <Text style={[styles.title, completed && styles.completedText]}>{title}</Text>
                <Text style={[styles.description, completed && styles.completedText]}>{description}</Text>
            </View>
            <View style={styles.iconContainer}>
                {completed ? (
                    <CheckCircle size={24} color="#4CAF50" />
                ) : (
                    <Circle size={24} color="#ccc" />
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    completedContainer: {
        backgroundColor: '#f9f9f9',
        opacity: 0.8,
    },
    content: {
        flex: 1,
        marginRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    iconContainer: {
        padding: 4,
    },
});
