export type LeaderboardUser = {
  userId: string;
  username: string;
};

export type GlobalAllTime = {
  byQuestsCompleted: (LeaderboardUser & { completedQuests: number })[];
  byXpEarned: (LeaderboardUser & { xp: number })[];
};

export type Season = {
  id: string;
  name: string;
  start: string;
  end: string;
  winner?: LeaderboardUser;
  standings: ({ rank: number } & LeaderboardUser & { points: number })[];
  onChainMetadata?: { contract: string; tokenId: string; uri: string };
};

export type Seasonal = {
  currentSeason?: string;
  seasons: Season[];
};

export type LocationBased = Record<
  string,
  ({ rank: number } & LeaderboardUser & { score: number })[]
>;

export type QuestSpecific = Record<
  string,
  {
    fastestCompletions?: ({ rank: number } & LeaderboardUser & { timeSeconds: number })[];
    mostCreative?: ({ rank: number } & LeaderboardUser & { votes: number })[];
  }
>;

export type StreakLeaders = {
  currentLongest?: LeaderboardUser & { days: number };
  allTimeLongest?: LeaderboardUser & { days: number };
};

export type RecentActivity = {
  last7Days: (LeaderboardUser & { activityCount: number })[];
};

export type LeaderboardsFile = {
  globalAllTime: GlobalAllTime;
  seasonal: Seasonal;
  locationBased: LocationBased;
  questSpecific: QuestSpecific;
  streakLeaders: StreakLeaders;
  recentActivity: RecentActivity;
};
