import { Colors } from '@/constants/theme';
import { useSession } from '@/ctx';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CameraScreen() {
    const { habitId, habitName } = useLocalSearchParams();
    const router = useRouter();
    const { session } = useSession();
    
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [facing, setFacing] = useState<CameraType>('back');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!permission?.granted && permission?.canAskAgain) {
            requestPermission();
        }
    }, [permission]);

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Camera access is required to post proof.</Text>
                    <TouchableOpacity onPress={requestPermission} style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Grant Permission</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.back()} style={[styles.actionButton, { backgroundColor: '#333' }]}>
                        <Text style={[styles.actionButtonText, { color: '#fff' }]}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    const takePictureAndPost = async () => {
        if (!cameraRef.current || !session?.user || uploading) return;
        
        try {
            setUploading(true);
            
            // 1. Capture Image
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.7,
                skipProcessing: true
            });
            
            if (!photo) throw new Error("Failed to capture image");

            // 2. Upload to Supabase
            const arraybuffer = await fetch(photo.uri).then((res) => res.arrayBuffer());
            const fileExt = 'jpeg';
            const fileName = `${session.user.id}_${Date.now()}.${fileExt}`;
            const filePath = `${session.user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('posts')
                .upload(filePath, arraybuffer, { contentType: 'image/jpeg' });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('posts')
                .getPublicUrl(filePath);

            // 3. Insert Post Record
            const { error: dbError } = await supabase.from('posts').insert({
                user_id: session.user.id,
                challenge_id: habitId as string,
                image_url: publicUrl,
                caption: `Completed ${habitName}!` || 'Completed a habit!',
                likes_count: 0,
                earned_xp: 100
            });

            if (dbError) throw dbError;

            // 4. Update Local Streak directly in AsyncStorage
            try {
                const habitsStr = await AsyncStorage.getItem('user_habits');
                if (habitsStr) {
                    const habits: any[] = JSON.parse(habitsStr);
                    const updatedHabits = habits.map(h => {
                        if (h.id === habitId) {
                            const now = new Date();
                            let newStreak = (h.streak || 0) + 1;

                            // Prevent double bumping streak on the very same day
                            if (h.last_completed) {
                                const last = new Date(h.last_completed);
                                if (last.getDate() === now.getDate() && 
                                    last.getMonth() === now.getMonth() && 
                                    last.getFullYear() === now.getFullYear()) {
                                    newStreak = h.streak; // Retain current streak (already posted today)
                                }
                            }

                            return { ...h, streak: newStreak, last_completed: now.toISOString() };
                        }
                        return h;
                    });
                    await AsyncStorage.setItem('user_habits', JSON.stringify(updatedHabits));
                }
            } catch (streakErr) {
                console.error("Failed to update local streak", streakErr);
            }

            // 5. Done! Return to Action Screen
            router.back();
            
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to post proof. Please try again.");
            setUploading(false); // Only unset uploading if failed, otherwise we are unmounting
        }
    };

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                <SafeAreaView style={styles.cameraUi}>
                    
                    {/* Top Controls */}
                    <View style={styles.cameraHeader}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.cameraIconButton}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        >
                            <Ionicons name="close" size={28} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.habitHeaderBadge}>{habitName}</Text>
                        <TouchableOpacity
                            onPress={toggleCameraFacing}
                            style={styles.cameraIconButton}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        >
                            <Ionicons name="camera-reverse" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Controls */}
                    <View style={styles.cameraFooter}>
                        {uploading ? (
                            <View style={styles.uploadingOverlay}>
                                <ActivityIndicator size="large" color="#fff" />
                                <Text style={styles.uploadingText}>Posting Proof...</Text>
                            </View>
                        ) : (
                            <TouchableOpacity onPress={takePictureAndPost} style={styles.captureButton}>
                                <View style={styles.captureButtonInner} />
                            </TouchableOpacity>
                        )}
                    </View>

                </SafeAreaView>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    camera: { flex: 1 },
    cameraUi: { flex: 1, justifyContent: 'space-between' },
    cameraHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    cameraIconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    habitHeaderBadge: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        fontSize: 14,
        fontWeight: 'bold',
        overflow: 'hidden',
    },
    cameraFooter: {
        alignItems: 'center',
        paddingBottom: 40,
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButtonInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fff',
    },
    
    // States
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16 },
    errorText: { color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 20 },
    actionButton: { backgroundColor: '#fff', paddingVertical: 16, width: '100%', borderRadius: 12, alignItems: 'center' },
    actionButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },

    uploadingOverlay: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 20,
        alignItems: 'center',
    },
    uploadingText: { color: '#fff', fontSize: 16, fontWeight: '700', marginTop: 12 },
});
