import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={[styles.container, { borderColor: color || 'transparent' }]}>
        <View style={styles.content}>
          <View style={styles.left}>
            <Text style={styles.title}>{title}</Text>
            {endIso ? <Countdown endIso={endIso} /> : null}
          </View>

          {/* Square banner thumbnail on the right for square images */}
          <View style={styles.right}>
            {bannerImageSrc ? (
              <Image
                source={
                  typeof bannerImageSrc === 'string'
                    ? { uri: bannerImageSrc }
                    : (bannerImageSrc as ImageSourcePropType)
                }
                style={styles.bannerImageSquare}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.ctaBadge}>
                <Text style={styles.cta}>View</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 112,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    marginVertical: 8,
    backgroundColor: '#00000022',
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
  bannerImageSquare: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: '#00000022',
  },
});
