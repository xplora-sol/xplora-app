import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label = 'Overall Progress' }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <ThemedView style={styles.progressSection}>
      <View style={styles.progressHeader}>
        <ThemedText type="bodySmall" style={styles.progressLabel}>
          {label}
        </ThemedText>
        <ThemedText type="bodySmall" style={styles.progressPercentage}>
          {current} / {total} tokens
        </ThemedText>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  progressSection: {
    padding: 20,
    paddingTop: 0,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontWeight: '600',
  },
  progressPercentage: {
    opacity: 0.7,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
});
