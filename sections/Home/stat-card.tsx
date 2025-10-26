import { ThemedText } from '@/components/themed-text';
import { GameColors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

import { StyleSheet, View } from 'react-native';

interface StatCardProps {
  label: string;
  value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={['rgba(255, 107, 53, 0.2)', 'rgba(230, 57, 70, 0.1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.glowEffect} />
        <ThemedText type="caption" style={styles.label}>
          {label}
        </ThemedText>
        <ThemedText type="subtitle" style={styles.value}>
          {value}
        </ThemedText>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    shadowColor: GameColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 53, 0.3)',
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    overflow: 'hidden',
  },
  glowEffect: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: GameColors.primary,
    opacity: 0.1,
    shadowColor: GameColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  label: {
    opacity: 0.9,
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  value: {
    marginTop: 6,
    fontWeight: 'bold',
    fontSize: 24,
    color: '#FFFFFF',
    textShadowColor: GameColors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});
