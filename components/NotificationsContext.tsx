import React, { createContext, useState, useContext, ReactNode } from 'react';

interface NotificationsContextType {
  dailyReminderEnabled: boolean;
  setDailyReminderEnabled: (enabled: boolean) => void;
  dailyReminderTime: string;
  setDailyReminderTime: (time: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(false);
  const [dailyReminderTime, setDailyReminderTime] = useState('18:00');

  return (
    <NotificationsContext.Provider
      value={{
        dailyReminderEnabled,
        setDailyReminderEnabled,
        dailyReminderTime,
        setDailyReminderTime,
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