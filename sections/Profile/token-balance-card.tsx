import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { StyleSheet, Text, View } from 'react-native';

interface TokenBalanceCardProps {
  totalTokens: number;
}

export function TokenBalanceCard({ totalTokens }: TokenBalanceCardProps) {
  return (
    <ThemedView style={styles.tokenCard}>
      <Text style={styles.tokenEmoji}>🪙</Text>
      <View style={styles.tokenInfo}>
        <ThemedText type="bodySmall" style={styles.tokenLabel}>
          Total Tokens Earned
        </ThemedText>
        <ThemedText type="largeNumber" style={styles.tokenAmount}>
          {totalTokens}
        </ThemedText>
      </View>
    </ThemedView>
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
    backgroundColor: '#FFF3E0',
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
    color: '#F57C00',
    marginBottom: 4,
  },
  tokenAmount: {
    color: '#F57C00',
  },
});
