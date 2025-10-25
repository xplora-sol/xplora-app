import type { Quest } from '@/types/quest';

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in meters
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Check if a quest is within the specified radius from user's location
 * @param userLat User's latitude
 * @param userLon User's longitude
 * @param quest Quest object
 * @param radiusMeters Radius in meters (default 50m)
 * @returns Object with isNearby boolean and distance in meters
 */
export function isQuestNearby(
  userLat: number,
  userLon: number,
  quest: Quest,
  radiusMeters: number = 50,
): { isNearby: boolean; distance: number } {
  const distance = calculateDistance(
    userLat,
    userLon,
    quest.location.latitude,
    quest.location.longitude,
  );

  return {
    isNearby: distance <= radiusMeters,
    distance: Math.round(distance),
  };
}

/**
 * Find all quests within the specified radius from user's location
 * @param userLat User's latitude
 * @param userLon User's longitude
 * @param quests Array of quests
 * @param radiusMeters Radius in meters (default 50m)
 * @returns Array of quests that are nearby with their distances
 */
export function findNearbyQuests(
  userLat: number,
  userLon: number,
  quests: Quest[],
  radiusMeters: number = 50,
): { quest: Quest; distance: number }[] {
  const nearbyQuests: { quest: Quest; distance: number }[] = [];

  for (const quest of quests) {
    // Only check active quests
    if (quest.status !== 'active') {
      continue;
    }

    const { isNearby, distance } = isQuestNearby(userLat, userLon, quest, radiusMeters);

    if (isNearby) {
      nearbyQuests.push({ quest, distance });
    }
  }

  // Sort by distance (closest first)
  return nearbyQuests.sort((a, b) => a.distance - b.distance);
}
