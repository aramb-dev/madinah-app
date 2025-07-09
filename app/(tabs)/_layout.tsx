import React from 'react';
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
    <Tabs
      screenOptions={
        {
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
          },
        } as any
      }
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Lessons', // Explicitly set user-friendly name
          tabBarIcon: () =>
            Platform.OS === 'ios'
              ? { sfSymbol: 'books.vertical' }
              : require('../../assets/images/home.png'),
        }}
      />
      <Tabs.Screen
        name="vocabulary"
        options={{
          title: 'Vocabulary',
          tabBarIcon: () =>
            Platform.OS === 'ios'
              ? { sfSymbol: 'pencil.and.list.clipboard' }
              : require('../../assets/images/vocabulary.png'),
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          tabBarIcon: () =>
            Platform.OS === 'ios'
              ? { sfSymbol: 'doc.questionmark' }
              : require('../../assets/images/exercises.png'),
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: 'Settings', // Explicitly set user-friendly name
          headerShown: true,
          tabBarIcon: () =>
            Platform.OS === 'ios'
              ? { sfSymbol: 'gear' }
              : require('../../assets/images/settings.png'),
        } as any}
      />
    </Tabs>
  );
}
