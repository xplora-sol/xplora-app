import achievementsData from '@/data/achievements.json';
import questsData from '@/data/quests.json';
import { Achievement, AchievementConfig } from '@/types/achievements';
import { Quest, QuestData } from '@/types/quest';
import { UserStats } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEST_STORAGE_KEY = 'quest-data';

export const initialUserStats: UserStats = {
  totalTokensEarned: 0,
  completedQuestsCount: 0,
  level: 1,
  memberSince: new Date().toISOString(),
  currentStreak: 0,
  lastCheckIn: null,
  eventParticipationCount: 0,
  storyCompletions: {},
  rarityCompletedCounts: {},
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
    // Backend may return one of multiple shapes:
    // 1) Local/static shape: { quests: [ ... ] }
    // 2) New backend shape: { success: true, data: { location: '...', quests: [ ... ] }, error: null }
    // Normalize to an array of quest-like objects and map them into our internal Quest shape with
    // safe defaults so missing fields from the backend won't crash the app.
    // Separate out backend-provided quests (new backend shape) and local frontend quests
    const backendSource: any[] = Array.isArray((questsData as any)?.data?.quests)
      ? (questsData as any).data.quests
      : [];
    const localSource: any[] = Array.isArray((questsData as any).quests)
      ? (questsData as any).quests
      : [];

    const normalizeId = (q: any, idx: number) => {
      if (q?.id) return String(q.id);
      if (q?.created_at) return `quest_${new Date(q.created_at).getTime()}_${idx}`;
      if (q?.title) return `quest_${q.title.toLowerCase().replace(/[^a-z0-9]+/gi, '_')}_${idx}`;
      return `quest_${Date.now()}_${idx}`;
    };

    // Map backend-provided quests into our frontend Quest shape. Treat the backend fields as the
    // source of truth: prefer them (and attach the original object as `rawBackend`). Other fields
    // that the frontend expects will be filled with sane defaults when missing.
    const backendMapped: Quest[] = backendSource.map((q: any, i: number) => {
      const id = normalizeId(q, i);

      // Backend is expected to provide these fields (title, description, latitude, longitude,
      // landmark_name or location.address). We'll use them as-is when present; if missing we
      // fallback but log to console for visibility.
      const lat = q?.latitude ?? q?.lat ?? q?.location?.latitude ?? 0;
      const lon = q?.longitude ?? q?.lng ?? q?.location?.longitude ?? 0;
      const addr = q?.landmark_name ?? q?.location?.address ?? q?.address ?? '';

      const mapped: Quest = {
        id,
        title: q.title ?? q?.name ?? '',
        description: q.description ?? q?.details ?? '',
        location: {
          latitude: typeof lat === 'number' ? lat : Number(lat) || 0,
          longitude: typeof lon === 'number' ? lon : Number(lon) || 0,
          address: String(addr || ''),
        },
        // Backend may not provide reward; default to 0 but prefer backend value when present
        reward: typeof q?.reward === 'number' ? q.reward : Number(q?.reward) || 0,
        // Map backend's quest_type to frontend difficulty/category where appropriate
        difficulty: (q?.difficulty as any) ?? 'easy',
        category: q?.category ?? (q?.quest_type as any) ?? 'exploration',
        status: completedQuestIds.includes(id) ? 'completed' : (q?.status as any) ?? 'active',
        completionCriteria: q?.completionCriteria ?? q?.verifiable_landmark ?? '',
        actionType:
          (q?.actionType as any) ??
          (q?.time_to_live_hours ? 'timed_photo' : (q?.action_type as any) ?? 'photo'),
        actionLabel: q?.actionLabel ?? q?.action_label ?? 'Complete',
        verificationSteps: Array.isArray(q?.verificationSteps)
          ? q.verificationSteps
          : q?.verifiable_landmark
          ? [q.verifiable_landmark]
          : q?.verification_steps ?? [],
        quizQuestions: q?.quizQuestions ?? q?.quiz_questions,
        rarity: q?.rarity,
        limitedTime:
          q?.limitedTime ??
          (q?.time_to_live_hours
            ? {
                // create a limitedTime window of now -> now + hours if only TTL provided
                start: new Date().toISOString(),
                end: new Date(
                  Date.now() + (Number(q.time_to_live_hours) || 0) * 3600 * 1000,
                ).toISOString(),
              }
            : q?.limited_time),
        event: q?.event,
        multiplier: q?.multiplier,
        repeatable: q?.repeatable ?? q?.daily ?? false,
        daily: q?.daily ?? false,
        hidden: q?.hidden ?? false,
      } as Quest;

      // Keep original backend object for debugging or advanced UI if needed
      (mapped as any).rawBackend = q;
      return mapped;
    });

    // Map any local frontend quests (legacy or custom) into Quest shape as before
    const localMapped: Quest[] = localSource.map((q: any, i: number) => {
      const id = normalizeId(q, i + backendMapped.length);

      const latitude =
        q?.location?.latitude ??
        q?.latitude ??
        q?.lat ??
        (typeof q?.location === 'object' && q.location?.lat) ??
        0;
      const longitude =
        q?.location?.longitude ??
        q?.longitude ??
        q?.lng ??
        (typeof q?.location === 'object' && q.location?.lng) ??
        0;

      const address = q?.location?.address ?? q?.landmark_name ?? q?.address ?? '';

      const mapped: Quest = {
        id,
        title: q?.title ?? '',
        description: q?.description ?? '',
        location: {
          latitude: typeof latitude === 'number' ? latitude : Number(latitude) || 0,
          longitude: typeof longitude === 'number' ? longitude : Number(longitude) || 0,
          address: String(address || ''),
        },
        reward: typeof q?.reward === 'number' ? q.reward : Number(q?.reward) || 0,
        difficulty: (q?.difficulty as any) ?? 'easy',
        category: q?.category ?? (q?.quest_type as any) ?? 'exploration',
        status: completedQuestIds.includes(id) ? 'completed' : (q?.status as any) ?? 'active',
        completionCriteria: q?.completionCriteria ?? q?.verifiable_landmark ?? '',
        actionType:
          (q?.actionType as any) ??
          (q?.time_to_live_hours ? 'timed_photo' : (q?.action_type as any) ?? 'photo'),
        actionLabel: q?.actionLabel ?? q?.action_label ?? 'Complete',
        verificationSteps: Array.isArray(q?.verificationSteps)
          ? q.verificationSteps
          : q?.verifiable_landmark
          ? [q.verifiable_landmark]
          : q?.verification_steps ?? [],
        quizQuestions: q?.quizQuestions ?? q?.quiz_questions,
        rarity: q?.rarity,
        limitedTime: q?.limitedTime ?? q?.limited_time,
        event: q?.event,
        multiplier: q?.multiplier,
        repeatable: q?.repeatable ?? q?.daily ?? false,
        daily: q?.daily ?? false,
        hidden: q?.hidden ?? false,
      } as Quest;

      return mapped;
    });

    // Combine: prefer backend quests first, then append local quests that don't conflict by id
    const seenIds = new Set<string>(backendMapped.map((b) => b.id));
    const combined = [...backendMapped, ...localMapped.filter((l) => !seenIds.has(l.id))];

    const quests: Quest[] = combined;

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
        case 'event_participation':
          shouldUnlock =
            (userStats.eventParticipationCount || 0) >= (achievement.requirement.value || 0);
          break;
        case 'story_completed': {
          // Count fully completed story events (all steps completed)
          const storyGroups: Record<string, Quest[]> = {};
          quests.forEach((q) => {
            if (q.event?.isStory && q.event.id) {
              storyGroups[q.event.id] = storyGroups[q.event.id] || [];
              storyGroups[q.event.id].push(q);
            }
          });

          let completedStories = 0;
          Object.values(storyGroups).forEach((group) => {
            const totalSteps = group[0]?.event?.totalSteps || group.length;
            const completedSteps = group.filter((g) => g.status === 'completed').length;
            if (completedSteps >= totalSteps && totalSteps > 0) completedStories++;
          });

          shouldUnlock = completedStories >= (achievement.requirement.value || 0);
          break;
        }
        case 'streak_days':
          shouldUnlock = (userStats.currentStreak || 0) >= (achievement.requirement.value || 0);
          break;
        case 'rarity_completed': {
          // count high-rarity completed quests (rare/epic/legendary)
          const count = completedQuests.filter((q) =>
            ['rare', 'epic', 'legendary'].includes(q.rarity || 'common'),
          ).length;
          shouldUnlock = count >= (achievement.requirement.value || 0);
          break;
        }
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
