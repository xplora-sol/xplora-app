import type { Quest } from '@/types/quest';
import { findNearbyHiddenQuests, findNearbyQuests } from '@/utils/geofencing';
import { scheduleQuestNotification } from '@/utils/notifications';
import * as Location from 'expo-location';
import { useEffect, useRef } from 'react';

interface UseGeofencingOptions {
  enabled: boolean;
  radiusMeters: number;
  userLocation: { latitude: number; longitude: number } | null;
  quests: Quest[];
  onLocationUpdate?: (coords: { latitude: number; longitude: number }) => void;
  // Called when a hidden quest is discovered nearby (best-effort)
  onHiddenFound?: (data: { questId: string; distance: number }) => void;
}

/**
 * Hook to handle geofencing and nearby quest notifications
 */
export function useGeofencing({
  enabled,
  radiusMeters,
  userLocation,
  quests,
  onLocationUpdate,
  onHiddenFound,
}: UseGeofencingOptions) {
  // Track which quests we've already notified about using ref to avoid re-renders
  const notifiedQuestIdsRef = useRef<Set<string>>(new Set());
  const notifiedHiddenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled || !userLocation) {
      return;
    }

    let locationSubscription: Location.LocationSubscription | null = null;

    const handleLocationUpdate = (location: Location.LocationObject) => {
      const newCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Notify parent component of location update
      onLocationUpdate?.(newCoords);

      // Check for nearby quests
      const nearbyQuests = findNearbyQuests(
        newCoords.latitude,
        newCoords.longitude,
        quests,
        radiusMeters,
      );

      // Send notifications for nearby quests we haven't notified about yet
      nearbyQuests.forEach(({ quest, distance }) => {
        if (!notifiedQuestIdsRef.current.has(quest.id)) {
          scheduleQuestNotification(quest.title, quest.reward, distance);
          notifiedQuestIdsRef.current.add(quest.id);
        }
      });

      // Remove quests from notified list if user moved away
      const nearbyQuestIds = new Set(nearbyQuests.map(({ quest }) => quest.id));
      notifiedQuestIdsRef.current.forEach((id) => {
        if (!nearbyQuestIds.has(id)) {
          notifiedQuestIdsRef.current.delete(id);
        }
      });

      // Check for hidden quests using a slightly larger radius for discovery
      const nearbyHidden = findNearbyHiddenQuests(
        newCoords.latitude,
        newCoords.longitude,
        quests,
        Math.max(radiusMeters, 100),
      );

      nearbyHidden.forEach((item: { quest: Quest; distance: number }) => {
        const { quest: hQuest, distance: hDistance } = item;
        if (!notifiedHiddenIdsRef.current.has(hQuest.id)) {
          // Notify parent that a hidden quest is nearby (UI can present a secret popup)
          onHiddenFound?.({ questId: hQuest.id, distance: hDistance });
          notifiedHiddenIdsRef.current.add(hQuest.id);
        }
      });

      // Remove hidden notifications if moved away
      const hiddenIds = new Set(nearbyHidden.map((item) => item.quest.id));
      notifiedHiddenIdsRef.current.forEach((id) => {
        if (!hiddenIds.has(id)) notifiedHiddenIdsRef.current.delete(id);
      });
    };

    (async () => {
      try {
        // Start watching position with updates every 10 seconds or 10 meters
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 10000, // Update every 10 seconds
            distanceInterval: 10, // Or when moved 10 meters
          },
          handleLocationUpdate,
        );
      } catch (error) {
        console.error('Error watching location:', error);
      }
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [enabled, radiusMeters, userLocation, quests, onLocationUpdate, onHiddenFound]);
}
