export interface User {
  id: string;
  walletAddress: string;
  username: string;
  createdAt: string;
  hasCompletedOnboarding: boolean | null;
  completedQuestIds?: string[];
  stats?: UserStats;
}

export interface UserStats {
  totalTokensEarned: number;
  completedQuestsCount: number;
  level: number;
  memberSince: string;
}