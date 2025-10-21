import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { StyleSheet, View } from 'react-native';

interface StatItem {
    value: string | number;
    label: string;
}

interface ProgressStatsGridProps {
    stats: StatItem[][];
}

export function ProgressStatsGrid({ stats }: ProgressStatsGridProps) {
    return (
        <ThemedView style={styles.statsSection}>
            {stats.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.statsGrid}>
                    {row.map((stat, statIndex) => (
                        <ThemedView key={statIndex} style={styles.statCard}>
                            <ThemedText type="heading2">{stat.value}</ThemedText>
                            <ThemedText type="caption" style={styles.statLabel}>{stat.label}</ThemedText>
                        </ThemedView>
                    ))}
                </View>
            ))}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    statsSection: {
        padding: 20,
        paddingTop: 0,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statLabel: {
        opacity: 0.7,
        marginTop: 4,
    },
});
