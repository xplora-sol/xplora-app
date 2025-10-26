import { initialUserStats, questApi } from '@/api/quest';
import { QuestData } from '@/types/quest';
import { UserStats } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';

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
        data = await questApi.initializeQuests(user.id, user.completedQuestIds || [], user.stats);
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

      // If quest has a limitedTime window, verify it's currently active
      if (quest.limitedTime) {
        const now = new Date();
        const start = new Date(quest.limitedTime.start);
        const end = new Date(quest.limitedTime.end);
        if (now < start || now > end) {
          throw new Error('This quest is not available at this time');
        }
      }

      // Apply multiplier (if any) and support extra rewards for stories/rarities
      const multiplier = quest.multiplier ?? 1;
      const earned = Math.round(quest.reward * multiplier);

      const updatedQuests = questData.quests.map((q) =>
        q.id === questId ? { ...q, status: 'completed' as const } : q,
      );

      // Build updated user stats with new fields for streaks, events and rarity counts
      const prevStats = questData.userStats || (initialUserStats as UserStats);

      // Rarity counts (default to existing map)
      const rarityCounts = { ...(prevStats.rarityCompletedCounts || {}) } as Record<string, number>;
      if (quest.rarity) {
        rarityCounts[quest.rarity] = (rarityCounts[quest.rarity] || 0) + 1;
      }

      // Event participation (limited-time quests)
      const eventParticipationCount =
        (prevStats.eventParticipationCount || 0) + (quest.limitedTime ? 1 : 0);

      // Streak handling for daily quests
      let currentStreak = prevStats.currentStreak || 0;
      let lastCheckIn = prevStats.lastCheckIn || null;
      if (quest.daily) {
        const now = new Date();
        const last = lastCheckIn ? new Date(lastCheckIn) : null;

        const isSameUTCDate = (a: Date, b: Date) =>
          a.getUTCFullYear() === b.getUTCFullYear() &&
          a.getUTCMonth() === b.getUTCMonth() &&
          a.getUTCDate() === b.getUTCDate();

        if (last && isSameUTCDate(now, last)) {
          // already checked in today — do nothing
        } else if (last) {
          // if last was yesterday, increment, else reset
          const yesterday = new Date(now);
          yesterday.setUTCDate(yesterday.getUTCDate() - 1);
          if (isSameUTCDate(last, yesterday)) {
            currentStreak = (currentStreak || 0) + 1;
          } else {
            currentStreak = 1;
          }
          lastCheckIn = now.toISOString();
        } else {
          // first time checking in
          currentStreak = 1;
          lastCheckIn = now.toISOString();
        }
      }

      // Story completions: mark story step completed; if last step completed, increment storyCompletions[eventId]
      const storyCompletions = { ...(prevStats.storyCompletions || {}) } as Record<string, number>;
      if (quest.event?.isStory && quest.event.id) {
        // Temporarily mark this step as completed; finalization will happen by counting completed quests
        // We'll compute final story completion below after building updatedQuests
      }

      const newStats: UserStats = {
        ...prevStats,
        totalTokensEarned: (prevStats.totalTokensEarned || 0) + earned,
        completedQuestsCount: (prevStats.completedQuestsCount || 0) + 1,
        level: Math.floor(((prevStats.totalTokensEarned || 0) + earned) / 100) + 1,
        currentStreak,
        lastCheckIn,
        eventParticipationCount,
        storyCompletions,
        rarityCompletedCounts: rarityCounts,
      };

      const updatedAchievements = questApi.checkAndUnlockAchievements(
        updatedQuests,
        newStats,
        questData.achievements,
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

      // If this quest is part of a story chain, activate the next step (if any)
      if (quest.event?.isStory && quest.event?.id) {
        const eventId = quest.event.id;

        // Compute whether story is now fully completed
        const group = updatedQuests.filter((q) => q.event?.id === eventId && q.event?.isStory);
        const totalSteps = group[0]?.event?.totalSteps || group.length;
        const completedSteps = group.filter((g) => g.status === 'completed').length;

        if (completedSteps >= totalSteps && totalSteps > 0) {
          // mark story as completed in stats
          storyCompletions[eventId] = (storyCompletions[eventId] || 0) + 1;
          newStats.storyCompletions = storyCompletions;
        }

        const nextStep = (quest.event.step || 0) + 1;
        const nextQuest = questData.quests.find(
          (q) => q.event?.id === eventId && q.event?.step === nextStep,
        );
        if (nextQuest && nextQuest.status !== 'completed') {
          // Activate the next quest locally and on the server
          const chained = updatedQuests.map((q) =>
            q.id === nextQuest.id ? { ...q, status: 'active' as const } : q,
          );
          const chainedData = { ...updatedData, quests: chained, userStats: newStats };
          // Fire-and-forget server update (we already returned updatedData above)
          try {
            await questApi.updateQuestData(user.id, chainedData);
            queryClient.setQueryData(['quests', user?.id], chainedData);
          } catch {
            // ignore - best-effort
          }
        }
      }

      return updatedData;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['quests', user?.id], data);
    },
  });

  const updateQuestStatusMutation = useMutation({
    mutationFn: async ({
      questId,
      status,
    }: {
      questId: string;
      status: 'active' | 'completed';
    }) => {
      if (!user || !questData) throw new Error('No user or quest data');

      const quest = questData.quests.find((q) => q.id === questId);
      if (!quest) throw new Error('Quest not found');

      const updatedQuests = questData.quests.map((q) => (q.id === questId ? { ...q, status } : q));

      let newStats = questData.userStats;

      if (status === 'completed' && quest.status !== 'completed') {
        // Apply multiplier and update extended stats similar to completeQuestMutation
        const multiplier = quest.multiplier ?? 1;
        const earned = Math.round(quest.reward * multiplier);

        const prevStats = questData.userStats || (initialUserStats as UserStats);
        const rarityCounts = { ...(prevStats.rarityCompletedCounts || {}) } as Record<
          string,
          number
        >;
        if (quest.rarity) {
          rarityCounts[quest.rarity] = (rarityCounts[quest.rarity] || 0) + 1;
        }

        const eventParticipationCount =
          (prevStats.eventParticipationCount || 0) + (quest.limitedTime ? 1 : 0);

        let currentStreak = prevStats.currentStreak || 0;
        let lastCheckIn = prevStats.lastCheckIn || null;
        if (quest.daily) {
          const now = new Date();
          const last = lastCheckIn ? new Date(lastCheckIn) : null;
          const isSameUTCDate = (a: Date, b: Date) =>
            a.getUTCFullYear() === b.getUTCFullYear() &&
            a.getUTCMonth() === b.getUTCMonth() &&
            a.getUTCDate() === b.getUTCDate();

          if (last && isSameUTCDate(now, last)) {
            // do nothing
          } else if (last) {
            const yesterday = new Date(now);
            yesterday.setUTCDate(yesterday.getUTCDate() - 1);
            if (isSameUTCDate(last, yesterday)) {
              currentStreak = (currentStreak || 0) + 1;
            } else {
              currentStreak = 1;
            }
            lastCheckIn = now.toISOString();
          } else {
            currentStreak = 1;
            lastCheckIn = new Date().toISOString();
          }
        }

        const storyCompletions = { ...(prevStats.storyCompletions || {}) } as Record<
          string,
          number
        >;

        newStats = {
          ...prevStats,
          totalTokensEarned: (prevStats.totalTokensEarned || 0) + earned,
          completedQuestsCount: (prevStats.completedQuestsCount || 0) + 1,
          level: Math.floor(((prevStats.totalTokensEarned || 0) + earned) / 100) + 1,
          currentStreak,
          lastCheckIn,
          eventParticipationCount,
          storyCompletions,
          rarityCompletedCounts: rarityCounts,
        };

        updateUserStats(newStats);
        addCompletedQuest(questId);
      }

      const updatedAchievements = questApi.checkAndUnlockAchievements(
        updatedQuests,
        newStats,
        questData.achievements,
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
        questData.achievements,
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

  const revealHiddenMutation = useMutation({
    mutationFn: async (questId: string) => {
      if (!user || !questData) throw new Error('No user or quest data');

      const quest = questData.quests.find((q) => q.id === questId);
      if (!quest) throw new Error('Quest not found');

      // Reveal the hidden quest by clearing the hidden flag and ensuring it's active
      const updatedQuests = questData.quests.map((q) =>
        q.id === questId ? { ...q, hidden: false, status: 'active' as const } : q,
      );

      const updatedData: QuestData = {
        ...questData,
        quests: updatedQuests,
      };

      await questApi.updateQuestData(user.id, updatedData);
      return updatedData;
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
    revealHidden: revealHiddenMutation.mutateAsync,
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
  const completionRate =
    totalQuests > 0 ? Math.round((completedQuests.length / totalQuests) * 100) : 0;

  return {
    activeQuests,
    completedQuests,
    totalQuests,
    completionRate,
    totalTokens: userStats.totalTokensEarned,
    level: userStats.level,
  };
}
