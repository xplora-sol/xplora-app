import { Achievement } from "./achievements";
import { UserStats } from "./user";

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
}

export interface QuestData {
  userId: string;
  quests: Quest[];
  userStats: UserStats;
  achievements: Achievement[];
}