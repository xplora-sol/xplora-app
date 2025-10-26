import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

interface LoginFormProps {
  username: string;
  onUsernameChange: (text: string) => void;
  onConnectPress: () => void;
  isConnecting: boolean;
}

export function LoginForm({
  username,
  onUsernameChange,
  onConnectPress,
  isConnecting,
}: LoginFormProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <ThemedText type="defaultSemiBold" style={styles.label}>
        Username
      </ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
            color: isDark ? '#fff' : '#000',
            borderColor: isDark ? '#333' : '#ddd',
          },
        ]}
        placeholder="Enter your username"
        placeholderTextColor={isDark ? '#666' : '#999'}
        value={username}
        onChangeText={onUsernameChange}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isConnecting}
      />

      <TouchableOpacity
        style={[styles.metamaskButton, isConnecting && styles.buttonDisabled]}
        onPress={onConnectPress}
        disabled={isConnecting}
        activeOpacity={0.8}
      >
        {isConnecting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="wallet" size={24} color="#fff" />
            <ThemedText type="heading4" style={styles.buttonText}>
              Connect your wallet
            </ThemedText>
          </>
        )}
      </TouchableOpacity>

      <ThemedText type="bodySmall" style={styles.helperText}>
        New users will be automatically registered
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  metamaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    height: 56,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
  },
  helperText: {
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 12,
  },
});
