import { useNotificationSettings } from '@/contexts/notification-settings-context';
import { requestNotificationPermissions } from '@/utils/notifications';
import { useEffect } from 'react';

/**
 * Hook to request notification permissions when notifications are enabled
 */
export function useNotificationPermissions() {
  const { settings } = useNotificationSettings();

  useEffect(() => {
    if (settings.enabled) {
      requestNotificationPermissions();
    }
  }, [settings.enabled]);

  return settings;
}
