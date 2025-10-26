import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function FloatingCircleButton({
  onPress,
  label,
  size = 56,
  badge,
  imageSrc,
}: {
  onPress?: () => void;
  label?: string;
  size?: number;
  badge?: string | number;
  imageSrc?: ImageSourcePropType | number;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}
      activeOpacity={0.8}
    >
      {imageSrc ? (
        <Image
          source={imageSrc}
          width={64}
          height={64}
          style={{ width: '100%', height: '100%', resizeMode: 'contain', borderRadius: 999 }}
        />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  label: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
