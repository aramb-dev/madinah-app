import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNotifications } from '@/components/NotificationsContext';
import { useTheme } from '@/components/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack } from 'expo-router';

export default function NotificationsScreen() {
  const {
    dailyReminderEnabled,
    setDailyReminderEnabled,
    dailyReminderTime,
    setDailyReminderTime,
  } = useNotifications();
  const { effectiveTheme } = useTheme();
  const [showTimePicker, setShowTimePicker] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: effectiveTheme === 'dark' ? '#000' : '#fff',
    },
    settingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    settingText: {
      fontSize: 18,
      color: effectiveTheme === 'dark' ? '#fff' : '#000',
    },
    timeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
      marginLeft: 20,
    },
    timeText: {
      fontSize: 16,
      color: effectiveTheme === 'dark' ? '#fff' : '#000',
    },
  });

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      setDailyReminderTime(`${hours}:${minutes}`);
    }
  };

  const showPicker = () => {
    setShowTimePicker(true);
  };

  const timeAsDate = new Date();
  const [hours, minutes] = dailyReminderTime.split(':');
  timeAsDate.setHours(parseInt(hours, 10));
  timeAsDate.setMinutes(parseInt(minutes, 10));

  return (
    <>
      <Stack.Screen options={{ title: 'Notifications' }} />
      <View style={styles.container}>
        <View style={styles.settingContainer}>
          <Text style={styles.settingText}>Daily Learning Reminder</Text>
          <Switch
            value={dailyReminderEnabled}
            onValueChange={setDailyReminderEnabled}
          />
        </View>
        {dailyReminderEnabled && (
          <View style={styles.timeContainer}>
            <Text style={styles.settingText}>Reminder Time</Text>
            <TouchableOpacity onPress={showPicker}>
              <Text style={styles.timeText}>{dailyReminderTime}</Text>
            </TouchableOpacity>
          </View>
        )}
        {showTimePicker && (
          <DateTimePicker
            value={timeAsDate}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
          />
        )}
      </View>
    </>
  );
}