import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

interface FeedPostProps {
    username: string;
    challengeTitle: string;
    imageUrl: any;
    userAvatar?: any;
    likes: number;
    caption: string;
    timestamp: string;
}

const { width } = Dimensions.get('window');

export function FeedPost({
    username,
    challengeTitle,
    imageUrl,
    userAvatar,
    likes = 0,
    caption,
    timestamp
}: FeedPostProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
    };

    return (
        <View style={styles.container}>
            {/* Post Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Image 
                        source={userAvatar || require('@/assets/images/profile_pic.jpg')} 
                        style={styles.avatar} 
                        contentFit="cover"
                        cachePolicy="memory-disk"
                    />
                    <View style={styles.headerText}>
                        <Text style={styles.username}>{username}</Text>
                        <Text style={styles.challengeTitle}>{challengeTitle}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <MoreHorizontal size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Post Image */}
            <View style={styles.imageContainer}>
                <Image 
                    source={imageUrl} 
                    style={styles.postImage} 
                    contentFit="cover"
                    cachePolicy="memory-disk"
                />
            </View>

            {/* Action Bar */}
            <View style={styles.actionBar}>
                <View style={styles.actionGroup}>
                    <TouchableOpacity style={styles.actionIcon} onPress={handleLike}>
                        <Heart size={26} color={isLiked ? '#FF3B30' : '#fff'} fill={isLiked ? '#FF3B30' : 'transparent'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionIcon}>
                        <MessageCircle size={26} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionIcon}>
                        <Send size={26} color="#fff" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.saveIcon} onPress={handleSave}>
                    <Bookmark size={26} color="#fff" fill={isSaved ? '#fff' : 'transparent'} />
                </TouchableOpacity>
            </View>

            {/* Likes */}
            <View style={styles.infoSection}>
                <Text style={styles.likesText}>{likeCount.toLocaleString()} likes</Text>

                {/* Caption */}
                <Text style={styles.captionContainer}>
                    <Text style={styles.captionUsername}>{username}</Text>
                    <Text style={styles.captionText}> {caption}</Text>
                </Text>

                {/* Timestamp */}
                <Text style={styles.timestampText}>{timestamp}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'transparent',
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10,
        backgroundColor: '#333',
    },
    headerText: {
        justifyContent: 'center',
    },
    username: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    challengeTitle: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    moreButton: {
        padding: 4,
    },
    imageContainer: {
        width: width - 32,
        height: width - 32, // 1:1 aspect ratio for a slightly smaller vertical footprint
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    actionBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 10,
    },
    actionGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionIcon: {
        marginRight: 16,
    },
    saveIcon: {
        marginLeft: 'auto',
    },
    infoSection: {
        paddingHorizontal: 16,
    },
    likesText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 6,
    },
    captionContainer: {
        marginBottom: 4,
    },
    captionUsername: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    captionText: {
        color: '#fff',
        fontSize: 14,
    },
    timestampText: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        marginTop: 4,
    },
});
