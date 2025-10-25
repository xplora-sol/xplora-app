import { ThemedText } from "@/components/themed-text";
import { GameColors } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, View } from "react-native";
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

const SIZES = {
  android: {
    container: 36,
    glow: 30,
    shadow: 28,
    inner: 24,
    icon: 16,
    innerGlow: 12,
    rewardMinWidth: 22,
    rewardFontSize: 10,
    rewardMarginTop: 2,
    innerGlowPosition: 4,
  },
  ios: {
    container: 50,
    glow: 50,
    shadow: 42,
    inner: 40,
    icon: 20,
    innerGlow: 20,
    rewardMinWidth: 28,
    rewardFontSize: 12,
    rewardMarginTop: 4,
    innerGlowPosition: 5,
  },
};

const ANIMATION_CONFIG = {
  pulse: { min: 1, max: 1.15, duration: 1000 },
  glow: { min: 0.3, max: 0.7, duration: 1500 },
};

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
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: ANIMATION_CONFIG.pulse.max,
          duration: ANIMATION_CONFIG.pulse.duration,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: ANIMATION_CONFIG.pulse.min,
          duration: ANIMATION_CONFIG.pulse.duration,
          useNativeDriver: true,
        }),
      ])
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: ANIMATION_CONFIG.glow.duration,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: ANIMATION_CONFIG.glow.duration,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();
    glowAnimation.start();

    return () => {
      pulseAnimation.stop();
      glowAnimation.stop();
    };
  }, [pulseAnim, glowAnim]);

  const isAndroid = Platform.OS === "android";
  const size = isAndroid ? SIZES.android : SIZES.ios;

  const getDifficultyColor = (): string => {
    const colors = {
      easy: GameColors.easy,
      medium: GameColors.medium,
      hard: GameColors.hard,
    };
    return colors[difficulty] || GameColors.info;
  };

  const getDifficultyGradient = (): readonly [string, string] => {
    const gradients = {
      easy: [GameColors.easy, GameColors.education] as const,
      medium: [GameColors.medium, GameColors.food] as const,
      hard: [GameColors.hard, GameColors.community] as const,
    } as const;
    return gradients[difficulty] ?? ([GameColors.info, GameColors.secondary] as const);
  };

  const getCategoryIcon = () => {
    const iconProps = { size: size.icon, color: "#fff" };
    const icons = {
      social: <Ionicons name="people" {...iconProps} />,
      fitness: <Ionicons name="fitness" {...iconProps} />,
      exploration: <Ionicons name="map" {...iconProps} />,
      education: <Ionicons name="school" {...iconProps} />,
      food: <Ionicons name="restaurant" {...iconProps} />,
      community: <MaterialCommunityIcons name="handshake" {...iconProps} />,
    };
    return icons[category as keyof typeof icons] || <Ionicons name="star" {...iconProps} />;
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [ANIMATION_CONFIG.glow.min, ANIMATION_CONFIG.glow.max],
  });

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      onPress={() => onPress(id)}
      title={title}
      description={`${category} • ${reward} tokens`}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View
        style={[
          styles.markerContainer,
          {
            width: size.container,
            height: isAndroid ? size.container : size.container + 20,
          },
        ]}
      >
        {/* Animated Glow Effect */}
        <Animated.View
          style={[
            styles.glowOuter,
            {
              opacity: glowOpacity,
              transform: [{ scale: pulseAnim }],
              backgroundColor: getDifficultyColor(),
              width: size.glow,
              height: size.glow,
              borderRadius: size.glow / 2,
            },
          ]}
        />

        {/* Main Marker Body */}
        <View
          style={[
            styles.markerShadow,
            {
              width: size.shadow,
              height: size.shadow,
              borderRadius: size.shadow / 2,
            },
          ]}
        >
          <LinearGradient
            colors={getDifficultyGradient()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.markerInner,
              {
                width: size.inner,
                height: size.inner,
                borderRadius: size.inner / 2,
              },
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  width: size.inner - 6,
                  height: size.inner - 6,
                  borderRadius: (size.inner - 6) / 2,
                },
              ]}
            >
              {getCategoryIcon()}
            </View>
            
            {/* Inner Glow Highlight */}
            <View
              style={[
                styles.innerGlow,
                {
                  width: size.innerGlow,
                  height: size.innerGlow,
                  borderRadius: size.innerGlow / 2,
                  top: size.innerGlowPosition,
                  right: size.innerGlowPosition,
                },
              ]}
            />
          </LinearGradient>
        </View>

        {/* Reward Badge (iOS only) */}
        {!isAndroid && (
          <LinearGradient
            colors={[GameColors.accent, GameColors.accentDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.rewardBadge,
              {
                marginTop: size.rewardMarginTop,
                minWidth: size.rewardMinWidth,
              },
            ]}
          >
            <ThemedText
              type="tiny"
              style={[styles.rewardText, { fontSize: size.rewardFontSize }]}
            >
              {reward}
            </ThemedText>
          </LinearGradient>
        )}
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  glowOuter: {
    position: "absolute",
  },
  markerShadow: {
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
    borderWidth: 3,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  innerGlow: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  rewardBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  rewardText: {
    color: "#1A1A2E",
    fontWeight: "bold",
  },
});