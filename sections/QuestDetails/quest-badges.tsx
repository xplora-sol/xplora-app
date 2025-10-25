import { ThemedText } from '@/components/themed-text';

import { StyleSheet, View } from 'react-native';

interface QuestBadgesProps {
  difficulty: string;
  difficultyColor: string;
  category: string;
  categoryColor: string;
}

export function QuestBadges({
  difficulty,
  difficultyColor,
  category,
  categoryColor,
}: QuestBadgesProps) {
  return (
    <View style={styles.badgeContainer}>
      <View style={[styles.badge, { backgroundColor: difficultyColor }]}>
        <ThemedText type="captionBold" style={styles.badgeText}>
          {difficulty.toUpperCase()}
        </ThemedText>
      </View>
      <View style={[styles.badge, { backgroundColor: categoryColor }]}>
        <ThemedText type="captionBold" style={styles.badgeText}>
          {category.toUpperCase()}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#fff',
  },
});
