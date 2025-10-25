import type { Achievement } from '@/types/achievements';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet, Text, View } from 'react-native';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  if (!achievement.unlocked) return null;

  return (
    <ThemedView style={styles.achievementCard}>
      <Text style={styles.achievementEmoji}>{achievement.emoji}</Text>
      <View style={styles.achievementInfo}>
        <ThemedText type="defaultSemiBold">{achievement.title}</ThemedText>
        <ThemedText type="bodySmall" style={styles.achievementDesc}>
          {achievement.description}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  achievementEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementDesc: {
    opacity: 0.7,
  },
});
