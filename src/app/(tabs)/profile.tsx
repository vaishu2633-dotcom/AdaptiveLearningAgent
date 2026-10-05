import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  BorderRadius,
  MaxContentWidth,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { useAssessment } from '@/context/assessment-context';

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { goalTitle } = useAssessment();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}>
          <View style={styles.avatarRow}>
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: theme.primaryLight, borderColor: theme.primary },
              ]}>
              <Text style={styles.avatarEmoji}>🎓</Text>
            </View>
            <View style={styles.avatarInfo}>
              <Text style={[styles.userName, { color: theme.text }]}>Student Learner</Text>
              <Text style={[styles.userGoal, { color: theme.textSecondary }]}>
                Goal: {goalTitle}
              </Text>
              <View style={[styles.planBadge, { backgroundColor: theme.successLight }]}>
                <Text style={[styles.planText, { color: theme.success }]}>
                  AI Adaptive Engine • Active
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Learning Settings */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Agent Preferences</Text>

          {[
            { title: 'Adaptive Difficulty Mode', value: 'Dynamic (Auto-tunes)' },
            { title: 'Quiz Frequency', value: 'After every unit' },
            { title: 'Feedback Style', value: 'Conceptual & Socratic' },
            { title: 'Daily Target', value: '30 mins / day' },
          ].map((item, index) => (
            <View key={index} style={styles.settingRow}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{item.title}</Text>
              <Text style={[styles.settingValue, { color: theme.primary }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Change Goal / Switch Path */}
        <Pressable
          onPress={() => router.push('/onboarding/goal')}
          style={({ pressed }) => [
            styles.switchGoalBtn,
            {
              backgroundColor: theme.primaryLight,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Switch Learning Goal">
          <Text style={[styles.switchGoalText, { color: theme.primary }]}>
            Change Target Goal / Switch Path →
          </Text>
        </Pressable>

        {/* Log Out / Back to Welcome */}
        <Pressable
          onPress={() => router.replace('/')}
          style={styles.welcomeLink}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Return to Welcome Screen">
          <Text style={[styles.welcomeLinkText, { color: theme.textMuted }]}>
            Log Out & Return to Welcome Screen
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
  },
  profileCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  avatarInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    ...Typography.h2,
    fontSize: 20,
  },
  userGoal: {
    ...Typography.body,
    fontSize: 14,
  },
  planBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
    marginTop: 2,
  },
  planText: {
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    gap: Spacing.three,
    ...Shadows.card,
  },
  cardTitle: {
    ...Typography.h3,
    fontSize: 18,
    marginBottom: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  switchGoalBtn: {
    height: 52,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchGoalText: {
    fontSize: 15,
    fontWeight: '700',
  },
  welcomeLink: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  welcomeLinkText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
