
import { Colors } from '@/constants/theme';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const DAYS_IN_WEEK = 7;
const DEFAULT_CELL_SIZE = 12;
const CELL_GAP = 4;

// Generate generic dummy data
const generateData = (weeks: number) => {
    const data = [];
    const totalDays = weeks * DAYS_IN_WEEK;

    for (let i = 0; i < totalDays; i++) {
        // Random activity generation
        // Bias towards active to look good
        const rand = Math.random();
        if (rand > 0.3) {
            // 70% chance of activity
            // Distribute levels 1-4
            const level = Math.ceil(Math.random() * 4);
            data.push(level);
        } else {
            data.push(0);
        }
    }
    return data;
};

const getCellColor = (level: number) => {
    switch (level) {
        case 1: return '#262E26'; // Grey-Green Mix (Low Activity)
        case 2: return '#1E4A26'; // Dark Muted Green
        case 3: return '#2E8B40'; // Medium Green
        case 4: return '#3E9E4F'; // Further Toned Down Light Green (High Activity)
        default: return 'rgba(255,255,255,0.03)'; // Subtle empty state
    }
};

const getMonthLabel = (monthIndex: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (3 - monthIndex)); // Last 4 months
    return date.toLocaleString('default', { month: 'short' });
};

interface StreakChartProps {
    weeks?: number;
    showLegend?: boolean;
    orientation?: 'horizontal' | 'vertical'; // horizontal = weeks as cols, vertical = days as cols
    showMonthLabels?: boolean;
    cellSize?: number;
    data?: number[]; // Optional external data
    showTodayLabel?: boolean;
}

export function StreakChart({
    weeks = 16,
    showLegend = false,
    orientation = 'horizontal',
    showMonthLabels = false,
    cellSize = DEFAULT_CELL_SIZE,
    data: externalData,
    showTodayLabel = false
}: StreakChartProps) {
    const data = useMemo(() => externalData || generateData(weeks), [weeks, externalData]);

    return (
        <View style={styles.container}>
            {showMonthLabels && orientation === 'horizontal' && (
                <View style={styles.monthLabels}>
                    {weeks < 8 ? (
                        <Text style={[styles.monthText, { width: '100%' }]}>
                            Last 30 Days
                        </Text>
                    ) : (
                        Array.from({ length: 4 }).map((_, i) => (
                            <Text key={i} style={[styles.monthText, { width: (cellSize * 4) + (CELL_GAP * 3) }]}>
                                {getMonthLabel(i)}
                            </Text>
                        ))
                    )}
                </View>
            )}

            {/* Day Labels for Vertical (Calendar) Mode */}
            {orientation === 'vertical' && (
                <View style={styles.dayLabelsRow}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <Text key={i} style={[styles.dayLabelText, { width: cellSize }]}>{day}</Text>
                    ))}
                </View>
            )}

            <View style={[styles.chart, orientation === 'vertical' && styles.chartVertical]}>
                {orientation === 'horizontal' ? (
                    // Horizontal: Weeks as Columns
                    Array.from({ length: weeks }).map((_, weekIndex) => (
                        <View key={weekIndex} style={styles.column}>
                            {Array.from({ length: DAYS_IN_WEEK }).map((_, dayIndex) => {
                                const index = weekIndex * DAYS_IN_WEEK + dayIndex;
                                const level = data[index];
                                return (
                                    <View
                                        key={dayIndex}
                                        style={[
                                            styles.cell,
                                            {
                                                width: cellSize,
                                                height: cellSize,
                                                backgroundColor: getCellColor(level),
                                                borderColor: 'rgba(255,255,255,0.15)', // Slightly increased visibility
                                                borderWidth: 1,
                                                // Removed opacity reduction so border is visible
                                            }
                                        ]}
                                    />
                                );
                            })}
                        </View>
                    ))
                ) : (
                    // Vertical: Days as Columns (7 cols), Weeks as Rows
                    Array.from({ length: weeks }).map((_, weekIndex) => (
                        <View key={weekIndex} style={styles.row}>
                            {Array.from({ length: DAYS_IN_WEEK }).map((_, dayIndex) => {
                                const index = weekIndex * DAYS_IN_WEEK + dayIndex;
                                const level = data[index] !== undefined ? data[index] : -1;

                                if (level === -1) {
                                    // Render empty transparent placeholder
                                    return <View key={dayIndex} style={{ width: cellSize, height: cellSize }} />;
                                }

                                return (
                                    <View key={dayIndex} style={{ position: 'relative' }}>
                                        <View
                                            style={[
                                                styles.cell,
                                                {
                                                    width: cellSize,
                                                    height: cellSize,
                                                    backgroundColor: getCellColor(level),
                                                    borderRadius: 4, // More rounded for calendar look
                                                }
                                            ]}
                                        />
                                        {showTodayLabel && weekIndex === weeks - 1 && dayIndex === DAYS_IN_WEEK - 1 && (
                                            <Text style={styles.todayLabel} numberOfLines={1}>Today</Text>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    ))
                )}
            </View>

            {showLegend && (
                <View style={styles.legend}>
                    <Text style={styles.legendText}>Less</Text>
                    <View style={[styles.cell, { width: 12, height: 12, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#333', opacity: 0.3 }]} />
                    <View style={[styles.cell, { width: 12, height: 12, backgroundColor: '#262E26' }]} />
                    <View style={[styles.cell, { width: 12, height: 12, backgroundColor: '#1E4A26' }]} />
                    <View style={[styles.cell, { width: 12, height: 12, backgroundColor: '#2E8B40' }]} />
                    <View style={[styles.cell, { width: 12, height: 12, backgroundColor: '#3E9E4F' }]} />
                    <Text style={styles.legendText}>More</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    monthLabels: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 8,
        gap: CELL_GAP, // Match the grid's gap
    },
    monthText: {
        fontSize: 10,
        color: Colors.dark.textSecondary,
        textAlign: 'left',
    },
    chart: {
        flexDirection: 'row',
        gap: CELL_GAP,
    },
    chartVertical: {
        flexDirection: 'column', // Stack rows vertically
    },
    column: {
        gap: CELL_GAP,
    },
    row: {
        flexDirection: 'row',
        gap: CELL_GAP,
    },
    cell: {
        borderRadius: 2,
    },
    legend: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        gap: 4,
    },
    legendText: {
        fontSize: 10,
        color: Colors.dark.textSecondary,
        marginHorizontal: 4,
    },
    todayLabel: {
        position: 'absolute',
        bottom: -16,
        right: 0,
        width: 40,
        textAlign: 'right',
        fontSize: 10,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '500',
    },
    dayLabelsRow: {
        flexDirection: 'row',
        marginBottom: 8,
        gap: CELL_GAP,
    },
    dayLabelText: {
        fontSize: 10,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
        fontWeight: '600',
    },
});
