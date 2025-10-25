import { ThemedText } from '@/components/themed-text';
import { Platform, StyleSheet, View } from 'react-native';

interface TokenStatsOverlayProps {
  tokenBalance?: number;
  diamondBalance?: number;
}

export function TokenStatsOverlay({
  tokenBalance = 50000,
  diamondBalance = 10000,
}: TokenStatsOverlayProps) {
  return (
    <View style={styles.container}>
      {/* Token Balance */}
      <View style={styles.currencyBadge}>
        <ThemedText style={styles.icon}>🪙</ThemedText>
        <ThemedText style={styles.currencyText}>{tokenBalance.toLocaleString()}</ThemedText>
      </View>

      {/* Diamond Balance */}
      <View style={[styles.currencyBadge, styles.diamondBadge]}>
        <ThemedText style={styles.icon}>💎</ThemedText>
        <ThemedText style={styles.currencyText}>{diamondBalance.toLocaleString()}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  currencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 214, 10, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  diamondBadge: {
    backgroundColor: 'rgba(6, 255, 165, 0.95)',
  },
  icon: {
    fontSize: 14,
  },
  currencyText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1A1A2E',
    fontFamily: Platform.OS === 'ios' ? 'Menlo-Bold' : 'monospace',
    letterSpacing: 0.1,
  },
});
