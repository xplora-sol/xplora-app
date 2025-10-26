import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { useAuth } from '@/hooks/query/use-auth';
import { router } from 'expo-router';

export function DevLogin() {
  const { login } = useAuth();
  const handleReset = () => {
    login({ walletAddress: '0xTEST', username: 'DEVELOPER' });
    router.replace("/(auth)/onboarding")
  };

  // Only show in development mode
  if (!__DEV__) return null;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="defaultSemiBold" style={styles.title}>
        Dev Tools
      </ThemedText>
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          Dev Login
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderStyle: 'dashed',
  },
  title: {
    marginBottom: 12,
    color: '#FF6B6B',
  },
  button: {
    backgroundColor: '#FF6B6B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
});
