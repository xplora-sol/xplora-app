import { ThemedText } from "@/components/themed-text";
import { GameColors } from "@/constants/theme";
import { useQuests, useQuestStatsQuery } from "@/hooks/query/use-quests";
import { useGeofencing } from "@/hooks/use-geofencing";
import { useLocationTracking } from "@/hooks/use-location-tracking";
import { useNotificationPermissions } from "@/hooks/use-notification-permissions";
import { QuestMarker } from "@/sections/Home/quest-marker";
import { TokenStatsOverlay } from "@/sections/Home/token-stats-overlay";
import { UserLocationMarker } from "@/sections/Home/user-location-marker";
import { UserStatsOverlay } from "@/sections/Home/user-stats-overlay";
import type { Quest } from "@/types/quest";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Circle, Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Custom dark map style
const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#1a1a2e" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a8a8a" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1a1a2e" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#00f5ff", weight: 0.5, visibility: "on" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#16213e" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b6b6b" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2c3e50" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1a1a2e" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#34495e" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0f3460" }],
  },
];

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  const { quests } = useQuests();
  const { activeQuests } = useQuestStatsQuery();
  const { userLocation: initialLocation, loading } = useLocationTracking();
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
    longitude: userLocation?.longitude || 85.324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleMarkerPress = (questId: string) => {
    router.push({
      pathname: "/quest-details",
      params: { questId },
    });
  };

  const handleLocationPress = async () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...userLocation,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      );
    } else {
      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
        setUserLocation(coords);
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              ...coords,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            },
            1000
          );
        }
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert("Error", "Could not get your current location");
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GameColors.secondary} />
        <ThemedText style={{ color: GameColors.secondary, marginTop: 12 }}>
          Loading map...
        </ThemedText>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Platform.OS === "ios" ? 0 : top },
      ]}
    >
      <MapView
        ref={mapRef}
        mapType="standard"
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        customMapStyle={darkMapStyle}
        userInterfaceStyle="dark"
        zoomEnabled={true}
        zoomTapEnabled={true}
        style={styles.map}
        region={region}
        showsUserLocation={false}
        showsMyLocationButton={false}
        onRegionChangeComplete={setRegion}
      >
        {/* User location with custom NFT avatar marker */}
        {userLocation && (
          <>
            <Marker
              coordinate={userLocation}
              anchor={{ x: 0.5, y: 0.5 }}
              flat
              tracksViewChanges={false}
            >
              <UserLocationMarker size={Platform.OS ==="android" ? 36 : 50} />
            </Marker>

            {/* Geofencing radius circles */}
            {/* Outer glow circle */}
            <Circle
              center={userLocation}
              radius={notificationSettings.radiusMeters * 1.2}
              fillColor="rgba(0, 245, 255, 0.05)"
              strokeColor="rgba(0, 245, 255, 0.2)"
              strokeWidth={1}
            />
            {/* Main radius circle */}
            <Circle
              center={userLocation}
              radius={notificationSettings.radiusMeters}
              fillColor="rgba(6, 255, 165, 0.1)"
              strokeColor={GameColors.secondary}
              strokeWidth={2}
            />
            {/* Inner circle */}
            <Circle
              center={userLocation}
              radius={notificationSettings.radiusMeters * 0.5}
              fillColor="rgba(6, 255, 165, 0.15)"
              strokeColor={GameColors.easy}
              strokeWidth={1}
            />
          </>
        )}

        {activeQuests.map((quest) => (
          <QuestMarker
            key={quest.id}
            id={quest.id}
            latitude={quest.location.latitude}
            longitude={quest.location.longitude}
            title={quest.title}
            difficulty={quest.difficulty as "easy" | "medium" | "hard"}
            category={quest.category}
            reward={quest.reward}
            onPress={handleMarkerPress}
          />
        ))}
      </MapView>

      {/* Top Overlay Container */}
      <View style={styles.topOverlayContainer} pointerEvents="box-none">
        {/* Left - User Stats */}
        <View style={styles.topLeftOverlay}>
          <UserStatsOverlay level={5} keyCount={3} />
        </View>

        {/* Right - Currency */}
        <View style={styles.topRightOverlay}>
          <TokenStatsOverlay tokenBalance={50000} diamondBalance={10000} />
        </View>
      </View>

      {/* Location Button - simple, no animation */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={handleLocationPress}
        activeOpacity={0.7}
      >
        <Ionicons name="locate" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Bottom gradient for tab bar blend */}
      <View style={styles.bottomGradient} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
   ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: "#0F0F23",
  },
  map: {

   ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F0F23",
  },
  topOverlayContainer: {
    position: "absolute",
    top: 55,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  topLeftOverlay: {
    flex: 1,
    maxWidth: "58%",
  },
  topRightOverlay: {
    flexShrink: 1,
    maxWidth: "38%",
  },
  locationButton: {
    position: "absolute",
    bottom: 100,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1A1A2E",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "transparent",
  },
});
