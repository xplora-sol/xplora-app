import { getCategoryEmoji } from '@/utils/quest-helpers';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet, Text, View } from 'react-native';

interface CategoryStat {
  category: string;
  total: number;
  completed: number;
}

interface CategoryProgressCardProps {
  categoryStat: CategoryStat;
}

export function CategoryProgressCard({ categoryStat }: CategoryProgressCardProps) {
  const { category, total, completed } = categoryStat;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <ThemedView style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryEmoji}>{getCategoryEmoji(category)}</Text>
        <ThemedText type="defaultSemiBold">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </ThemedText>
      </View>
      <ThemedText type="bodySmall" style={styles.categoryStats}>
        {completed} of {total} completed
      </ThemedText>
      <View style={styles.categoryProgressBar}>
        <View style={[styles.categoryProgressFill, { width: `${percentage}%` }]} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  categoryCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryStats: {
    opacity: 0.7,
    marginBottom: 8,
  },
  categoryProgressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
});
