import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Text, useThemeColor } from './Themed';
import { useSettings } from '@/contexts/SettingsContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  index: { active: 'book', inactive: 'book-outline' },
  vocabulary: { active: 'language', inactive: 'language-outline' },
  exercises: { active: 'clipboard', inactive: 'clipboard-outline' },
  '(settings)': { active: 'settings', inactive: 'settings-outline' },
};

const TAB_LABELS: Record<string, string> = {
  index: 'Lessons',
  vocabulary: 'Vocabulary',
  exercises: 'Exercises',
  '(settings)': 'Settings',
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { fontSize } = useSettings();
  const insets = useSafeAreaInsets();

  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const activeColor = useThemeColor({}, 'tint');
  const inactiveColor = useThemeColor({}, 'tabIconDefault');

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          borderTopColor: borderColor,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = TAB_LABELS[route.name] || options.tabBarLabel || route.name;

        const isFocused = state.index === index;
        const iconSet = TAB_ICONS[route.name] || { active: 'help-circle', inactive: 'help-circle-outline' };
        const iconName = isFocused ? iconSet.active : iconSet.inactive;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            <View style={[styles.iconContainer, isFocused && styles.activeTab]}>
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? activeColor : inactiveColor}
              />
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: fontSize * 0.75,
                    color: isFocused ? activeColor : inactiveColor,
                    fontWeight: isFocused ? '600' : '400',
                  },
                ]}
              >
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 60,
  },
  activeTab: {
    // You can add a subtle background or other effects here if desired
  },
  label: {
    marginTop: 4,
    textAlign: 'center',
  },
});
