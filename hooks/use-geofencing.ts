import type { Quest } from '@/types/quest';
import { findNearbyQuests } from '@/utils/geofencing';
import { scheduleQuestNotification } from '@/utils/notifications';
import * as Location from 'expo-location';
import { useEffect, useRef } from 'react';

interface UseGeofencingOptions {
  enabled: boolean;
  radiusMeters: number;
  userLocation: { latitude: number; longitude: number } | null;
  quests: Quest[];
  onLocationUpdate?: (coords: { latitude: number; longitude: number }) => void;
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
}: UseGeofencingOptions) {
  // Track which quests we've already notified about using ref to avoid re-renders
  const notifiedQuestIdsRef = useRef<Set<string>>(new Set());

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
        radiusMeters
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
          handleLocationUpdate
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
  }, [enabled, radiusMeters, userLocation, quests, onLocationUpdate]);
}
