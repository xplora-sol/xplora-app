import usersData from '@/data/users.json';
import { User } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = 'auth-user';

export const authApi = {
  getUser: async (): Promise<User | null> => {
    try {
      const data = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  },

  login: async (walletAddress: string, username: string): Promise<User> => {
    // Check if user exists in users.json
    const existingUser = usersData.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    );

    const user: User = existingUser || {
      id: `user_${Date.now()}`,
      walletAddress,
      username,
      createdAt: new Date().toISOString(),
      hasCompletedOnboarding: false,
      completedQuestIds: [],
      stats: {
        totalTokensEarned: 0,
        completedQuestsCount: 0,
        level: 1,
        memberSince: new Date().toISOString(),
        currentStreak: 0,
        lastCheckIn: null,
        eventParticipationCount: 0,
        storyCompletions: {},
        rarityCompletedCounts: {},
      },
    };

    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  },

  updateUser: async (updatedUser: User): Promise<User> => {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },
};
