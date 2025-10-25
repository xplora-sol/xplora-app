import * as Notifications from 'expo-notifications';

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions from the user
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/**
 * Schedule a local notification for a nearby quest
 */
export async function scheduleQuestNotification(
  questTitle: string,
  questReward: number,
  distance: number,
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🎯 Quest Nearby!',
      body: `${questTitle} is ${distance}m away. Reward: ${questReward} tokens!`,
      data: { questTitle, questReward, distance },
      sound: true,
    },
    trigger: null, // null means show immediately
  });
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Check if notification permissions are granted
 */
export async function hasNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}
