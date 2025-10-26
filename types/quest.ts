import { Achievement } from './achievements';
import { UserStats } from './user';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  status: 'active' | 'completed';
  completionCriteria: string;
  actionType: 'photo' | 'quiz' | 'photo_rating' | 'checkin_photo' | 'timed_photo' | 'review';
  actionLabel: string;
  verificationSteps: string[];
  quizQuestions?: QuizQuestion[];
  // Optional fields to support addictive mechanics / events
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  // If present, only completable within this ISO window
  limitedTime?: {
    start: string; // ISO datetime
    end: string; // ISO datetime
  };
  // Story / event metadata - used for chaining multi-step quests
  event?: {
    id: string; // event/story id shared across steps
    step?: number; // 1..N
    totalSteps?: number;
    isStory?: boolean; // true if part of a narrative chain
  };
  // Reward multiplier (e.g. for rare/limited quests or streaks)
  multiplier?: number;
  // If true, quest is repeatable (daily/weekly)
  repeatable?: boolean;
  // If true, mark as a daily quest (UI/streak logic elsewhere)
  daily?: boolean;
  // Hidden quests are not visible in lists until revealed by proximity
  hidden?: boolean;
}

export interface QuestData {
  userId: string;
  quests: Quest[];
  userStats: UserStats;
  achievements: Achievement[];
}
