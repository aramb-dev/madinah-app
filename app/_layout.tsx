import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useColorScheme } from '@/components/useColorScheme';
import { FontProvider } from '@/components/FontContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

// Create an AsyncStorage persister
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // Amiri fonts
    'Amiri-Regular': require('../assets/fonts/Amiri/Amiri-Regular.ttf'),
    // Playpen Sans Arabic fonts
    'PlaypenSansArabic-Regular': require('../assets/fonts/Playpen-Sans-Arabic/PlaypenSansArabic-Regular.ttf'),
    // Noto Sans Arabic fonts
    'NotoSansArabic-Regular': require('../assets/fonts/Noto-Sans-Arabic/NotoSansArabic-Regular.ttf'),
    // IBM Plex Sans Arabic fonts
    'IBMPlexSansArabic-Regular': require('../assets/fonts/IBM-Arabic/IBMPlexSansArabic-Regular.ttf'),
    // Noto Kufi Arabic fonts
    'NotoKufiArabic-Regular': require('../assets/fonts/Kufi-Arabic/NotoKufiArabic-Regular.ttf'),
    // Baloo Bhaijaan 2 fonts
    'BalooBhaijaan2-Regular': require('../assets/fonts/Baloo-Bhaijaan/BalooBhaijaan2-Regular.ttf'),
    // Noto Naskh Arabic fonts
    'NotoNaskhArabic-Regular': require('../assets/fonts/Noto-Naskh-Arabic/NotoNaskhArabic-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
      >
        <BottomSheetModalProvider>
          <FontProvider>
            <RootLayoutNav />
          </FontProvider>
        </BottomSheetModalProvider>
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            title: "Lessons" // Add a proper title for iOS back button
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
