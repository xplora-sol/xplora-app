import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { StyleSheet, View } from 'react-native';

interface StatBox {
    value: string | number;
    label: string;
}

interface ProfileStatsGridProps {
    stats: StatBox[];
}

export function ProfileStatsGrid({ stats }: ProfileStatsGridProps) {
    return (
        <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
                <ThemedView key={index} style={styles.statBox}>
                    <ThemedText type="heading2">{stat.value}</ThemedText>
                    <ThemedText type="caption" style={styles.statLabel}>{stat.label}</ThemedText>
                </ThemedView>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statBox: {
        flex: 1,
        minWidth: '45%',
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
    },
});
