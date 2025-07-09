import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
      <Stack.Screen name="appearance" options={{ title: 'Appearance' }} />
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="learning" options={{ title: 'Learning Settings' }} />
      <Stack.Screen name="support" options={{ title: 'Support & Feedback' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
      <Stack.Screen name="changelog" options={{ title: 'Changelog' }} />
    </Stack>
  );
}