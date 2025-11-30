import { useSession } from '@/ctx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function OnboardingScreen() {
    const router = useRouter();
    const { completeOnboarding } = useSession();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contact, setContact] = useState('');

    const handleComplete = async () => {
        if (!firstName || !lastName || !contact) {
            Alert.alert('Missing Information', 'Please fill in all fields to continue.');
            return;
        }

        try {
            await AsyncStorage.setItem('userProfile', JSON.stringify({ firstName, lastName, contact }));
            completeOnboarding();
            // Router replacement is handled by the layout effect
        } catch (error) {
            console.error('Failed to save onboarding status', error);
        }
    };

    const handleDeveloperTest = async () => {
        setFirstName('Developer');
        setLastName('Test');
        setContact('dev@test.com');

        // Small delay to show the filled values before navigating
        setTimeout(async () => {
            try {
                await AsyncStorage.setItem('userProfile', JSON.stringify({
                    firstName: 'Developer',
                    lastName: 'Test',
                    contact: 'dev@test.com'
                }));
                completeOnboarding();
            } catch (error) {
                console.error('Failed to save onboarding status', error);
            }
        }, 500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome to Aesthetiq</Text>
                    <Text style={styles.subtitle}>Let's get to know you better.</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your first name"
                            value={firstName}
                            onChangeText={setFirstName}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your last name"
                            value={lastName}
                            onChangeText={setLastName}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone / Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter phone number or email"
                            value={contact}
                            onChangeText={setContact}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={handleComplete}>
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.devButton} onPress={handleDeveloperTest}>
                        <Text style={styles.devButtonText}>Developer Testing</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    form: {
        marginBottom: 40,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#eee',
    },
    footer: {
        gap: 16,
    },
    button: {
        backgroundColor: '#000',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    devButton: {
        padding: 16,
        alignItems: 'center',
    },
    devButtonText: {
        color: '#666',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
