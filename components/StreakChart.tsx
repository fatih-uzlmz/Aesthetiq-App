import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const DAYS_IN_WEEK = 7;
const WEEKS_TO_SHOW = 12; // Show last 12 weeks
const TOTAL_DAYS = DAYS_IN_WEEK * WEEKS_TO_SHOW;

// Generate dummy data
const generateData = () => {
    const data = [];
    for (let i = 0; i < TOTAL_DAYS; i++) {
        // Random activity level: 0 (none), 1 (low), 2 (medium), 3 (high)
        const level = Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0;
        data.push(level);
    }
    return data;
};

const ACTIVITY_DATA = generateData();

const getColor = (level: number) => {
    switch (level) {
        case 1: return '#9be9a8'; // Low
        case 2: return '#40c463'; // Medium
        case 3: return '#30a14e'; // High
        default: return '#ebedf0'; // None
    }
};

export function StreakChart() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Activity Streak</Text>
            <View style={styles.chart}>
                {ACTIVITY_DATA.map((level, index) => (
                    <View
                        key={index}
                        style={[styles.cell, { backgroundColor: getColor(level) }]}
                    />
                ))}
            </View>
            <View style={styles.legend}>
                <Text style={styles.legendText}>Less</Text>
                <View style={[styles.legendBox, { backgroundColor: '#ebedf0' }]} />
                <View style={[styles.legendBox, { backgroundColor: '#9be9a8' }]} />
                <View style={[styles.legendBox, { backgroundColor: '#40c463' }]} />
                <View style={[styles.legendBox, { backgroundColor: '#30a14e' }]} />
                <Text style={styles.legendText}>More</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    chart: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    cell: {
        width: 12,
        height: 12,
        borderRadius: 2,
    },
    legend: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 12,
        gap: 4,
    },
    legendBox: {
        width: 12,
        height: 12,
        borderRadius: 2,
    },
    legendText: {
        fontSize: 12,
        color: '#666',
        marginHorizontal: 4,
    },
});
