import { ScreenGradient } from '@/components/ScreenGradient';
import { CHALLENGES } from '@/constants/data';
import { Colors, Gradients } from '@/constants/theme';
import { useSession } from '@/ctx';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONTAINER_HEIGHT = SCREEN_HEIGHT * 0.45;

export default function ChallengeDetailScreen() {
    const { id, completed } = useLocalSearchParams();
    const router = useRouter();
    const { session } = useSession();
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    const [cameraVisible, setCameraVisible] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [uploading, setUploading] = useState(false);
    const [facing, setFacing] = useState<CameraType>('back');
    const [imageHeight, setImageHeight] = useState(CONTAINER_HEIGHT);
    const [weeklyProgress, setWeeklyProgress] = useState(0);
    const [loadingProgress, setLoadingProgress] = useState(false);

    const challenge = CHALLENGES.find(c => c.id === id);
    const isWeekly = !!challenge?.linkedDailyChallengeId;
    const required = challenge?.requiredCompletions || 5;

    useEffect(() => {
        if (isWeekly && session?.user && challenge?.linkedDailyChallengeId) {
            checkWeeklyProgress();
        }
    }, [isWeekly, session, challenge]);

    const checkWeeklyProgress = async () => {
        if (!challenge?.linkedDailyChallengeId || !session?.user) return;
        setLoadingProgress(true);
        try {
            const now = new Date();
            const day = now.getDay() || 7; // 1 (Mon) - 7 (Sun)
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - day + 1);
            startOfWeek.setHours(0, 0, 0, 0);

            const { count, error } = await supabase
                .from('posts')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', session.user.id)
                .eq('challenge_id', challenge.linkedDailyChallengeId)
                .gte('created_at', startOfWeek.toISOString());

            if (error) throw error;
            setWeeklyProgress(count || 0);
        } catch (e) {
            console.error('Error fetching weekly progress:', e);
        } finally {
            setLoadingProgress(false);
        }
    };

    // Auto-open camera if returned from completed Focus Session
    useEffect(() => {
        if (completed === 'true' && permission && !cameraVisible) {
            // Wait a brief moment for transition
            const timer = setTimeout(() => {
                setCaption("Just crushed a Focus Session! 🎯");
                handleOpenCamera();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [completed, permission]);

    const handleImageLoad = (event: any) => {
        const { width, height } = event.nativeEvent.source;
        if (width && height) {
            const aspectRatio = width / height;
            const calculatedHeight = SCREEN_WIDTH / aspectRatio;
            setImageHeight(calculatedHeight);
        }
    };

    if (!challenge) {
        return (
            <ScreenGradient>
                <SafeAreaView style={styles.container}>
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Challenge not found</Text>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Text style={styles.backButtonText}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ScreenGradient>
        );
    }

    const handleOpenCamera = async () => {
        if (!permission) {
            // Permission not loaded yet
            return;
        }
        if (!permission.granted) {
            const result = await requestPermission();
            if (!result.granted) {
                Alert.alert("Permission Required", "Camera access is needed to post.");
                return;
            }
        }
        setCameraVisible(true);
    };

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.7,
                    skipProcessing: true // Faster
                });
                if (photo) {
                    setCapturedImage(photo.uri);
                }
            } catch (error) {
                console.log("Error taking picture:", error);
                Alert.alert("Error", "Failed to take picture");
            }
        }
    };

    const resetPostFlow = () => {
        setCameraVisible(false);
        setCapturedImage(null);
        setCaption('');
        setUploading(false);
    };

    const handlePost = async () => {
        if (!capturedImage) return;

        if (!session?.user) {
            Alert.alert("Error", "You must be logged in to post.");
            return;
        }
        setUploading(true);

        try {
            // 1. Upload Image
            const arraybuffer = await fetch(capturedImage).then((res) => res.arrayBuffer());
            const fileExt = capturedImage.split('.').pop()?.toLowerCase() ?? 'jpeg';
            const fileName = `${session.user.id}_${Date.now()}.${fileExt}`;
            const filePath = `${session.user.id}/${fileName}`; // Organized by user

            const { error: uploadError } = await supabase.storage
                .from('posts') // Ensure this bucket exists!
                .upload(filePath, arraybuffer, {
                    contentType: 'image/jpeg',
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('posts')
                .getPublicUrl(filePath);

            // 2. Insert Post Record
            const { error: dbError } = await supabase
                .from('posts') // Ensure this table exists
                .insert({
                    user_id: session.user.id,
                    challenge_id: challenge.id,
                    image_url: publicUrl,
                    caption: caption,
                    likes_count: 0,
                    earned_xp: challenge.xp || 100
                });


            // iOS Fix: Close preview modal AND camera modal first to prevent conflict/reappearance
            setCameraVisible(false);
            setCapturedImage(null);
            setTimeout(() => {
                setSuccessModalVisible(true);
            }, 500);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                Alert.alert("Error", error.message);
            }
        } finally {
            setUploading(false);
        }
    };

    // Calculate vertical shift to show more of the bottom (feet)
    // Shift up by 25% of the overflow
    const overflowHeight = Math.max(0, imageHeight - CONTAINER_HEIGHT);
    const topOffset = -overflowHeight * 0.25;

    return (
        <View style={styles.container}>
            {/* Background Image - Top Aligned, Full Width */}
            <View style={styles.imageContainer}>
                <Image
                    source={typeof challenge.image === 'string' ? { uri: challenge.image } : challenge.image}
                    style={[
                        styles.image,
                        {
                            height: Math.max(imageHeight, CONTAINER_HEIGHT),
                            top: topOffset
                        }
                    ]}
                    onLoad={handleImageLoad}
                    onError={(e) => console.error("Image load error:", e.nativeEvent.error)}
                />
                <LinearGradient
                    colors={['transparent', '#000']}
                    style={styles.imageGradient}
                />
            </View>

            {/* Header (Absolute & Transparent) */}
            <SafeAreaView style={styles.headerContainer} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.infoContainer}>
                    <LinearGradient
                        colors={['transparent', '#000']}
                        style={{ position: 'absolute', top: -100, left: 0, right: 0, height: 101 }}
                    />
                    <View style={styles.badgesRow}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{challenge.category}</Text>
                        </View>
                        <View style={styles.xpBadge}>
                            <Text style={styles.xpText}>{challenge.xp || 100} XP</Text>
                        </View>
                    </View>
                    <Text style={styles.title}>{challenge.title}</Text>
                    <Text style={styles.subtitle}>{challenge.subtitle}</Text>

                    {/* Weekly Progress Indicator */}
                    {isWeekly && (
                        <View style={styles.progressContainer}>
                            <View style={styles.progressHeader}>
                                <Text style={styles.progressTitle}>Weekly Progress</Text>
                                <Text style={styles.progressCounter}>{Math.min(weeklyProgress, 7)} / 7 Days</Text>
                            </View>
                            <View style={styles.progressBarRow}>
                                {[...Array(7)].map((_, i) => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.progressSegment,
                                            i < weeklyProgress ? styles.progressSegmentActive : styles.progressSegmentInactive
                                        ]}
                                    />
                                ))}
                            </View>
                            <Text style={styles.progressNote}>
                                {weeklyProgress >= required
                                    ? "Goal met! You can now finish this challenge."
                                    : `Complete ${required - weeklyProgress} more daily sessions this week.`}
                            </Text>
                        </View>
                    )}

                    <Text style={styles.description}>{challenge.description}</Text>

                    {/* Friend Activity Section */}
                    <View style={styles.friendActivityContainer}>
                        {challenge.friendsParticipants && challenge.friendsParticipants.length > 0 ? (
                            <View style={styles.friendsActiveRow}>
                                <View style={styles.friendAvatars}>
                                    {challenge.friendsParticipants.slice(0, 3).map((friend: any, index: number) => (
                                        <Image
                                            key={index}
                                            source={friend.image}
                                            style={[styles.friendAvatar, { transform: [{ translateX: index * -10 }] }]}
                                        />
                                    ))}
                                </View>
                                <Text style={styles.friendText}>
                                    <Text style={{ fontWeight: 'bold', color: '#fff' }}>{challenge.friendsParticipants[0].name}</Text>
                                    {challenge.friendsParticipants.length > 1
                                        ? ` and ${challenge.friendsParticipants.length - 1} other friends have`
                                        : ' has'} completed this challenge.
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.noFriendsText}>
                                No friends have completed this challenge yet, be the first one.
                            </Text>
                        )}
                    </View>

                    <View style={styles.instructionsContainer}>
                        <Text style={styles.sectionTitle}>Instructions</Text>
                        {challenge.instructions.map((instruction, index) => (
                            <View key={index} style={styles.instructionItem}>
                                <View style={styles.citationBar} />
                                <Text style={styles.instructionText}>{instruction}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Spacer for bottom button */}
                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                {challenge.type === 'timer' ? (
                    <TouchableOpacity
                        onPress={() => router.push({
                            pathname: '/focus-timer',
                            params: {
                                id: challenge.id,
                                title: challenge.title,
                                duration: challenge.duration,
                                xp: challenge.xp
                            }
                        })}
                        style={styles.postButton}
                    >
                        <LinearGradient
                            colors={Gradients.primary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.postButtonGradient}
                        >
                            <Text style={styles.postButtonText}>Start Focus Session</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[
                            styles.postButton,
                            (isWeekly && weeklyProgress < required) && styles.postButtonDisabled
                        ]}
                        onPress={handleOpenCamera}
                        activeOpacity={0.8}
                        disabled={isWeekly && weeklyProgress < required}
                    >
                        <LinearGradient
                            colors={Gradients.primary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.postButtonGradient}
                        >
                            <Ionicons name="camera" size={24} color="#000" />
                            <Text style={styles.postButtonText}>
                                {isWeekly
                                    ? (weeklyProgress >= required ? "Finish Challenge" : `${weeklyProgress}/${required} Completed`)
                                    : "Post Activity"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>

            {/* Camera Modal */}
            <Modal visible={cameraVisible && !capturedImage} animationType="slide">
                <View style={styles.cameraContainer}>
                    <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                        <SafeAreaView style={styles.cameraUi}>
                            <View style={styles.cameraHeader}>
                                <TouchableOpacity
                                    onPress={resetPostFlow}
                                    style={styles.cameraIconButton}
                                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                                >
                                    <Ionicons name="close" size={28} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={toggleCameraFacing}
                                    style={styles.cameraIconButton}
                                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                                >
                                    <Ionicons name="camera-reverse" size={28} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.cameraFooter}>
                                <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
                                    <View style={styles.captureButtonInner} />
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </CameraView>
                </View>
            </Modal>

            {/* Post Preview Modal */}
            <Modal visible={!!capturedImage} animationType="slide">
                <SafeAreaView style={styles.previewContainer}>
                    <View style={styles.previewHeader}>
                        <TouchableOpacity
                            onPress={() => setCapturedImage(null)}
                            style={styles.cameraIconButton}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        >
                            <Ionicons name="arrow-back" size={28} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.previewTitle}>New Post</Text>
                        <View style={{ width: 44 }} />
                    </View>

                    <ScrollView style={styles.previewContent}>
                        {capturedImage && (
                            <Image source={{ uri: capturedImage }} style={styles.previewImage} />
                        )}

                        <View style={styles.captionContainer}>
                            <View style={styles.postMetaContainer}>
                                <View style={styles.metaRow}>
                                    <View style={styles.metaUserInfo}>
                                        <Image
                                            source={{ uri: session?.user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }}
                                            style={styles.metaAvatar}
                                        />
                                        <View>
                                            <Text style={styles.metaUsername}>@{session?.user?.user_metadata?.username || session?.user?.email?.split('@')[0] || 'me'}</Text>
                                            <Text style={styles.metaTime}>Just now • San Francisco, CA</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.challengeContextCard}>
                                    <Text style={styles.contextTitle}>{challenge.title}</Text>
                                    <Text style={styles.contextDescription}>{challenge.description}</Text>

                                    <View style={styles.divider} />

                                    <Text style={styles.contextLabel}>INSTRUCTIONS</Text>
                                    {challenge.instructions.map((inst, idx) => (
                                        <View key={idx} style={styles.contextInstRow}>
                                            <View style={styles.contextInstDot} />
                                            <Text style={styles.contextInstText}>{inst}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <TextInput
                                style={styles.captionInput}
                                placeholder="Write a caption... @mention friends"
                                placeholderTextColor="#666"
                                value={caption}
                                onChangeText={setCaption}
                                multiline
                                maxLength={200}
                            />
                        </View>
                    </ScrollView>

                    <View style={styles.previewFooter}>
                        <TouchableOpacity
                            onPress={handlePost}
                            disabled={uploading}
                            style={[styles.deployButton, uploading && { opacity: 0.7 }]}
                        >
                            <Text style={styles.deployButtonText}>
                                {uploading ? 'Posting...' : 'Share Post'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>

            {/* Success Modal */}
            <Modal visible={successModalVisible} transparent={true} animationType="fade">
                <View style={styles.successModalOverlay}>
                    <View style={styles.successModalContent}>
                        <View style={styles.successIconContainer}>
                            <Ionicons name="checkmark-circle" size={80} color={Colors.dark.primary} />
                        </View>
                        <Text style={styles.successTitle}>Post Created!</Text>
                        <Text style={styles.successMessage}>Your activity has been shared successfully.</Text>

                        <TouchableOpacity
                            style={styles.successButton}
                            onPress={() => {
                                setSuccessModalVisible(false);
                                resetPostFlow();
                                router.back();
                            }}
                        >
                            <Text style={styles.successButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    imageContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: CONTAINER_HEIGHT,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    image: {
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        resizeMode: 'cover',
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingTop: CONTAINER_HEIGHT,
    },
    infoContainer: {
        padding: 24,
        backgroundColor: '#000',
        minHeight: SCREEN_HEIGHT - CONTAINER_HEIGHT,
    },
    badgesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    categoryBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backdropFilter: 'blur(10px)',
    },
    xpBadge: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        backdropFilter: 'blur(10px)',
    },
    xpText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },
    categoryText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 24,
        fontWeight: '500',
    },
    description: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 24,
        marginBottom: 24,
    },
    friendActivityContainer: {
        marginBottom: 32,
    },
    friendsActiveRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    friendAvatars: {
        flexDirection: 'row',
        marginRight: 12,
    },
    friendAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#000',
    },
    friendText: {
        flex: 1,
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        lineHeight: 18,
    },
    noFriendsText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        fontStyle: 'italic',
    },
    instructionsContainer: {
        backgroundColor: '#111',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#222',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    instructionItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    citationBar: {
        width: 4,
        backgroundColor: Colors.dark.primary, // or a specific color like '#3b82f6' or '#4ade80'
        borderRadius: 2,
        marginRight: 16,
        marginVertical: 4,
    },
    instructionText: {
        flex: 1,
        fontSize: 16,
        color: '#ccc',
        lineHeight: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 34,
        backgroundColor: 'transparent',
    },
    postButtonContainer: {
        width: '100%',
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    postButton: {
        width: '100%',
        borderRadius: 16,
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    postButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        gap: 10,
    },
    postButtonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: Colors.dark.text,
        fontSize: 18,
        marginBottom: 20,
    },
    backButton: {
        padding: 10,
        backgroundColor: Colors.dark.primary,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    postButtonDisabled: {
        opacity: 0.5,
        backgroundColor: '#555',
    },
    // Progress styles
    progressContainer: {
        marginTop: 20,
        marginBottom: 10,
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    progressTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    progressCounter: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
    },
    progressBarRow: {
        flexDirection: 'row',
        gap: 6,
        height: 8,
        marginBottom: 10,
    },
    progressSegment: {
        flex: 1,
        borderRadius: 4,
    },
    progressSegmentActive: {
        backgroundColor: '#4ade80', // Green
        shadowColor: '#4ade80',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    progressSegmentInactive: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    progressNote: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        fontStyle: 'italic',
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    cameraUi: {
        flex: 1,
        justifyContent: 'space-between',
    },
    cameraHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        zIndex: 100,
        marginTop: 10,
    },
    cameraFooter: {
        padding: 30,
        alignItems: 'center',
    },
    cameraIconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButtonInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fff',
    },
    previewContainer: {
        flex: 1,
        backgroundColor: '#111',
    },
    previewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
        backgroundColor: '#000',
        zIndex: 100, // Ensure it's above everything
        marginTop: 10, // Extra safety from dynamic island
    },
    previewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    previewContent: {
        flex: 1,
    },
    previewImage: {
        width: '100%',
        height: SCREEN_WIDTH, // Square or logic based aspect ratio
        resizeMode: 'cover',
    },
    captionContainer: {
        padding: 20,
    },
    captionInput: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 16,
        minHeight: 120,
        textAlignVertical: 'top',
    },
    previewFooter: {
        padding: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: '#222',
        backgroundColor: '#000',
    },
    deployButton: {
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    deployButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    postMetaContainer: {
        marginBottom: 20,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    metaUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#333',
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    metaUsername: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    metaTime: {
        color: '#888',
        fontSize: 12,
        marginTop: 2,
    },
    challengeContextCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    contextTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    contextDescription: {
        color: '#aaa',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginBottom: 12,
    },
    contextLabel: {
        color: '#666',
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    contextInstRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    contextInstDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.dark.primary,
        marginTop: 6,
        marginRight: 10,
    },
    contextInstText: {
        flex: 1,
        color: '#ccc',
        fontSize: 14,
        lineHeight: 20,
    },

    successModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    successModalContent: {
        width: '100%',
        maxWidth: 320,
        backgroundColor: '#1E1E1E',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    successIconContainer: {
        marginBottom: 20,
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    successMessage: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 22,
    },
    successButton: {
        backgroundColor: Colors.dark.primary,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 100,
        width: '100%',
        alignItems: 'center',
    },
    successButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
