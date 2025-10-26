import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export function QuestBadge({
  label,
  rarity,
  multiplier,
  isLimited,
}: {
  label?: string;
  rarity?: Rarity;
  multiplier?: number;
  isLimited?: boolean;
}) {
  const color =
    rarity === 'legendary'
      ? '#ffb86b'
      : rarity === 'epic'
      ? '#9b59b6'
      : rarity === 'rare'
      ? '#3498db'
      : '#95a5a6';

  return (
    <View style={[styles.container, { borderColor: color }]}>
      {label ? <Text style={[styles.text, { color }]}>{label}</Text> : null}
      {multiplier && multiplier > 1 ? (
        <Text style={[styles.multiplier, { color }]}>x{multiplier}</Text>
      ) : null}
      {isLimited ? <Text style={styles.limited}>Limited</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontSize: 12,
    marginRight: 6,
  },
  multiplier: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
  },
  limited: {
    fontSize: 11,
    color: '#e74c3c',
  },
});
