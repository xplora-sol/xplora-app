export interface AchievementRequirement {
  type: 'completed_quests' | 'tokens_earned' | 'all_categories';
  value: number | null;
}

export interface AchievementConfig {
  id: string;
  emoji: string;
  title: string;
  description: string;
  requirement: AchievementRequirement;
}

export interface Achievement extends AchievementConfig {
  unlocked: boolean;
  unlockedAt?: string;
}
