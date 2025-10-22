import { ThemedText } from "@/components/themed-text";
import { GameColors } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";

interface QuestMarkerProps {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  reward: number;
  onPress: (id: string) => void;
}

export function QuestMarker({
  id,
  latitude,
  longitude,
  title,
  difficulty,
  category,
  reward,
  onPress,
}: QuestMarkerProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy":
        return GameColors.easy;
      case "medium":
        return GameColors.medium;
      case "hard":
        return GameColors.hard;
      default:
        return GameColors.info;
    }
  };

  const getDifficultyGradient = (): [string, string] => {
    switch (difficulty) {
      case "easy":
        return [GameColors.easy, GameColors.education];
      case "medium":
        return [GameColors.medium, GameColors.food];
      case "hard":
        return [GameColors.hard, GameColors.community];
      default:
        return [GameColors.info, GameColors.secondary];
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case "social":
        return <Ionicons name="people" size={20} color="#fff" />;
      case "fitness":
        return <Ionicons name="fitness" size={20} color="#fff" />;
      case "exploration":
        return <Ionicons name="map" size={20} color="#fff" />;
      case "education":
        return <Ionicons name="school" size={20} color="#fff" />;
      case "food":
        return <Ionicons name="restaurant" size={20} color="#fff" />;
      case "community":
        return (
          <MaterialCommunityIcons name="handshake" size={20} color="#fff" />
        );
      default:
        return <Ionicons name="star" size={20} color="#fff" />;
    }
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      onPress={() => onPress(id)}
      title={title}
      description={`${category} • ${reward} tokens`}
    >
      <View style={styles.markerContainer}>
        {/* Animated glow effect */}
        <Animated.View
          style={[
            styles.glowOuter,
            {
              opacity: glowOpacity,
              transform: [{ scale: pulseAnim }],
              backgroundColor: getDifficultyColor(),
            },
          ]}
        />

        {/* Marker with gradient */}
        <View style={styles.markerShadow}>
          <LinearGradient
            colors={getDifficultyGradient()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.markerInner]}
          >
            <View style={styles.iconContainer}>{getCategoryIcon()}</View>
            <View style={styles.innerGlow} />
          </LinearGradient>
        </View>

        {/* Enhanced reward badge */}
        <LinearGradient
          colors={[GameColors.accent, GameColors.accentDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.rewardBadge}
        >
          <ThemedText type="tiny" style={styles.rewardText}>
            {reward}
          </ThemedText>
        </LinearGradient>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 70,
  },
  glowOuter: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    top: 0,
  },
  markerShadow: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  markerInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  innerGlow: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    top: 5,
    right: 5,
  },
  rewardBadge: {
    marginTop: 4,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: "#fff",
    minWidth: 28,
    alignItems: "center",
    shadowColor: GameColors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  rewardText: {
    color: "#1A1A2E",
    fontWeight: "bold",
    fontSize: 12,
  },
});
