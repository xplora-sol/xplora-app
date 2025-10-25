import achievementsData from '@/data/achievements.json';
import questsData from '@/data/quests.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievement, AchievementConfig } from '@/types/achievements';
import { Quest, QuestData } from '@/types/quest';
import { UserStats } from '@/types/user';

const QUEST_STORAGE_KEY = 'quest-data';

export const initialUserStats: UserStats = {
  totalTokensEarned: 0,
  completedQuestsCount: 0,
  level: 1,
  memberSince: new Date().toISOString(),
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
