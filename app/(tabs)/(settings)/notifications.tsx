import React, { useState } from 'react';
import { View, Switch, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Text } from '../../../components/Themed';
import { useNotifications } from '@/components/NotificationsContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useColorScheme } from '@/components/useColorScheme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';

// Platform-specific colors for consistency
const getBackgroundColors = (isDark: boolean) => ({
  primary: isDark ? '#1c1c1e' : '#f2f2f7',
  secondary: isDark ? '#2c2c2e' : '#ffffff',
  border: isDark ? '#38383a' : '#c6c6c8',
  text: isDark ? '#ffffff' : '#000000',
  secondaryText: isDark ? '#8e8e93' : '#6d6d70',
  accent: '#007AFF',
});

export default function NotificationsScreen() {
  const {
    dailyReminderEnabled,
    setDailyReminderEnabled,
    dailyReminderTime,
    setDailyReminderTime,
    permissionStatus,
    requestPermissions,
  } = useNotifications();
  const { fontSize } = useSettings();
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showInlineTimePicker, setShowInlineTimePicker] = useState(false);

  // Use platform-appropriate colors
  const platformColors = getBackgroundColors(colorScheme === 'dark');

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      setDailyReminderTime(`${hours}:${minutes}`);
    }
  };

  const showPicker = () => {
    if (Platform.OS === 'ios') {
      setShowInlineTimePicker(!showInlineTimePicker);
    } else {
      setShowTimePicker(true);
    }
  };

  const timeAsDate = new Date();
  const [hours, minutes] = dailyReminderTime.split(':');
  timeAsDate.setHours(parseInt(hours, 10));
  timeAsDate.setMinutes(parseInt(minutes, 10));

  return (
    <>
      <Stack.Screen options={{ title: 'Notifications' }} />
      <View style={[styles.container, { backgroundColor: platformColors.primary }]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Daily Reminder Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[
                styles.sectionHeader,
                {
                  color: platformColors.secondaryText,
                  fontSize: fontSize * 0.9,
                }
              ]}>
                DAILY REMINDERS
              </Text>
            </View>
            <View style={[
              styles.sectionCard,
              {
                backgroundColor: platformColors.secondary,
                borderColor: platformColors.border,
              }
            ]}>
              <View style={styles.settingItem}>
                <Text style={[
                  styles.settingText,
                  {
                    color: platformColors.text,
                    fontSize: fontSize * 1.0,
                  }
                ]}>
                  Daily Learning Reminder
                </Text>
                <Switch
                  value={dailyReminderEnabled}
                  onValueChange={setDailyReminderEnabled}
                  trackColor={{
                    false: platformColors.border,
                    true: platformColors.accent,
                  }}
                  thumbColor={platformColors.secondary}
                />
              </View>

              {dailyReminderEnabled && (
                <>
                  <TouchableOpacity
                    style={[
                      styles.settingItem,
                      {
                        borderTopWidth: StyleSheet.hairlineWidth,
                        borderTopColor: platformColors.border,
                        backgroundColor: showInlineTimePicker ? platformColors.primary : 'transparent',
                      }
                    ]}
                    onPress={showPicker}
                    activeOpacity={0.6}
                  >
                    <Text style={[
                      styles.settingText,
                      {
                        color: platformColors.text,
                        fontSize: fontSize * 1.0,
                      }
                    ]}>
                      Reminder Time
                    </Text>
                    <Text style={[
                      styles.timeText,
                      {
                        color: platformColors.accent,
                        fontSize: fontSize * 1.0,
                      }
                    ]}>
                      {dailyReminderTime}
                    </Text>
                  </TouchableOpacity>

                  {showInlineTimePicker && Platform.OS === 'ios' && (
                    <View style={[
                      styles.inlinePickerContainer,
                      {
                        borderTopWidth: StyleSheet.hairlineWidth,
                        borderTopColor: platformColors.border,
                        backgroundColor: platformColors.secondary,
                      }
                    ]}>
                      <DateTimePicker
                         value={timeAsDate}
                         mode="time"
                         is24Hour={true}
                         display="spinner"
                         onChange={onTimeChange}
                         style={styles.inlinePicker}
                         textColor={platformColors.text}
                       />
                    </View>
                  )}
                </>
              )}
            </View>
          </View>

          {/* Permission Status Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[
                styles.sectionHeader,
                {
                  color: platformColors.secondaryText,
                  fontSize: fontSize * 0.9,
                }
              ]}>
                NOTIFICATION STATUS
              </Text>
            </View>
            <View style={[
              styles.sectionCard,
              {
                backgroundColor: platformColors.secondary,
                borderColor: platformColors.border,
              }
            ]}>
              <View style={styles.settingItem}>
                <Text style={[
                  styles.settingText,
                  {
                    color: platformColors.text,
                    fontSize: fontSize * 1.0,
                  }
                ]}>
                  Permission Status
                </Text>
                <Text style={[
                  styles.statusText,
                  {
                    color: permissionStatus === 'granted' ? '#34C759' :
                           permissionStatus === 'denied' ? '#FF3B30' : platformColors.secondaryText,
                    fontSize: fontSize * 0.9,
                  }
                ]}>
                  {permissionStatus === 'granted' ? '✓ Allowed' :
                   permissionStatus === 'denied' ? '✗ Denied' : 'Unknown'}
                </Text>
              </View>

              {permissionStatus === 'denied' && (
                <View style={[
                  styles.settingItem,
                  {
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: platformColors.border,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }
                ]}>
                  <Text style={[
                    styles.warningText,
                    {
                      color: '#FF9500',
                      fontSize: fontSize * 0.85,
                      marginBottom: 8,
                    }
                  ]}>
                    ⚠️ Notifications are disabled
                  </Text>
                  <Text style={[
                    styles.helpText,
                    {
                      color: platformColors.secondaryText,
                      fontSize: fontSize * 0.8,
                      lineHeight: fontSize * 1.2,
                    }
                  ]}>
                    To enable notifications, go to Settings → Notifications → Madinah App and allow notifications.
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Future Options Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[
                styles.sectionHeader,
                {
                  color: platformColors.secondaryText,
                  fontSize: fontSize * 0.9,
                }
              ]}>
                ADDITIONAL OPTIONS
              </Text>
            </View>
            <View style={[
              styles.sectionCard,
              {
                backgroundColor: platformColors.secondary,
                borderColor: platformColors.border,
              }
            ]}>
              <View style={styles.settingItem}>
                <Text style={[
                  styles.placeholderText,
                  {
                    color: platformColors.secondaryText,
                    fontSize: fontSize * 0.9,
                  }
                ]}>
                  More notification options will be available in future updates.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderContainer: {
    paddingHorizontal: 4,
    paddingBottom: 6,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  settingText: {
    fontWeight: '500',
    flex: 1,
  },
  timeText: {
    fontWeight: '500',
  },
  placeholderText: {
    fontStyle: 'italic',
    textAlign: 'center',
  },
  inlinePickerContainer: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  inlinePicker: {
    width: '100%',
    height: 200,
  },
  statusText: {
    fontWeight: '600',
  },
  warningText: {
    fontWeight: '600',
  },
  helpText: {
    fontWeight: '400',
  },
});