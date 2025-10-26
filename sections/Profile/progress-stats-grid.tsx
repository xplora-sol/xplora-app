import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LinearGradient } from 'expo-linear-gradient';

import { StyleSheet, View } from 'react-native';

const CARD_GRADIENTS = [
  ['#0ea5e9', '#7c3aed'],
  ['#f97316', '#ef4444'],
  ['#10b981', '#06b6d4'],
  ['#f59e0b', '#f97316'],
];

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
          {row.map((stat, statIndex) => {
            const gradient = CARD_GRADIENTS[(rowIndex * 2 + statIndex) % CARD_GRADIENTS.length];
            return (
              <LinearGradient
                key={statIndex}
                colors={gradient as [string, string]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.statCardGradient}
              >
                <ThemedView
                  style={styles.statCardContent}
                  lightColor="transparent"
                  darkColor="transparent"
                >
                  <ThemedText type="heading2">{stat.value}</ThemedText>
                  <ThemedText type="caption" style={styles.statLabel}>
                    {stat.label}
                  </ThemedText>
                </ThemedView>
              </LinearGradient>
            );
          })}
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
  statCardGradient: {
    flex: 1,
    borderRadius: 12,
    padding: 0,
  },
  statCardContent: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    opacity: 0.7,
    marginTop: 4,
  },
});
