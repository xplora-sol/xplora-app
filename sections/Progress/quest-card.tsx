import { GameColors } from '@/constants/theme';
import type { Quest } from '@/types/quest';
import { getCategoryEmoji, getDifficultyColor } from '@/utils/quest-helpers';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/themed-text';

interface QuestCardProps {
  quest: Quest;
}

export function QuestCard({ quest }: QuestCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/quest-details',
      params: { questId: quest.id },
    });
  };

  const getDifficultyGradient = (): [string, string] => {
    switch (quest.difficulty) {
      case 'easy':
        return [GameColors.easy, 'rgba(6, 255, 165, 0.3)'];
      case 'medium':
        return [GameColors.medium, 'rgba(255, 184, 0, 0.3)'];
      case 'hard':
        return [GameColors.hard, 'rgba(255, 0, 110, 0.3)'];
      default:
        return [GameColors.info, 'rgba(0, 245, 255, 0.3)'];
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.cardWrapper}>
        <LinearGradient
          colors={['rgba(26, 26, 46, 0.95)', 'rgba(22, 33, 62, 0.9)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.questCard}
        >
          {/* Neon border effect */}
          <View
            style={[styles.neonBorder, { borderColor: getDifficultyColor(quest.difficulty) }]}
          />

          {/* Glow effect in corner */}
          <View
            style={[styles.cornerGlow, { backgroundColor: getDifficultyColor(quest.difficulty) }]}
          />

          <View style={styles.questHeader}>
            <View style={styles.emojiContainer}>
              <Text style={styles.categoryEmoji}>{getCategoryEmoji(quest.category)}</Text>
            </View>
            <View style={styles.questTitleContainer}>
              <ThemedText type="defaultSemiBold" style={styles.questTitle}>
                {quest.title}
              </ThemedText>
              <ThemedText type="caption" style={styles.questLocation}>
                📍 {quest.location.address}
              </ThemedText>
            </View>
            {quest.status === 'completed' && (
              <View style={styles.completedBadgeContainer}>
                <LinearGradient
                  colors={[GameColors.success, 'rgba(6, 255, 165, 0.6)']}
                  style={styles.completedBadge}
                >
                  <Text style={styles.completedIcon}>✓</Text>
                </LinearGradient>
              </View>
            )}
          </View>

          <ThemedText type="bodySmall" style={styles.questDescription}>
            {quest.description}
          </ThemedText>

          <View style={styles.questFooter}>
            <LinearGradient
              colors={getDifficultyGradient()}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.difficultyBadge}
            >
              <Text style={styles.difficultyText}>{quest.difficulty.toUpperCase()}</Text>
            </LinearGradient>
            <LinearGradient
              colors={[GameColors.accent, GameColors.accentDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.rewardBadge}
            >
              <Text style={styles.rewardText}>🪙 {quest.reward}</Text>
            </LinearGradient>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 16,
    shadowColor: GameColors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  questCard: {
    padding: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  neonBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: GameColors.secondary,
  },
  cornerGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.15,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    zIndex: 1,
  },
  emojiContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  questTitleContainer: {
    flex: 1,
  },
  questTitle: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  questLocation: {
    opacity: 0.8,
    marginTop: 4,
    color: GameColors.secondary,
  },
  completedBadgeContainer: {
    marginLeft: 8,
  },
  completedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  completedIcon: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  questDescription: {
    marginBottom: 12,
    opacity: 0.9,
    lineHeight: 20,
    color: '#FFFFFF',
    zIndex: 1,
  },
  questFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  difficultyText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  rewardBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: GameColors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  rewardText: {
    color: '#1A1A2E',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
