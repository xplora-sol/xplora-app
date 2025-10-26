import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { GameColors } from '@/constants/theme';
import { useAuth } from '@/hooks/query/use-auth';

export default function TabLayout() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (isAuthenticated && !hasCompletedOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: GameColors.secondary,
        tabBarInactiveTintColor: 'rgba(139, 149, 165, 0.4)',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(10, 15, 30, 0.98)',
          borderTopWidth: 0,
          borderRadius: 30,
          marginHorizontal: 16,
          marginBottom: Platform.OS === 'ios' ? 30 : 20,
          height: 80,
          paddingBottom: Platform.OS === 'ios' ? 12 : 12,
          paddingTop: 12,
          shadowColor: GameColors.secondary,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.4,
          shadowRadius: 25,
          elevation: 30,
          borderWidth: 2,
          borderColor: 'rgba(0, 245, 255, 0.25)',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '900',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          fontFamily: Platform.OS === 'ios' ? 'Menlo-Bold' : 'monospace',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <View>
              <Ionicons name={focused ? 'compass' : 'compass-outline'} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Quests',
          tabBarIcon: ({ color, focused }) => (
            <View>
              <Ionicons name={focused ? 'trophy' : 'trophy-outline'} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color, focused }) => (
            <View>
              <Ionicons name={focused ? 'people' : 'people-outline'} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, focused }) => (
            <View>
              <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
