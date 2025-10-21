import { initialUserStats, questApi } from '@/api/quest';
import { UserStats } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { QuestData } from '@/types/quest';


export function useQuests() {
  const queryClient = useQueryClient();
  const { user, updateUserStats, addCompletedQuest } = useAuth();

  const { data: questData, isLoading } = useQuery({
    queryKey: ['quests', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      let data = await questApi.getQuestData(user.id);
      
      // Initialize if no data exists
      if (!data) {
        data = await questApi.initializeQuests(
          user.id,
          user.completedQuestIds || [],
          user.stats
        );
      }
      
      return data;
    },
    enabled: !!user,
  });

  const completeQuestMutation = useMutation({
    mutationFn: async (questId: string) => {
      if (!user || !questData) throw new Error('No user or quest data');

      const quest = questData.quests.find((q) => q.id === questId);
      if (!quest || quest.status === 'completed') {
        throw new Error('Quest not found or already completed');
      }

      const updatedQuests = questData.quests.map((q) =>
        q.id === questId ? { ...q, status: 'completed' as const } : q
      );

      const newStats: UserStats = {
        ...questData.userStats,
        totalTokensEarned: questData.userStats.totalTokensEarned + quest.reward,
        completedQuestsCount: questData.userStats.completedQuestsCount + 1,
        level: Math.floor((questData.userStats.totalTokensEarned + quest.reward) / 100) + 1,
      };

      const updatedAchievements = questApi.checkAndUnlockAchievements(
        updatedQuests,
        newStats,
        questData.achievements
      );

      const updatedData: QuestData = {
        ...questData,
        quests: updatedQuests,
        userStats: newStats,
        achievements: updatedAchievements,
      };

      await questApi.updateQuestData(user.id, updatedData);
      
      // Update auth store
      updateUserStats(newStats);
      addCompletedQuest(questId);

      return updatedData;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['quests', user?.id], data);
    },
  });

  const updateQuestStatusMutation = useMutation({
    mutationFn: async ({ questId, status }: { questId: string; status: 'active' | 'completed' }) => {
      if (!user || !questData) throw new Error('No user or quest data');

      const quest = questData.quests.find((q) => q.id === questId);
      if (!quest) throw new Error('Quest not found');

      const updatedQuests = questData.quests.map((q) =>
        q.id === questId ? { ...q, status } : q
      );

      let newStats = questData.userStats;

      if (status === 'completed' && quest.status !== 'completed') {
        newStats = {
          ...questData.userStats,
          totalTokensEarned: questData.userStats.totalTokensEarned + quest.reward,
          completedQuestsCount: questData.userStats.completedQuestsCount + 1,
          level: Math.floor((questData.userStats.totalTokensEarned + quest.reward) / 100) + 1,
        };

        updateUserStats(newStats);
        addCompletedQuest(questId);
      }

      const updatedAchievements = questApi.checkAndUnlockAchievements(
        updatedQuests,
        newStats,
        questData.achievements
      );

      const updatedData: QuestData = {
        ...questData,
        quests: updatedQuests,
        userStats: newStats,
        achievements: updatedAchievements,
      };

      await questApi.updateQuestData(user.id, updatedData);
      return updatedData;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['quests', user?.id], data);
    },
  });

  const earnTokensMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!user || !questData) throw new Error('No user or quest data');

      const newStats: UserStats = {
        ...questData.userStats,
        totalTokensEarned: questData.userStats.totalTokensEarned + amount,
        level: Math.floor((questData.userStats.totalTokensEarned + amount) / 100) + 1,
      };

      const updatedAchievements = questApi.checkAndUnlockAchievements(
        questData.quests,
        newStats,
        questData.achievements
      );

      const updatedData: QuestData = {
        ...questData,
        userStats: newStats,
        achievements: updatedAchievements,
      };

      await questApi.updateQuestData(user.id, updatedData);
      updateUserStats(newStats);

      return updatedData;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['quests', user?.id], data);
    },
  });

  const resetProgressMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No user');

      const newStats = { ...initialUserStats };
      const data = await questApi.initializeQuests(user.id, ['quest_008'], newStats);
      
      updateUserStats(newStats);

      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['quests', user?.id], data);
    },
  });

  // Helper functions
  const getQuestById = (questId: string) => {
    return questData?.quests.find((q) => q.id === questId);
  };

  const getActiveQuests = () => {
    return questData?.quests.filter((q) => q.status === 'active') || [];
  };

  const getCompletedQuests = () => {
    return questData?.quests.filter((q) => q.status === 'completed') || [];
  };

  const getCategoryStats = () => {
    if (!questData) return {};
    
    return questData.quests.reduce((acc, quest) => {
      if (!acc[quest.category]) {
        acc[quest.category] = { total: 0, completed: 0 };
      }
      acc[quest.category].total++;
      if (quest.status === 'completed') {
        acc[quest.category].completed++;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);
  };

  return {
    quests: questData?.quests || [],
    userStats: questData?.userStats || initialUserStats,
    achievements: questData?.achievements || [],
    isLoading,
    completeQuest: completeQuestMutation.mutateAsync,
    updateQuestStatus: updateQuestStatusMutation.mutateAsync,
    earnTokens: earnTokensMutation.mutateAsync,
    resetProgress: resetProgressMutation.mutateAsync,
    getQuestById,
    getActiveQuests,
    getCompletedQuests,
    getCategoryStats,
  };
}

// Stats hook
export function useQuestStatsQuery() {
  const { quests, userStats, getActiveQuests, getCompletedQuests } = useQuests();

  const activeQuests = getActiveQuests();
  const completedQuests = getCompletedQuests();
  const totalQuests = quests.length;
  const completionRate = totalQuests > 0 ? Math.round((completedQuests.length / totalQuests) * 100) : 0;

  return {
    activeQuests,
    completedQuests,
    totalQuests,
    completionRate,
    totalTokens: userStats.totalTokensEarned,
    level: userStats.level,
  };
}
