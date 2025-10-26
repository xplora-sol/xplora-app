import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GameColors } from '@/constants/theme';
import { getProfileImageForKey } from '@/utils/profile-images';
import { LinearGradient } from 'expo-linear-gradient';

import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

interface ProfileHeaderProps {
  username?: string;
  level: number;
  avatar?: ImageSourcePropType | string;
}

export function ProfileHeader({ username = 'Quest Explorer', level, avatar }: ProfileHeaderProps) {
  // If avatar is provided as an object (require result) use it, otherwise fall back to deterministic image by username
  const providedIsText = typeof avatar === 'string' && avatar.length > 0 && avatar.length <= 4; // likely emoji or short text
  const avatarSource: ImageSourcePropType =
    !avatar || providedIsText ? getProfileImageForKey(username) : (avatar as ImageSourcePropType);

  return (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerContent}>
        <LinearGradient
          colors={[GameColors.secondary, GameColors.accent]}
          style={styles.avatarGradient}
          start={[0, 0]}
          end={[1, 1]}
        >
          <View style={styles.avatarContainer}>
            {providedIsText ? (
              <Text style={styles.avatar}>{(avatar as string) || '👤'}</Text>
            ) : (
              <Image source={avatarSource} style={styles.avatarImage} resizeMode="cover" />
            )}
          </View>
        </LinearGradient>

        <ThemedText type="heading2">{username}</ThemedText>
        <ThemedText style={styles.subtitle}>Level {level} Adventurer</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 40,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarGradient: {
    padding: 6,
    borderRadius: 60,
    marginBottom: 8,
  },
  avatar: {
    fontSize: 48,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  subtitle: {
    opacity: 0.7,
  },
});
