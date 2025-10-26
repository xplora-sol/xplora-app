import { LeaderboardScreen } from '@/components/ui/leaderboard-screen';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LeaderboardTab() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LeaderboardScreen />
    </SafeAreaView>
  );
}
