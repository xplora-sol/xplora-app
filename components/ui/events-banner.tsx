import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Countdown } from './countdown';

export function EventsBanner({
  title,
  endIso,
  color,
  bannerImageSrc,
  onPress,
}: {
  title: string;
  endIso?: string;
  color?: string;
  bannerImageSrc?: any;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: color || '#fff' }]}
      onPress={onPress}
    >
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {endIso ? <Countdown endIso={endIso} /> : null}
      </View>
      <View style={styles.right}>
        {bannerImageSrc ? (
          <Image
            source={typeof bannerImageSrc === 'string' ? { uri: bannerImageSrc } : bannerImageSrc}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.cta}>View</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    borderWidth: 1,
  },
  left: {
    flexDirection: 'column',
  },
  title: {
    color: '#fff',
    fontWeight: '600',
  },
  cta: {
    color: '#fff',
    fontWeight: '700',
  },
  right: {},
  bannerImage: { width: 88, height: 56, borderRadius: 8 },
});
