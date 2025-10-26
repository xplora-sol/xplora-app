import { ThemedText } from '@/components/themed-text';
import { GameColors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

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
        <LinearGradient
          key={index}
          colors={[GameColors.primary, GameColors.primaryLight]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.statBox}
        >
          <ThemedText type="heading2" style={styles.statValue}>
            {stat.value}
          </ThemedText>
          <ThemedText type="caption" style={styles.statLabel}>
            {stat.label}
          </ThemedText>
        </LinearGradient>
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
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: GameColors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  statLabel: {
    opacity: 0.7,
  },
  statValue: {
    color: '#fff',
  },
});
