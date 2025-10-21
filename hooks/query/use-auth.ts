import { authApi } from '@/api/auth';
import { UserStats } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authApi.getUser,
  });

  const loginMutation = useMutation({
    mutationFn: ({ walletAddress, username }: { walletAddress: string; username: string }) =>
      authApi.login(walletAddress, username),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data);
      // Initialize user quests
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No user logged in');
      const updatedUser = { ...user, hasCompletedOnboarding: true };
      return authApi.updateUser(updatedUser);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data);
    },
  });

  const updateUsernameMutation = useMutation({
    mutationFn: async (username: string) => {
      if (!user) throw new Error('No user logged in');
      const updatedUser = { ...user, username };
      return authApi.updateUser(updatedUser);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data);
    },
  });

  const updateUserStatsMutation = useMutation({
    mutationFn: async (stats: UserStats) => {
      if (!user) throw new Error('No user logged in');
      const updatedUser = { ...user, stats };
      return authApi.updateUser(updatedUser);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data);
    },
  });

  const addCompletedQuestMutation = useMutation({
    mutationFn: async (questId: string) => {
      if (!user) throw new Error('No user logged in');
      const completedQuestIds = user.completedQuestIds || [];
      if (!completedQuestIds.includes(questId)) {
        const updatedUser = {
          ...user,
          completedQuestIds: [...completedQuestIds, questId],
        };
        return authApi.updateUser(updatedUser);
      }
      return user;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data);
    },
  });

  return {
    user,
    isAuthenticated: !!user,
    hasCompletedOnboarding: user?.hasCompletedOnboarding ?? null,
    isLoading,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    completeOnboarding: completeOnboardingMutation.mutate,
    updateUsername: updateUsernameMutation.mutate,
    updateUserStats: updateUserStatsMutation.mutate,
    addCompletedQuest: addCompletedQuestMutation.mutate,
  };
}
