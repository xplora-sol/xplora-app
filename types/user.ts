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
  // New fields for streaks, events and rarity tracking
  currentStreak?: number; // consecutive daily check-ins
  lastCheckIn?: string | null; // ISO date string of last daily check-in
  eventParticipationCount?: number; // counts limited-time event participations
  // map of eventId -> number of story steps completed or 1 if story finished
  storyCompletions?: Record<string, number>;
  // counts of completed quests by rarity
  rarityCompletedCounts?: Partial<Record<'common' | 'rare' | 'epic' | 'legendary', number>>;
}
