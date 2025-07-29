import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Helper function to calculate seconds until next occurrence of specified time
const getSecondsUntilTime = (hours: number, minutes: number): number => {
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);
  
  // If target time has passed today, schedule for tomorrow
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  
  return Math.floor((target.getTime() - now.getTime()) / 1000);
};

interface NotificationsContextType {
  dailyReminderEnabled: boolean;
  setDailyReminderEnabled: (enabled: boolean) => void;
  dailyReminderTime: string;
  setDailyReminderTime: (time: string) => void;
  permissionStatus: string;
  requestPermissions: () => Promise<boolean>;
}

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(false);
  const [dailyReminderTime, setDailyReminderTime] = useState('18:00');
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const [notificationId, setNotificationId] = useState<string | null>(null);

  // Request notification permissions
  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      setPermissionStatus(finalStatus);
      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      setPermissionStatus('denied');
      return false;
    }
  };

  // Schedule daily notification
  const scheduleDailyNotification = async (time: string) => {
    try {
      // Cancel existing notification if any
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }

      const [hours, minutes] = time.split(':').map(Number);

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Daily Learning Reminder 📚',
          body: 'Time for your Arabic learning session! Keep up the great progress.',
          sound: true,
        },
        trigger: {
          seconds: getSecondsUntilTime(hours, minutes),
          repeats: true,
        },
      });

      setNotificationId(id);
      console.log('Scheduled daily notification:', id);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  // Cancel daily notification
  const cancelDailyNotification = async () => {
    try {
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        setNotificationId(null);
        console.log('Cancelled daily notification');
      }
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  };

  // Enhanced setDailyReminderEnabled with notification logic
  const handleSetDailyReminderEnabled = async (enabled: boolean) => {
    if (enabled) {
      const hasPermission = await requestPermissions();
      if (hasPermission) {
        setDailyReminderEnabled(true);
        await scheduleDailyNotification(dailyReminderTime);
      } else {
        console.log('Notification permission denied');
        // Still allow the toggle but show a warning
        setDailyReminderEnabled(false);
      }
    } else {
      setDailyReminderEnabled(false);
      await cancelDailyNotification();
    }
  };

  // Enhanced setDailyReminderTime with rescheduling
  const handleSetDailyReminderTime = async (time: string) => {
    setDailyReminderTime(time);
    if (dailyReminderEnabled) {
      await scheduleDailyNotification(time);
    }
  };

  // Check permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status);
    };
    checkPermissions();
  }, []);

  // Handle notification responses
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      // Handle notification tap - could navigate to a specific screen
    });

    return () => subscription.remove();
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        dailyReminderEnabled,
        setDailyReminderEnabled: handleSetDailyReminderEnabled,
        dailyReminderTime,
        setDailyReminderTime: handleSetDailyReminderTime,
        permissionStatus,
        requestPermissions,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};