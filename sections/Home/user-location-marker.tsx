import React, { useEffect, useRef } from 'react';
import { Animated, Image, Platform, StyleSheet, View } from 'react-native';

interface UserLocationMarkerProps {
  avatarUrl?: string;
  size?: number;
}

const SIZES = {
  android: {
    container: 36,
    avatar: 30,
    centerDot: 4,
    pulseMax: 1.5,
  },
  ios: {
    container: 50,
    avatar: 44,
    centerDot: 6,
    pulseMax: 1.8,
  },
};

const ANIMATION_CONFIG = {
  duration: 2000,
  initialOpacity: 0.7,
};

export function UserLocationMarker({
  avatarUrl = 'https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg',
  size,
}: UserLocationMarkerProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(ANIMATION_CONFIG.initialOpacity)).current;

  const isAndroid = Platform.OS === 'android';
  const sizeConfig = isAndroid ? SIZES.android : SIZES.ios;
  const markerSize = size || sizeConfig.container;
  const avatarSize = isAndroid ? sizeConfig.avatar : markerSize - 6;
  const centerDotSize = sizeConfig.centerDot;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: sizeConfig.pulseMax,
            duration: ANIMATION_CONFIG.duration,
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
            duration: ANIMATION_CONFIG.duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: ANIMATION_CONFIG.initialOpacity,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulseAnim, opacityAnim, sizeConfig.pulseMax]);

  return (
    <View
      style={[
        styles.container,
        {
          width: markerSize,
          height: markerSize,
        },
      ]}
    >
      {/* Pulse Ring */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            width: markerSize,
            height: markerSize,
            borderRadius: markerSize / 2,
            transform: [{ scale: pulseAnim }],
            opacity: opacityAnim,
          },
        ]}
      />

      {/* Avatar Container */}
      <View
        style={[
          styles.avatarContainer,
          {
            width: markerSize,
            height: markerSize,
            borderRadius: markerSize / 2,
            borderWidth: isAndroid ? 2 : 3,
          },
        ]}
      >
        <Image
          source={{ uri: avatarUrl }}
          style={[
            styles.avatar,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}
          resizeMode="cover"
          accessible
          accessibilityLabel="User avatar"
        />
      </View>

      {/* Center Dot */}
      <View
        style={[
          styles.centerDot,
          {
            width: centerDotSize,
            height: centerDotSize,
            borderRadius: centerDotSize / 2,
            borderWidth: isAndroid ? 1 : 1.5,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    backgroundColor: '#FFD60A',
  },
  avatarContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderColor: '#FFD60A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD60A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  avatar: {
    backgroundColor: '#fff',
  },
  centerDot: {
    position: 'absolute',
    backgroundColor: '#FFD60A',
    borderColor: '#fff',
    shadowColor: '#FFD60A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 10,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: '#FFD60A',
  },
});
