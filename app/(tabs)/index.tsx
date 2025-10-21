import { ThemedText } from '@/components/themed-text';
import { useQuests, useQuestStatsQuery } from '@/hooks/query/use-quests';
import { useGeofencing } from '@/hooks/use-geofencing';
import { useLocationTracking } from '@/hooks/use-location-tracking';
import { useNotificationPermissions } from '@/hooks/use-notification-permissions';
import { QuestMarker } from '@/sections/Home/quest-marker';
import { StatCard } from '@/sections/Home/stat-card';
import type { Quest } from '@/types/quest';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const theme = useColorScheme();

  const { quests } = useQuests();
  const { activeQuests } = useQuestStatsQuery();
  const totalRewards = activeQuests.reduce((sum, q) => sum + q.reward, 0); const { userLocation: initialLocation, loading } = useLocationTracking();
  const [userLocation, setUserLocation] = useState(initialLocation);

  const notificationSettings = useNotificationPermissions();

  useGeofencing({
    enabled: notificationSettings.enabled,
    radiusMeters: notificationSettings.radiusMeters,
    userLocation,
    quests: quests as Quest[],
    onLocationUpdate: setUserLocation,
  });

  const [region, setRegion] = useState<Region>({
    latitude: userLocation?.latitude || 27.7172,
    longitude: userLocation?.longitude || 85.3240,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleMarkerPress = (questId: string) => {
    router.push({
      pathname: '/quest-details',
      params: { questId },
    });
  };

  const handleLocationPress = async () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    } else {
      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
        setUserLocation(coords);
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            ...coords,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }, 1000);
        }
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Could not get your current location');
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <ThemedText>Loading map...</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : top }]}>
      <MapView
        ref={mapRef}
        mapType='standard'
        userInterfaceStyle={theme === 'light' ? "light" : 'dark'}
        zoomEnabled={true}
        zoomTapEnabled={true}
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton={false}
        onRegionChangeComplete={setRegion}
      >
        {activeQuests.map((quest) => (
          <QuestMarker
            key={quest.id}
            id={quest.id}
            latitude={quest.location.latitude}
            longitude={quest.location.longitude}
            title={quest.title}
            difficulty={quest.difficulty as 'easy' | 'medium' | 'hard'}
            category={quest.category}
            reward={quest.reward}
            onPress={handleMarkerPress}
          />
        ))}
      </MapView>

      <View style={styles.statsContainer}>
        <StatCard
          label="Active Quests"
          value={activeQuests.length.toString()}
        />
        <StatCard
          label="Total Rewards"
          value={totalRewards.toString()}
        />
      </View>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={handleLocationPress}
        activeOpacity={0.8}
      >
        <Ionicons name="locate" size={24} color="#2196F3" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  statsContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  locationButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
