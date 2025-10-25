import { useQuests } from '@/hooks/query/use-quests';

import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export function DevTools() {
  const { resetProgress } = useQuests();

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This will reset all quests, tokens, and achievements.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetProgress();
            Alert.alert('Success', 'Progress has been reset!');
          },
        },
      ],
    );
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
          Reset Progress
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
