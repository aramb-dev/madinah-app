import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { withLayoutContext } from 'expo-router';
import {
  createNativeBottomTabNavigator,
  NativeBottomTabNavigationOptions,
  NativeBottomTabNavigationEventMap,
} from '@bottom-tabs/react-navigation';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Lessons', // Explicitly set user-friendly name
          tabBarIcon: ({ color }) =>
            Platform.OS === 'ios' ? (
              { sfSymbol: 'books.vertical' }
            ) : (
              <MaterialIcons name="home" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="vocabulary"
        options={{
          title: 'Vocabulary',
          tabBarIcon: ({ color }) =>
            Platform.OS === 'ios' ? (
              { sfSymbol: 'pencil.and.list.clipboard' }
            ) : (
              <MaterialIcons name="school" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          tabBarIcon: ({ color }) =>
            Platform.OS === 'ios' ? (
              { sfSymbol: 'doc.questionmark' }
            ) : (
              <MaterialIcons name="fitness-center" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: 'Settings', // Explicitly set user-friendly name
          headerShown: true,
          tabBarIcon: ({ color }) =>
            Platform.OS === 'ios' ? (
              { sfSymbol: 'gear' }
            ) : (
              <MaterialIcons name="settings" size={24} color={color} />
            ),
        } as any}
      />
    </Tabs>
  );
}
