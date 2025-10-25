import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useNotificationSettings } from '@/contexts/notification-settings-context';
import { requestNotificationPermissions } from '@/utils/notifications';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

export function NotificationSettingsCard() {
  const { settings, updateSettings } = useNotificationSettings();
  const [isChanging, setIsChanging] = useState(false);

  const radiusOptions = [
    { value: 25, label: '25m' },
    { value: 50, label: '50m' },
    { value: 100, label: '100m' },
    { value: 200, label: '200m' },
    { value: 500, label: '500m' },
  ];

  const handleToggleNotifications = async (value: boolean) => {
    if (value) {
      // Request permissions when enabling
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive quest alerts.',
        );
        return;
      }
    }
    await updateSettings({ enabled: value });
  };

  const handleRadiusChange = async (newRadius: number) => {
    setIsChanging(true);
    await updateSettings({ radiusMeters: newRadius });
    setIsChanging(false);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="notifications-outline" size={24} color="#2196F3" />
          <ThemedText type="heading4">Quest Notifications</ThemedText>
        </View>
        <Switch
          value={settings.enabled}
          onValueChange={handleToggleNotifications}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={settings.enabled ? '#2196F3' : '#f4f3f4'}
        />
      </View>

      <ThemedText type="bodySmall" style={styles.description}>
        Get notified when you&apos;re near an active quest
      </ThemedText>

      {settings.enabled && (
        <View style={styles.radiusSection}>
          <ThemedText type="bodySmall" style={styles.sectionLabel}>
            Alert Distance
          </ThemedText>
          <View style={styles.radiusOptions}>
            {radiusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.radiusButton,
                  settings.radiusMeters === option.value && styles.radiusButtonActive,
                ]}
                onPress={() => handleRadiusChange(option.value)}
                disabled={isChanging}
              >
                <ThemedText
                  type="bodySmall"
                  style={[
                    styles.radiusButtonText,
                    settings.radiusMeters === option.value && styles.radiusButtonTextActive,
                  ]}
                >
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          <ThemedText type="caption" style={styles.radiusHint}>
            You&apos;ll be notified when within {settings.radiusMeters}m of a quest
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  description: {
    opacity: 0.7,
    marginBottom: 16,
  },
  radiusSection: {
    marginTop: 8,
  },
  sectionLabel: {
    fontWeight: '600',
    marginBottom: 12,
  },
  radiusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radiusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'transparent',
  },
  radiusButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  radiusButtonText: {
    fontWeight: '500',
  },
  radiusButtonTextActive: {
    color: '#fff',
  },
  radiusHint: {
    opacity: 0.6,
    marginTop: 12,
    fontStyle: 'italic',
  },
});
