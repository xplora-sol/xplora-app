import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface UseLocationTrackingReturn {
  userLocation: LocationCoords | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to request location permissions and get initial user location
 */
export function useLocationTracking(): UseLocationTrackingReturn {
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Please enable location permissions to use the map.');
          setLoading(false);
          setError('Location permission denied');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        if (isMounted) {
          const coords = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          };
          setUserLocation(coords);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error getting location:', err);
        if (isMounted) {
          setError('Failed to get location');
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return { userLocation, loading, error };
}
