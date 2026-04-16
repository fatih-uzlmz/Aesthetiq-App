
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { FriendsProvider } from '@/context/FriendsContext';
import { SessionProvider, useSession } from '@/ctx';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ActivityIndicator, View } from 'react-native';

import { LogBox } from 'react-native';

// Suppress reanimated warning that occurs with Expo Router
LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.']);

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { session, isLoading, isOnboarded } = useSession();
  const router = useRouter();
  const segments = useSegments();


    useEffect(() => {
        if (isLoading) return;

        const inTabsGroup = segments[0] === '(tabs)';
        const inAuthGroup = segments[0] === 'challenge' || segments[0] === 'modal';

        if (isOnboarded && !inTabsGroup && !inAuthGroup) {
            if (segments[0] === 'onboarding' || segments[0] === 'login' || !segments[0]) {
                router.replace('/(tabs)');
            }
        } else if (!isOnboarded && segments[0] !== 'onboarding' && segments[0] !== 'login' && segments[0] !== 'habit-setup') {
            router.replace('/onboarding');
        }

    }, [isLoading, isOnboarded, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack screenOptions={{
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
        contentStyle: { backgroundColor: '#000' },
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="habit-setup" options={{ headerShown: false }} />
        <Stack.Screen name="camera" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="challenge/[id]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SessionProvider>
      <FriendsProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <RootLayoutNav />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </FriendsProvider>
    </SessionProvider>
  );
}
