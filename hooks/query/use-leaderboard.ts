import { LeaderboardsFile } from '@/types/leaderboard';
import { useQuery } from '@tanstack/react-query';

export function fetchLeaderboards(): Promise<LeaderboardsFile> {
  // For now load from local JSON file (simulate API)
  return import('@/data/leaderboards.json').then((m) => m.default || m);
}

export function useLeaderboards() {
  return useQuery({
    queryKey: ['leaderboards'],
    queryFn: fetchLeaderboards,
    staleTime: 1000 * 60 * 5,
  });
}
