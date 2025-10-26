import { DevTools } from '@/components/dev-tools';
import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GameColors } from '@/constants/theme';
import { useAuth } from '@/hooks/query/use-auth';
import { useQuestStatsQuery, useQuests } from '@/hooks/query/use-quests';
import { AchievementCard } from '@/sections/Profile/achievement-card';
import { NotificationSettingsCard } from '@/sections/Profile/notification-settings-card';
import { ProfileHeader } from '@/sections/Profile/profile-header';
import { ProfileStatsGrid } from '@/sections/Profile/profile-stats-grid';
import { TokenBalanceCard } from '@/sections/Profile/token-balance-card';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppKitButton, useAppKit } from '@reown/appkit-react-native';

export default function ProfileScreen() {
  const router = useRouter();

  const { user, logout } = useAuth();
  const { activeQuests, completedQuests, totalQuests, completionRate, totalTokens, level } =
    useQuestStatsQuery();
  const { achievements } = useQuests();
  const { disconnect } = useAppKit();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout, this will disconnect your wallet as well?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
            disconnect();
          },
        },
      ],
    );
  };

  // category stats available from hooks if needed

  const profileStats = [
    { value: completedQuests.length, label: 'Completed' },
    { value: activeQuests.length, label: 'Active' },
    { value: totalQuests, label: 'Total Quests' },
    { value: `${completionRate}%`, label: 'Success Rate' },
  ];

  // categoryList available for future CategoryProgress rendering

  return (
    <ThemedScrollView style={styles.container}>
      <ProfileHeader username={user?.username || 'Quest Explorer'} level={level} />

      <AppKitButton />

      <TokenBalanceCard totalTokens={totalTokens} />

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Statistics
        </ThemedText>
        <ProfileStatsGrid stats={profileStats} />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Settings
        </ThemedText>
        <NotificationSettingsCard />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Achievements
        </ThemedText>
        <View style={styles.achievementsList}>
          {achievements.map((achievement, index) => (
            <AchievementCard key={index} achievement={achievement} />
          ))}
        </View>
      </ThemedView>

      {/* <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Category Progress
        </ThemedText>
        <View style={styles.categoryList}>
          {categoryList.map((categoryStat, index) => (
            <CategoryProgressCard key={index} categoryStat={categoryStat} />
          ))}
        </View>
      </ThemedView> */}

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Profile Information
        </ThemedText>
        <ThemedView style={styles.infoCard}>
          <ThemedText style={styles.infoLabel}>Member Since</ThemedText>
          <ThemedText style={styles.infoValue}>
            {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.infoCard}>
          <ThemedText style={styles.infoLabel}>Username</ThemedText>
          <ThemedText style={styles.infoValue}>@{user?.username || 'questexplorer'}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.infoCard}>
          <ThemedText style={styles.infoLabel}>Wallet Address</ThemedText>
          <ThemedText style={styles.infoValue} numberOfLines={1}>
            {user?.walletAddress?.substring(0, 10)}...
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <LinearGradient
          colors={[GameColors.primaryDark, GameColors.primary]}
          start={[0, 0]}
          end={[1, 0]}
          style={styles.logoutGradient}
        >
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <ThemedText style={styles.logoutText}>Logout</ThemedText>
          </TouchableOpacity>
        </LinearGradient>
      </ThemedView>

      {/* Dev Tools - Only visible in development */}
      <DevTools />

      <View style={styles.bottomPadding} />
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  achievementsList: {
    gap: 12,
  },
  categoryList: {
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  logoutGradient: {
    borderRadius: 12,
    marginHorizontal: 6,
    overflow: 'hidden',
    shadowColor: GameColors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  bottomPadding: {
    height: 40,
  },
});
