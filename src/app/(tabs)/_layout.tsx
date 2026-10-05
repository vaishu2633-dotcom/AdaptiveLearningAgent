import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';

import { BorderRadius, Colors, Spacing } from '@/constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.cardBorder,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerShadowVisible: false,
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerTitle: 'Adaptive Learning Agent',
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconWrap,
                focused && { backgroundColor: theme.primaryLight },
              ]}>
              <Text style={styles.iconText}>🏠</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="learning-path"
        options={{
          title: 'My Path',
          headerTitle: 'Personalized Path',
          tabBarLabel: 'Path',
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconWrap,
                focused && { backgroundColor: theme.primaryLight },
              ]}>
              <Text style={styles.iconText}>🗺️</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          headerTitle: 'Skill Progress',
          tabBarLabel: 'Progress',
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconWrap,
                focused && { backgroundColor: theme.primaryLight },
              ]}>
              <Text style={styles.iconText}>📊</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'Student Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconWrap,
                focused && { backgroundColor: theme.primaryLight },
              ]}>
              <Text style={styles.iconText}>👤</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
});
