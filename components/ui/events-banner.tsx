import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ImageSourcePropType } from 'react-native';
import { Countdown } from './countdown';
import { LinearGradient } from 'expo-linear-gradient';

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
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={[styles.container, { borderColor: color || 'transparent' }]}> 
        {/* Backdrop image */}
        {bannerImageSrc ? (
          <Image
            source={typeof bannerImageSrc === 'string' ? { uri: bannerImageSrc } : (bannerImageSrc as ImageSourcePropType)}
            style={styles.backdrop}
            resizeMode="cover"
          />
        ) : null}

        {/* Gradient overlay for dramatic/gamey look */}
        <LinearGradient
          colors={[color ? `${color}CC` : 'rgba(0,0,0,0.45)', 'rgba(0,0,0,0.15)']}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.content}>
          <View style={styles.left}>
            <Text style={styles.title}>{title}</Text>
            {endIso ? <Countdown endIso={endIso} /> : null}
          </View>
          <View style={styles.right}>
            {bannerImageSrc ? (
              <View style={styles.ctaBadge}>
                <Text style={styles.cta}>View</Text>
              </View>
            ) : (
              <Text style={styles.cta}>View</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 92,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    marginVertical: 8,
    backgroundColor: '#00000022',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  left: {
    flexDirection: 'column',
    zIndex: 2,
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  cta: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  right: { zIndex: 2 },
  ctaBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bannerImage: { width: 88, height: 56, borderRadius: 8 },
});