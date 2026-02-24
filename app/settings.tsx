import { ScreenGradient } from '@/components/ScreenGradient';
import { Colors } from '@/constants/theme';
import { useSession } from '@/ctx';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, FileText, LogOut, Shield, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const router = useRouter();
    const { session, signOut, isAnonymous } = useSession();
    const [loading, setLoading] = useState(false);

    // Link Account State
    const [linking, setLinking] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogout = () => {
        Alert.alert('Log Out', 'Are you sure you want to log out?' + (isAnonymous ? '\nWARNING: You are on a Guest Account. If you log out without linking an email, you will lose your data forever.' : ''), [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log Out',
                style: 'destructive',
                onPress: async () => {
                    await signOut();
                    router.replace('/onboarding');
                }
            }
        ]);
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure? This action is permanent and cannot be undone. All your data will be lost.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            if (session?.user?.id) {
                                const { error } = await supabase
                                    .from('profiles')
                                    .delete()
                                    .eq('id', session.user.id);
                                if (error) throw error;
                            }
                            await AsyncStorage.clear();
                            await signOut();
                            Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
                            router.replace('/onboarding');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete account.');
                            console.error(error);
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleLinkAccount = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ email, password });
            if (error) throw error;
            Alert.alert('Success', 'Account linked successfully! You can now log in with these credentials.');
            setLinking(false);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to link account.');
        } finally {
            setLoading(false);
        }
    };

    const openLink = (url: string) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <ScreenGradient>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={28} color={Colors.dark.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView style={styles.content}>

                    {/* Account Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>ACCOUNT STATUS</Text>
                        <View style={styles.card}>
                            {isAnonymous ? (
                                <View style={{ padding: 16 }}>
                                    {linking ? (
                                        <View style={{ gap: 12 }}>
                                            <Text style={styles.warningText}>Save your progress by creating an account.</Text>
                                            <TextInput
                                                placeholder="Email"
                                                placeholderTextColor="#666"
                                                style={styles.input}
                                                value={email}
                                                onChangeText={setEmail}
                                                autoCapitalize="none"
                                            />
                                            <TextInput
                                                placeholder="Password"
                                                placeholderTextColor="#666"
                                                style={styles.input}
                                                value={password}
                                                onChangeText={setPassword}
                                                secureTextEntry
                                            />
                                            <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
                                                <TouchableOpacity onPress={handleLinkAccount} style={[styles.actionButton, { backgroundColor: '#fff' }]}>
                                                    {loading ? <ActivityIndicator color="#000" /> : <Text style={[styles.actionButtonText, { color: '#000' }]}>Save Account</Text>}
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => setLinking(false)} style={[styles.actionButton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#333' }]}>
                                                    <Text style={[styles.actionButtonText, { color: '#fff' }]}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ) : (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <View>
                                                <Text style={[styles.label, { color: '#fbbf24', fontWeight: 'bold' }]}>Guest Account</Text>
                                                <Text style={[styles.value, { fontSize: 12 }]}>Data is only saved on this device.</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => setLinking(true)} style={styles.smallButton}>
                                                <Text style={styles.smallButtonText}>Claim Account</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            ) : (
                                <View style={styles.row}>
                                    <Text style={styles.label}>Email</Text>
                                    <Text style={styles.value}>{session?.user?.email}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Legal Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>LEGAL</Text>
                        <View style={styles.card}>
                            <TouchableOpacity style={styles.menuItem} onPress={() => openLink('https://example.com/privacy')}>
                                <View style={styles.menuItemLeft}>
                                    <Shield size={20} color={Colors.dark.textSecondary} />
                                    <Text style={styles.menuItemText}>Privacy Policy</Text>
                                </View>
                                <ChevronRight size={20} color={Colors.dark.textSecondary} />
                            </TouchableOpacity>
                            <View style={styles.separator} />
                            <TouchableOpacity style={styles.menuItem} onPress={() => openLink('https://example.com/terms')}>
                                <View style={styles.menuItemLeft}>
                                    <FileText size={20} color={Colors.dark.textSecondary} />
                                    <Text style={styles.menuItemText}>Terms of Service</Text>
                                </View>
                                <ChevronRight size={20} color={Colors.dark.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Actions Section */}
                    <View style={styles.section}>
                        <View style={styles.card}>
                            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                                <View style={styles.menuItemLeft}>
                                    <LogOut size={20} color={Colors.dark.textSecondary} />
                                    <Text style={styles.menuItemText}>Log Out</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.separator} />
                            <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount} disabled={loading}>
                                <View style={styles.menuItemLeft}>
                                    <Trash2 size={20} color="#EF4444" />
                                    <Text style={[styles.menuItemText, { color: '#EF4444' }]}>
                                        {loading ? 'Deleting...' : 'Delete Account'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.version}>Version 1.0.0</Text>

                </ScrollView>
            </SafeAreaView>
        </ScreenGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        padding: 4,
        marginLeft: -4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.dark.textSecondary,
        marginBottom: 8,
        marginLeft: 4,
        letterSpacing: 1,
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    label: {
        color: Colors.dark.text,
        fontSize: 16,
    },
    value: {
        color: Colors.dark.textSecondary,
        fontSize: 16,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuItemText: {
        color: Colors.dark.text,
        fontSize: 16,
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginLeft: 48,
    },
    version: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.2)',
        fontSize: 12,
        marginTop: 20,
        marginBottom: 40,
    },
    // New Styles for Linking Layout
    smallButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    smallButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12,
    },
    warningText: {
        color: '#fbbf24',
        fontSize: 14,
        fontWeight: '500',
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        fontSize: 16,
    },
    actionButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
});
