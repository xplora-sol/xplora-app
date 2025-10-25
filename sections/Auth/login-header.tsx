import { ThemedText } from '@/components/themed-text';

import { StyleSheet, View, Image } from 'react-native';

interface LoginHeaderProps {
  appName?: string;
  tagline?: string;
}

export function LoginHeader({
  appName = 'Xplora',
  tagline = 'Discover, Explore, and Earn Rewards',
}: LoginHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.logoCircle, { backgroundColor: '#2196F3' }]}>
        <Image
          source={require('../../assets/images/app-logo.png')}
          width={64}
          height={64}
          style={{
            flex: 1,
          }}
        />
      </View>
      <ThemedText type="title" style={styles.appName}>
        {appName}
      </ThemedText>
      <ThemedText style={styles.tagline}>{tagline}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    marginBottom: 8,
  },
  tagline: {
    opacity: 0.7,
    textAlign: 'center',
  },
});
