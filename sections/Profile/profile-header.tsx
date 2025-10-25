import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { StyleSheet, Text, View } from 'react-native';

interface ProfileHeaderProps {
  username?: string;
  level: number;
  avatar?: string;
}

export function ProfileHeader({
  username = 'Quest Explorer',
  level,
  avatar = '👤',
}: ProfileHeaderProps) {
  return (
    <ThemedView style={styles.header}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{avatar}</Text>
      </View>
      <ThemedText type="heading2">{username}</ThemedText>
      <ThemedText style={styles.subtitle}>Level {level} Adventurer</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    padding: 30,
    paddingTop: 60,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    fontSize: 48,
  },
  subtitle: {
    opacity: 0.7,
  },
});
