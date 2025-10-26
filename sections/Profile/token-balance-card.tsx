import { ThemedText } from '@/components/themed-text';
import { GameColors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

import { StyleSheet, Text, View } from 'react-native';

interface TokenBalanceCardProps {
  totalTokens: number;
}

export function TokenBalanceCard({ totalTokens }: TokenBalanceCardProps) {
  return (
    <LinearGradient
      colors={[GameColors.secondaryDark, GameColors.secondary]}
      start={[0, 0]}
      end={[1, 1]}
      style={styles.tokenCard}
    >
      <Text style={styles.tokenEmoji}>🪙</Text>
      <View style={styles.tokenInfo}>
        <ThemedText type="bodySmall" style={styles.tokenLabel}>
          Total Tokens Earned
        </ThemedText>
        <ThemedText type="largeNumber" style={styles.tokenAmount}>
          {totalTokens}
        </ThemedText>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  tokenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: GameColors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  tokenEmoji: {
    fontSize: 48,
    lineHeight: 56,
    marginRight: 16,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenLabel: {
    color: '#FFF',
    marginBottom: 4,
  },
  tokenAmount: {
    color: '#FFF',
  },
});
