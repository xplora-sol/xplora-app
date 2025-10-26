import achievementsData from '@/data/achievements.json';
import questsData from '@/data/quests.json';
import { Achievement, AchievementConfig } from '@/types/achievements';
import { Quest, QuestData } from '@/types/quest';
import { UserStats } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEST_STORAGE_KEY = 'quest-data';

export const initialUserStats: UserStats = {
  totalTokensEarned: 0,
  completedQuestsCount: 0,
  level: 1,
  memberSince: new Date().toISOString(),
  currentStreak: 0,
  lastCheckIn: null,
  eventParticipationCount: 0,
  storyCompletions: {},
  rarityCompletedCounts: {},
};

export const questApi = {
  getQuestData: async (userId: string | undefined): Promise<QuestData | null> => {
    if (!userId) return null;

    try {
      const data = await AsyncStorage.getItem(`${QUEST_STORAGE_KEY}-${userId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get quest data:', error);
      return null;
    }
  },

  initializeQuests: async (
    userId: string,
    completedQuestIds: string[] = [],
    stats?: UserStats,
  ): Promise<QuestData> => {
    const quests = questsData.quests.map((quest) => ({
      ...quest,
      status: completedQuestIds.includes(quest.id) ? 'completed' : 'active',
    })) as Quest[];

    const questData: QuestData = {
      userId,
      quests,
      userStats: stats || initialUserStats,
      achievements: (achievementsData.achievements as AchievementConfig[]).map((achievement) => ({
        ...achievement,
        unlocked: false,
      })),
    };

    await AsyncStorage.setItem(`${QUEST_STORAGE_KEY}-${userId}`, JSON.stringify(questData));
    return questData;
  },

  updateQuestData: async (userId: string, questData: QuestData): Promise<QuestData> => {
    await AsyncStorage.setItem(`${QUEST_STORAGE_KEY}-${userId}`, JSON.stringify(questData));
    return questData;
  },

  checkAndUnlockAchievements: (
    quests: Quest[],
    userStats: UserStats,
    achievements: Achievement[],
  ): Achievement[] => {
    const completedQuests = quests.filter((q) => q.status === 'completed');
    const categories = new Set(completedQuests.map((q) => q.category));

    return achievements.map((achievement) => {
      if (achievement.unlocked) return achievement;

      let shouldUnlock = false;

      switch (achievement.requirement.type) {
        case 'completed_quests':
          shouldUnlock = completedQuests.length >= (achievement.requirement.value || 0);
          break;
        case 'tokens_earned':
          shouldUnlock = userStats.totalTokensEarned >= (achievement.requirement.value || 0);
          break;
        case 'event_participation':
          shouldUnlock =
            (userStats.eventParticipationCount || 0) >= (achievement.requirement.value || 0);
          break;
        case 'story_completed': {
          // Count fully completed story events (all steps completed)
          const storyGroups: Record<string, Quest[]> = {};
          quests.forEach((q) => {
            if (q.event?.isStory && q.event.id) {
              storyGroups[q.event.id] = storyGroups[q.event.id] || [];
              storyGroups[q.event.id].push(q);
            }
          });

          let completedStories = 0;
          Object.values(storyGroups).forEach((group) => {
            const totalSteps = group[0]?.event?.totalSteps || group.length;
            const completedSteps = group.filter((g) => g.status === 'completed').length;
            if (completedSteps >= totalSteps && totalSteps > 0) completedStories++;
          });

          shouldUnlock = completedStories >= (achievement.requirement.value || 0);
          break;
        }
        case 'streak_days':
          shouldUnlock = (userStats.currentStreak || 0) >= (achievement.requirement.value || 0);
          break;
        case 'rarity_completed': {
          // count high-rarity completed quests (rare/epic/legendary)
          const count = completedQuests.filter((q) =>
            ['rare', 'epic', 'legendary'].includes(q.rarity || 'common'),
          ).length;
          shouldUnlock = count >= (achievement.requirement.value || 0);
          break;
        }
        case 'all_categories':
          const allCategories = new Set(quests.map((q) => q.category));
          shouldUnlock = categories.size === allCategories.size && allCategories.size > 0;
          break;
      }

      if (shouldUnlock) {
        return {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
      }

      return achievement;
    });
  },
};
