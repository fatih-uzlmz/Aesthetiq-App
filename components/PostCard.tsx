import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

interface PostCardProps {
    username: string;
    challengeTitle: string;
    imageUrl: string;
    timestamp: string;
}

export function PostCard({ username, challengeTitle, imageUrl, timestamp }: PostCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.avatarPlaceholder} />
                <View>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.challenge}>{challengeTitle}</Text>
                </View>
                <Text style={styles.timestamp}>{timestamp}</Text>
            </View>
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.footer}>
                {/* Placeholder for interactions like heart, comment */}
                <Text style={styles.footerText}>Completed the challenge!</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#eee',
        marginRight: 12,
    },
    username: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    challenge: {
        color: '#666',
        fontSize: 12,
    },
    timestamp: {
        marginLeft: 'auto',
        color: '#999',
        fontSize: 12,
    },
    image: {
        width: '100%',
        height: width, // Square image
        backgroundColor: '#f0f0f0',
    },
    footer: {
        padding: 12,
    },
    footerText: {
        fontSize: 14,
    },
});
