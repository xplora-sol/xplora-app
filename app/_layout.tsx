import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { AppKit, AppKitProvider } from '@reown/appkit-react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { NotificationSettingsProvider } from '@/contexts/notification-settings-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ReactQueryProvider } from '@/lib/react-query';
import { appKit } from '@/utils/app-kit-config';
import { View } from 'react-native';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppKitProvider instance={appKit}>
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
            <View
              style={{ position: 'absolute', height: '100%', width: '100%' }}
              pointerEvents="box-none"
            >
              <AppKit />
            </View>
            <StatusBar style="auto" />
          </ThemeProvider>
        </NotificationSettingsProvider>
      </ReactQueryProvider>
    </AppKitProvider>
  );
}
