import React, { useState } from 'react';
import { View, Switch, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Text } from '../../../components/Themed';
import { useNotifications } from '@/components/NotificationsContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useColorScheme } from '@/components/useColorScheme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Platform-specific colors for consistency
const getBackgroundColors = (isDark: boolean) => ({
  primary: isDark ? '#1c1c1e' : '#f2f2f7',
  secondary: isDark ? '#2c2c2e' : '#ffffff',
  tertiary: isDark ? '#3a3a3c' : '#f9f9f9',
  border: isDark ? '#38383a' : '#c6c6c8',
  text: isDark ? '#ffffff' : '#000000',
  secondaryText: isDark ? '#8e8e93' : '#6d6d70',
  accent: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
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
          {/* Study Reminder Card */}
          <View style={styles.section}>
            <View style={[
              styles.heroCard,
              {
                backgroundColor: platformColors.accent,
              }
            ]}>
              <View style={styles.heroIconContainer}>
                <Ionicons name="notifications" size={40} color="#fff" />
              </View>
              <Text style={[styles.heroTitle, { fontSize: fontSize * 1.2 }]}>
                Stay Consistent
              </Text>
              <Text style={[styles.heroSubtitle, { fontSize: fontSize * 0.9 }]}>
                Set daily reminders to build a strong learning habit
              </Text>
            </View>
          </View>

          {/* Daily Reminder Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[
                styles.sectionHeader,
                {
                  color: platformColors.secondaryText,
                  fontSize: fontSize * 0.85,
                }
              ]}>
                DAILY STUDY REMINDER
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
                <View style={styles.settingIconText}>
                  <View style={[styles.iconBadge, { backgroundColor: platformColors.accent + '20' }]}>
                    <Ionicons name="alarm" size={20} color={platformColors.accent} />
                  </View>
                  <View>
                    <Text style={[
                      styles.settingText,
                      {
                        color: platformColors.text,
                        fontSize: fontSize * 1.0,
                      }
                    ]}>
                      Enable Daily Reminder
                    </Text>
                    <Text style={[
                      styles.settingDescription,
                      {
                        color: platformColors.secondaryText,
                        fontSize: fontSize * 0.8,
                      }
                    ]}>
                      Get notified to study every day
                    </Text>
                  </View>
                </View>
                <Switch
                  value={dailyReminderEnabled}
                  onValueChange={setDailyReminderEnabled}
                  trackColor={{
                    false: platformColors.border,
                    true: platformColors.accent,
                  }}
                  thumbColor={platformColors.secondary}
                  ios_backgroundColor={platformColors.border}
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
                        backgroundColor: showInlineTimePicker ? platformColors.tertiary : 'transparent',
                      }
                    ]}
                    onPress={showPicker}
                    activeOpacity={0.7}
                  >
                    <View style={styles.settingIconText}>
                      <View style={[styles.iconBadge, { backgroundColor: platformColors.accent + '20' }]}>
                        <Ionicons name="time" size={20} color={platformColors.accent} />
                      </View>
                      <Text style={[
                        styles.settingText,
                        {
                          color: platformColors.text,
                          fontSize: fontSize * 1.0,
                        }
                      ]}>
                        Reminder Time
                      </Text>
                    </View>
                    <View style={styles.timeContainer}>
                      <Text style={[
                        styles.timeText,
                        {
                          color: platformColors.accent,
                          fontSize: fontSize * 1.1,
                        }
                      ]}>
                        {dailyReminderTime}
                      </Text>
                      <Ionicons
                        name={showInlineTimePicker ? "chevron-up" : "chevron-down"}
                        size={16}
                        color={platformColors.secondaryText}
                        style={styles.chevronIcon}
                      />
                    </View>
                  </TouchableOpacity>

                  {showInlineTimePicker && Platform.OS === 'ios' && (
                    <View style={[
                      styles.inlinePickerContainer,
                      {
                        borderTopWidth: StyleSheet.hairlineWidth,
                        borderTopColor: platformColors.border,
                        backgroundColor: platformColors.tertiary,
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
          {permissionStatus !== 'granted' && (
            <View style={styles.section}>
              <View style={[
                styles.warningCard,
                {
                  backgroundColor: permissionStatus === 'denied' ? platformColors.danger + '15' : platformColors.warning + '15',
                  borderColor: permissionStatus === 'denied' ? platformColors.danger : platformColors.warning,
                }
              ]}>
                <View style={styles.warningIconContainer}>
                  <Ionicons
                    name="warning"
                    size={28}
                    color={permissionStatus === 'denied' ? platformColors.danger : platformColors.warning}
                  />
                </View>
                <Text style={[
                  styles.warningTitle,
                  {
                    color: permissionStatus === 'denied' ? platformColors.danger : platformColors.warning,
                    fontSize: fontSize * 1.0,
                  }
                ]}>
                  {permissionStatus === 'denied' ? 'Notifications Blocked' : 'Permission Needed'}
                </Text>
                <Text style={[
                  styles.warningMessage,
                  {
                    color: platformColors.text,
                    fontSize: fontSize * 0.85,
                  }
                ]}>
                  {permissionStatus === 'denied'
                    ? 'Please enable notifications in your device settings to receive study reminders.'
                    : 'Grant notification permission to receive daily learning reminders.'}
                </Text>
                {permissionStatus === 'denied' && (
                  <Text style={[
                    styles.warningSteps,
                    {
                      color: platformColors.secondaryText,
                      fontSize: fontSize * 0.75,
                    }
                  ]}>
                    Settings → Notifications → Madinah Resources → Allow Notifications
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Study Tips Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[
                styles.sectionHeader,
                {
                  color: platformColors.secondaryText,
                  fontSize: fontSize * 0.85,
                }
              ]}>
                STUDY TIPS
              </Text>
            </View>
            <View style={[
              styles.tipsCard,
              {
                backgroundColor: platformColors.success + '15',
                borderColor: platformColors.success + '30',
              }
            ]}>
              <View style={styles.tipRow}>
                <Ionicons name="checkmark-circle" size={20} color={platformColors.success} />
                <Text style={[
                  styles.tipText,
                  {
                    color: platformColors.text,
                    fontSize: fontSize * 0.85,
                  }
                ]}>
                  Study at the same time daily for best results
                </Text>
              </View>
              <View style={styles.tipRow}>
                <Ionicons name="checkmark-circle" size={20} color={platformColors.success} />
                <Text style={[
                  styles.tipText,
                  {
                    color: platformColors.text,
                    fontSize: fontSize * 0.85,
                  }
                ]}>
                  Even 10-15 minutes daily builds strong habits
                </Text>
              </View>
              <View style={styles.tipRow}>
                <Ionicons name="checkmark-circle" size={20} color={platformColors.success} />
                <Text style={[
                  styles.tipText,
                  {
                    color: platformColors.text,
                    fontSize: fontSize * 0.85,
                  }
                ]}>
                  Review previous lessons regularly for retention
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
    paddingTop: 12,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeaderContainer: {
    paddingHorizontal: 6,
    paddingBottom: 8,
  },
  sectionHeader: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    minHeight: 60,
  },
  settingIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    fontWeight: '600',
  },
  settingDescription: {
    marginTop: 2,
    opacity: 0.8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  chevronIcon: {
    marginLeft: 2,
  },
  inlinePickerContainer: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  inlinePicker: {
    width: '100%',
    height: 200,
  },
  // Hero Card
  heroCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Warning Card
  warningCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 20,
    alignItems: 'center',
  },
  warningIconContainer: {
    marginBottom: 12,
  },
  warningTitle: {
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  warningMessage: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  warningSteps: {
    textAlign: 'center',
    opacity: 0.8,
    fontWeight: '500',
    marginTop: 4,
  },
  // Tips Card
  tipsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipText: {
    flex: 1,
    lineHeight: 20,
  },
});