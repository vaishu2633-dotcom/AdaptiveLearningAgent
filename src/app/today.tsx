import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  BorderRadius,
  MaxContentWidth,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useAssessment } from '@/context/assessment-context';
import { useTheme } from '@/hooks/use-theme';

export default function TodayScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { currentTopic, goalTitle, goalIcon } = useAssessment();

  const activeTopic = currentTopic || {
    id: 'ds-5',
    number: 5,
    title: 'Statistics Fundamentals',
    shortDescription: 'Build the foundation you need for probability and machine learning.',
    estimatedTime: '45 minutes',
    difficulty: 'Beginner',
    progressPercent: 35,
  };

  const steps = [
    {
      stepNumber: 1,
      badge: 'Step 1 • 20 min',
      type: 'LEARN',
      title: 'Mean, Median, and Spread',
      desc: 'Understand central tendency, variance, and standard deviation with intuitive visual examples.',
      icon: '📘',
      status: 'Ready',
    },
    {
      stepNumber: 2,
      badge: 'Step 2 • 15 min',
      type: 'PRACTICE',
      title: 'Applied Problem Solving',
      desc: 'Work through interactive calculation checkpoints with real-time feedback and hints.',
      icon: '💻',
      status: 'Ready',
    },
    {
      stepNumber: 3,
      badge: 'Step 3 • 10 min',
      type: 'QUIZ',
      title: 'Mastery Checkpoint',
      desc: '3 targeted questions to evaluate retention and automatically unlock the next milestone.',
      icon: '📝',
      status: 'Ready',
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Header Badges */}
          <View style={styles.headerRow}>
            <View style={[styles.goalBadge, { backgroundColor: theme.primaryLight }]}>
              <Text style={styles.goalIcon}>{goalIcon}</Text>
              <Text style={[styles.goalBadgeText, { color: theme.primary }]}>
                {goalTitle}
              </Text>
            </View>

            <View style={[styles.dailyBadge, { backgroundColor: theme.warningLight }]}>
              <Text style={styles.dailyBadgeEmoji}>⚡</Text>
              <Text style={[styles.dailyBadgeText, { color: theme.warning }]}>
                Today's Plan
              </Text>
            </View>
          </View>

          {/* Title and Subtitle */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Today's Learning</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Small steps today. Stronger skills tomorrow.
            </Text>
          </View>

          {/* Current Focus Card */}
          <View
            style={[
              styles.focusCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.primary,
              },
            ]}>
            <View style={styles.focusHeader}>
              <View style={[styles.focusPill, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.focusPillText, { color: theme.primary }]}>
                  MODULE {activeTopic.number || 5}
                </Text>
              </View>
              <View style={[styles.diffPill, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.diffPillText, { color: theme.textSecondary }]}>
                  ⏱ 45 min total
                </Text>
              </View>
            </View>

            <Text style={[styles.focusTopicTitle, { color: theme.text }]}>
              {activeTopic.title}
            </Text>
            <Text style={[styles.focusTopicDesc, { color: theme.textSecondary }]}>
              {activeTopic.shortDescription}
            </Text>

            {/* Quick Metrics */}
            <View style={styles.metricsRow}>
              <View style={[styles.metricChip, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                  Difficulty: <Text style={{ color: theme.text, fontWeight: '700' }}>{activeTopic.difficulty}</Text>
                </Text>
              </View>
              <View style={[styles.metricChip, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                  Progress: <Text style={{ color: theme.primary, fontWeight: '700' }}>{activeTopic.progressPercent}%</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* 3 Step Breakdown */}
          <Text style={[styles.sectionHeading, { color: theme.text }]}>
            Today's 3-Step Journey
          </Text>

          <View style={styles.stepsList}>
            {steps.map((s) => (
              <View
                key={s.stepNumber}
                style={[
                  styles.stepCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.cardBorder,
                  },
                ]}>
                <View style={styles.stepTopRow}>
                  <View style={[styles.iconBox, { backgroundColor: theme.backgroundElement }]}>
                    <Text style={styles.stepIcon}>{s.icon}</Text>
                  </View>
                  <View style={styles.stepTitleCol}>
                    <View style={styles.stepPillRow}>
                      <View style={[styles.typePill, { backgroundColor: theme.primaryLight }]}>
                        <Text style={[styles.typePillText, { color: theme.primary }]}>
                          {s.badge}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.stepTitle, { color: theme.text }]}>
                      {s.title}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                  {s.desc}
                </Text>
              </View>
            ))}
          </View>

          {/* AI Adaptive Note */}
          <View
            style={[
              styles.adaptiveNoteCard,
              {
                backgroundColor: theme.primaryLight,
                borderColor: theme.primary,
              },
            ]}>
            <Text style={styles.adaptiveNoteIcon}>🤖</Text>
            <View style={styles.adaptiveNoteContent}>
              <Text style={[styles.adaptiveNoteTitle, { color: theme.primaryDark }]}>
                AI Adaptation Active
              </Text>
              <Text style={[styles.adaptiveNoteDesc, { color: theme.primaryDark }]}>
                Your agent prioritized this module based on your diagnostic results to strengthen foundational confidence.
              </Text>
            </View>
          </View>

          {/* Action CTAs */}
          <View style={styles.actionSection}>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/learning-session/[id]',
                  params: { id: activeTopic.id },
                })
              }
              style={({ pressed }) => [
                styles.primaryBtn,
                {
                  backgroundColor: theme.primary,
                  opacity: pressed ? 0.92 : 1,
                  transform: [{ scale: pressed ? 0.985 : 1 }],
                },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Start Today's Plan">
              <Text style={styles.primaryBtnText}>Start Today's Plan →</Text>
            </Pressable>

            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/topic/[id]',
                  params: { id: activeTopic.id },
                })
              }
              style={({ pressed }) => [
                styles.secondaryBtn,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.cardBorder,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="View Topic Details">
              <Text style={[styles.secondaryBtnText, { color: theme.text }]}>
                View Topic Overview & Syllabus
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: Spacing.four,
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    gap: 6,
  },
  goalIcon: {
    fontSize: 15,
  },
  goalBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dailyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
    gap: 4,
  },
  dailyBadgeEmoji: {
    fontSize: 13,
  },
  dailyBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  header: {
    gap: 4,
  },
  title: {
    ...Typography.h1,
  },
  subtitle: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  focusCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 2,
    ...Shadows.primaryBtn,
    shadowOpacity: 0.12,
    gap: Spacing.two + 2,
  },
  focusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  focusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  focusPillText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  diffPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  diffPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  focusTopicTitle: {
    ...Typography.h2,
    fontSize: 20,
    lineHeight: 26,
  },
  focusTopicDesc: {
    ...Typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: 2,
  },
  metricChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
  },
  metricLabel: {
    fontSize: 12,
  },
  sectionHeading: {
    ...Typography.h2,
    fontSize: 18,
    marginTop: Spacing.one,
  },
  stepsList: {
    gap: Spacing.three,
  },
  stepCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
    gap: Spacing.two,
  },
  stepTopRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIcon: {
    fontSize: 22,
  },
  stepTitleCol: {
    flex: 1,
    gap: 2,
  },
  stepPillRow: {
    flexDirection: 'row',
  },
  typePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  typePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  stepTitle: {
    ...Typography.h3,
    fontSize: 16,
    fontWeight: '700',
  },
  stepDesc: {
    ...Typography.body,
    fontSize: 13,
    lineHeight: 19,
  },
  adaptiveNoteCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  adaptiveNoteIcon: {
    fontSize: 22,
  },
  adaptiveNoteContent: {
    flex: 1,
    gap: 3,
  },
  adaptiveNoteTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  adaptiveNoteDesc: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  actionSection: {
    gap: Spacing.two + 2,
    marginTop: Spacing.two,
  },
  primaryBtn: {
    height: 56,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.primaryBtn,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryBtn: {
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
