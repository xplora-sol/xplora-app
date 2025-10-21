import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { NotificationSettingsProvider } from '@/contexts/notification-settings-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ReactQueryProvider } from '@/lib/react-query';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ReactQueryProvider>
      <NotificationSettingsProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen
              name="quest-details"
              options={{
                presentation: 'modal',
                headerShown: false,
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </NotificationSettingsProvider>
    </ReactQueryProvider>
  );
}
