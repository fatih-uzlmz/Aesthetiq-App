import { AnimatedGradient } from '@/components/AnimatedGradient';
import { useSession } from '@/ctx';
import { useRouter } from 'expo-router';
import { ArrowRight, Mail, Lock } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const { signIn, completeOnboarding } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMsg('Please fill in both fields.');
            return;
        }

        setErrorMsg('');
        setLoading(true);
        try {
            await signIn(email.trim().toLowerCase(), password);
            router.replace('/habit-setup');
        } catch (error: any) {
            console.error('Error during log in:', error);
            setErrorMsg(error.message || 'Invalid login credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatedGradient>
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <KeyboardAvoidingView 
                    style={styles.container} 
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
                        
                        {/* Main Content */}
                        <View style={styles.centerSection}>
                            <View style={styles.textBlock}>
                                <Text style={styles.headline}>
                                    Welcome back to
                                </Text>
                                <Text style={styles.brandTitleHeadline}>
                                    AESTHETIQ
                                </Text>
                                <Text style={styles.subheadline}>
                                    Log in to continue your journey.
                                </Text>
                            </View>

                            {/* Form Fields */}
                            <View style={styles.formContainer}>
                                {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

                                <View style={styles.inputWrapper}>
                                    <Mail size={16} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="EMAIL"
                                        placeholderTextColor="rgba(255,255,255,0.4)"
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        autoComplete="email"
                                    />
                                </View>

                                <View style={styles.inputWrapper}>
                                    <Lock size={16} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="PASSWORD"
                                        placeholderTextColor="rgba(255,255,255,0.4)"
                                        value={password}
                                        onChangeText={setPassword}
                                        autoCapitalize="none"
                                        secureTextEntry
                                        autoComplete="password"
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.bottomSection}>
                            <TouchableOpacity onPress={() => router.replace('/onboarding')} activeOpacity={0.7} style={styles.loginLinkContainer}>
                                <Text style={styles.loginLinkText}>Don't have an account? <Text style={styles.loginLinkBold}>Sign Up</Text></Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleLogin}
                                activeOpacity={0.9}
                                style={styles.buttonShadow}
                                disabled={loading}
                            >
                                <View style={styles.startButton}>
                                    <Text style={styles.startButtonText}>LOG IN</Text>
                                    <ArrowRight size={20} color="#000" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.loadingText}>Logging in...</Text>
                    </View>
                )}
            </SafeAreaView>
        </AnimatedGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { flexGrow: 1, padding: 32, paddingBottom: 20, justifyContent: 'space-between' },
    
    // Center Section Form
    centerSection: { flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingTop: 60 },
    textBlock: { marginBottom: 50, alignItems: 'flex-start' },
    headline: { fontSize: 36, fontWeight: '800', color: '#fff', lineHeight: 42, marginBottom: 4 },
    brandTitleHeadline: { color: '#fff', fontSize: 36, fontWeight: '900', letterSpacing: 4, textTransform: 'uppercase', lineHeight: 42, marginBottom: 16 },
    subheadline: { fontSize: 16, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },

    formContainer: { width: '100%', gap: 16 },
    errorText: { color: '#FF6B6B', fontSize: 14, fontWeight: '500', marginBottom: 8 },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        height: 56,
        paddingHorizontal: 0,
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 1.5 },

    // Bottom Section
    bottomSection: { flexShrink: 0, paddingBottom: 40, marginTop: 40, gap: 16 },
    
    loginLinkContainer: { alignItems: 'center', marginBottom: 8 },
    loginLinkText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '500' },
    loginLinkBold: { color: '#fff', fontWeight: '700' },
    
    buttonShadow: {
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 25,
    },
    startButton: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        borderRadius: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    startButtonText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1.5, textTransform: 'uppercase' },

    // Global Elements
    loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
    loadingText: { color: '#fff', fontSize: 16, marginTop: 16, fontWeight: '600' }
});
