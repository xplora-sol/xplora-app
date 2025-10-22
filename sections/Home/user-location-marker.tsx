import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

interface UserLocationMarkerProps {
  avatarUrl?: string;
  size?: number;
}

export function UserLocationMarker({
  avatarUrl = "https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg",
  size = 50,
}: UserLocationMarkerProps) {
  // Simple pulse animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // Gentle pulse animation - single expanding ring
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.8,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [pulseAnim, opacityAnim]);

  return (
    <View style={[styles.container, { width: size * 2.5, height: size * 2.5 }]}>
      {/* Single pulse ring */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: pulseAnim }],
            opacity: opacityAnim,
          },
        ]}
      />

      {/* Avatar container */}
      <View
        style={[
          styles.avatarContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        {/* NFT Avatar */}
        <Image
          source={{ uri: avatarUrl }}
          style={[
            styles.avatar,
            {
              width: size - 6,
              height: size - 6,
              borderRadius: (size - 6) / 2,
            },
          ]}
          resizeMode="cover"
        />
      </View>

      {/* Center dot */}
      <View
        style={[
          styles.centerDot,
          {
            width: 6,
            height: 6,
            borderRadius: 3,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  pulseRing: {
    position: "absolute",
    backgroundColor: "#FFD60A",
    opacity: 0.4,
  },
  avatarContainer: {
    position: "absolute",
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#FFD60A",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FFD60A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  avatar: {
    backgroundColor: "#fff",
  },
  centerDot: {
    position: "absolute",
    backgroundColor: "#FFD60A",
    borderWidth: 1.5,
    borderColor: "#fff",
    shadowColor: "#FFD60A",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 10,
  },
});
