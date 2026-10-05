import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { AssessmentProvider } from '@/context/assessment-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  useEffect(() => {
    // Hide native splash screen once the app mounts
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AssessmentProvider>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.card,
            },
            headerTintColor: theme.text,
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 17,
            },
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: theme.background,
            },
          }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="onboarding/goal"
            options={{
              headerShown: true,
              title: 'Select Your Goal',
              headerBackTitle: 'Welcome',
            }}
          />
          <Stack.Screen
            name="onboarding/assessment"
            options={{
              headerShown: true,
              title: 'Skill Assessment',
              headerBackTitle: 'Goal',
            }}
          />
          <Stack.Screen
            name="onboarding/assessment-result"
            options={{
              headerShown: true,
              title: 'Skill Snapshot',
              headerBackTitle: 'Assessment',
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="quiz/index"
            options={{
              headerShown: true,
              title: 'Adaptive Quiz',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name="quiz/result"
            options={{
              headerShown: true,
              title: 'Quiz Performance',
              headerBackTitle: 'Quiz',
            }}
          />
          <Stack.Screen
            name="today"
            options={{
              headerShown: true,
              title: "Today's Learning",
              headerBackTitle: 'Path',
            }}
          />
          <Stack.Screen
            name="topic/[id]"
            options={{
              headerShown: true,
              title: 'Topic Overview',
              headerBackTitle: 'Roadmap',
            }}
          />
          <Stack.Screen
            name="learning-session/[id]"
            options={{
              headerShown: true,
              title: 'Interactive Lesson',
              headerBackTitle: 'Topic',
            }}
          />
          <Stack.Screen
            name="learning/video/[id]"
            options={{
              headerShown: true,
              title: 'AI Explanation',
              headerBackTitle: 'Topic',
            }}
          />
          <Stack.Screen
            name="practice/[id]"
            options={{
              headerShown: true,
              title: 'Quick Practice',
              headerBackTitle: 'Topic',
            }}
          />
          <Stack.Screen
            name="assistant"
            options={{
              headerShown: true,
              title: 'AI Learning Assistant',
              headerBackTitle: 'Back',
            }}
          />
        </Stack>
      </AssessmentProvider>
    </ThemeProvider>
  );
}
