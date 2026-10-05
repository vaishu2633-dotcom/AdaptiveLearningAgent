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

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { goalTitle, goalIcon, currentTopic, roadmap, completedTopicIds, result } = useAssessment();

  const totalTopics = roadmap.length || 12;
  const completedCount = completedTopicIds.length;
  const readiness = result?.overallScore || 68;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Top Greeting & Streak */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={[styles.greetingSubtitle, { color: theme.textSecondary }]}>
              Welcome back, Learner 👋
            </Text>
            <Text style={[styles.greetingTitle, { color: theme.text }]}>
              Keep up the momentum!
            </Text>
          </View>
          <View style={[styles.streakBadge, { backgroundColor: theme.warningLight }]}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={[styles.streakText, { color: theme.warning }]}>3 Day Streak</Text>
          </View>
        </View>

        {/* Dynamic Quick Stats Row */}
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {completedCount}/{totalTopics}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Modules Done
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={[styles.statValue, { color: theme.success }]}>
              {readiness}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Skill Readiness
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={[styles.statValue, { color: theme.warning }]}>
              45m
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Today's Goal
            </Text>
          </View>
        </View>

        {/* Up Next: Dominant Current Module Card */}
        <View
          style={[
            styles.heroCard,
            { backgroundColor: theme.card, borderColor: theme.primary },
          ]}>
          <View style={styles.cardHeader}>
            <View style={[styles.tagBadge, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.tagText, { color: theme.primary }]}>
                CURRENT TOPIC • MODULE {currentTopic?.number || 5}
              </Text>
            </View>
            <Text style={[styles.aiBadge, { color: theme.success }]}>● AI Engine Active</Text>
          </View>

          <Text style={[styles.pathTitle, { color: theme.text }]}>
            {currentTopic?.title || 'Statistics Fundamentals'}
          </Text>
          <Text style={[styles.pathDescription, { color: theme.textSecondary }]}>
            {currentTopic?.shortDescription ||
              'Build the foundation you need for probability and machine learning.'}
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>
                Topic Progress
              </Text>
              <Text style={[styles.progressPercentage, { color: theme.primary }]}>
                {currentTopic?.progressPercent || 35}% Completed
              </Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: theme.backgroundElement }]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: theme.primary,
                    width: `${Math.max(currentTopic?.progressPercent || 35, 12)}%`,
                  },
                ]}
              />
            </View>
          </View>

          {/* Today's Goal Flow */}
          <View style={[styles.goalFlowBox, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[styles.goalFlowTitle, { color: theme.textSecondary }]}>
              TODAY'S GOAL
            </Text>
            <View style={styles.goalStepsRow}>
              <View style={[styles.stepItemPill, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.stepItemText, { color: theme.primary }]}>1. Learn</Text>
              </View>
              <Text style={[styles.stepArrow, { color: theme.textMuted }]}>→</Text>
              <View style={[styles.stepItemPill, { backgroundColor: theme.accentLight }]}>
                <Text style={[styles.stepItemText, { color: theme.accent }]}>2. Practice</Text>
              </View>
              <Text style={[styles.stepArrow, { color: theme.textMuted }]}>→</Text>
              <View style={[styles.stepItemPill, { backgroundColor: theme.warningLight }]}>
                <Text style={[styles.stepItemText, { color: theme.warning }]}>3. Quiz</Text>
              </View>
            </View>
          </View>

          {/* Action CTAs */}
          <View style={styles.heroActionRow}>
            <Pressable
              onPress={() => router.push('/today')}
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
              accessibilityLabel="Continue Learning">
              <Text style={styles.primaryBtnText}>Continue →</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/(tabs)/learning-path')}
              style={({ pressed }) => [
                styles.outlineBtn,
                {
                  backgroundColor: theme.backgroundElement,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="View Full Roadmap">
              <Text style={[styles.outlineBtnText, { color: theme.text }]}>
                View Full Roadmap
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Recommended For You Section */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recommended for you</Text>

        <Pressable
          onPress={() =>
            router.push({
              pathname: '/learning/video/[id]',
              params: { id: currentTopic?.id || 'ds-5' },
            })
          }
          style={({ pressed }) => [
            styles.recCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.primary,
              opacity: pressed ? 0.92 : 1,
            },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Watch Recommended AI Explanation">
          <View style={styles.recTopRow}>
            <View style={[styles.recTag, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.recTagText, { color: theme.primary }]}>
                ▶ AI EXPLANATION • 4 MIN
              </Text>
            </View>
            <View style={[styles.recScoreBadge, { backgroundColor: theme.successLight }]}>
              <Text style={[styles.recScoreBadgeText, { color: theme.success }]}>
                Personalized
              </Text>
            </View>
          </View>

          <Text style={[styles.recCardTitle, { color: theme.text }]}>
            {currentTopic?.title || 'Statistics Fundamentals'}: Core Visual Intuition
          </Text>

          <Text style={[styles.recCardDesc, { color: theme.textSecondary }]}>
            A 4-minute visual walkthrough generated for your learning level before taking the quiz.
          </Text>

          <View style={styles.recCtaRow}>
            <View style={[styles.recActionBtn, { backgroundColor: theme.primary }]}>
              <Text style={styles.recActionBtnText}>Watch Explanation (4 min) →</Text>
            </View>
          </View>
        </Pressable>

        {/* Quick AI Actions Grid */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Adaptive Tools</Text>

        <View style={styles.actionsGrid}>
          {/* Action 1: Adaptive Quiz */}
          <Pressable
            onPress={() => router.push('/quiz')}
            style={({ pressed }) => [
              styles.actionCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Take Adaptive Checkpoint Quiz">
            <View style={styles.actionTopRow}>
              <View style={[styles.actionIconBox, { backgroundColor: theme.accentLight }]}>
                <Text style={styles.actionIcon}>📝</Text>
              </View>
              <View style={[styles.miniBadge, { backgroundColor: theme.accentLight }]}>
                <Text style={[styles.miniBadgeText, { color: theme.accent }]}>3 min</Text>
              </View>
            </View>
            <Text style={[styles.actionCardTitle, { color: theme.text }]}>
              Adaptive Quiz
            </Text>
            <Text style={[styles.actionCardDesc, { color: theme.textSecondary }]}>
              Quick check to dynamically adjust your roadmap difficulty.
            </Text>
            <View style={[styles.actionCta, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.actionCtaText, { color: theme.primary }]}>Start Quiz →</Text>
            </View>
          </Pressable>

          {/* Action 2: AI Study Assistant */}
          <Pressable
            onPress={() => router.push('/assistant')}
            style={({ pressed }) => [
              styles.actionCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Ask AI Learning Assistant">
            <View style={styles.actionTopRow}>
              <View style={[styles.actionIconBox, { backgroundColor: theme.primaryLight }]}>
                <Text style={styles.actionIcon}>🤖</Text>
              </View>
              <View style={[styles.miniBadge, { backgroundColor: theme.successLight }]}>
                <Text style={[styles.miniBadgeText, { color: theme.success }]}>24/7</Text>
              </View>
            </View>
            <Text style={[styles.actionCardTitle, { color: theme.text }]}>
              AI Assistant
            </Text>
            <Text style={[styles.actionCardDesc, { color: theme.textSecondary }]}>
              Instant concept explanations and personalized study guidance.
            </Text>
            <View style={[styles.actionCta, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.actionCtaText, { color: theme.primary }]}>Chat with Agent →</Text>
            </View>
          </Pressable>
        </View>

        {/* Return to Welcome link */}
        <Pressable
          onPress={() => router.replace('/')}
          style={styles.welcomeLink}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Return to Welcome Screen">
          <Text style={[styles.welcomeLinkText, { color: theme.textMuted }]}>
            ← Return to Welcome Screen
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
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingSubtitle: {
    ...Typography.body,
    fontSize: 14,
  },
  greetingTitle: {
    ...Typography.h2,
    fontSize: 22,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    gap: 6,
  },
  streakEmoji: {
    fontSize: 16,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.card,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderWidth: 1,
    ...Shadows.card,
    alignItems: 'center',
    gap: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  heroCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.four,
    borderWidth: 2,
    ...Shadows.primaryBtn,
    shadowOpacity: 0.12,
    gap: Spacing.two + 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  aiBadge: {
    fontSize: 12,
    fontWeight: '700',
  },
  pathTitle: {
    ...Typography.h2,
    fontSize: 20,
    lineHeight: 26,
  },
  pathDescription: {
    ...Typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  progressContainer: {
    marginTop: 4,
    gap: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalFlowBox: {
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    gap: 6,
    marginTop: 2,
  },
  goalFlowTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  goalStepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepItemPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  stepItemText: {
    fontSize: 12,
    fontWeight: '700',
  },
  stepArrow: {
    fontSize: 12,
    fontWeight: '700',
  },
  heroActionRow: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  recCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 2,
    ...Shadows.primaryBtn,
    shadowOpacity: 0.12,
    gap: Spacing.two,
  },
  recTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  recTagText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  recScoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  recScoreBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  recCardTitle: {
    ...Typography.h3,
    fontSize: 17,
  },
  recCardDesc: {
    ...Typography.body,
    fontSize: 13,
    lineHeight: 19,
  },
  recCtaRow: {
    marginTop: 2,
  },
  recActionBtn: {
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  primaryBtn: {
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  outlineBtn: {
    height: 46,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: 18,
  },
  actionsGrid: {
    gap: Spacing.three,
  },
  actionCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
    gap: 8,
  },
  actionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 22,
  },
  miniBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  miniBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionCardTitle: {
    ...Typography.h3,
    fontSize: 17,
  },
  actionCardDesc: {
    ...Typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  actionCta: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    marginTop: 4,
  },
  actionCtaText: {
    fontSize: 13,
    fontWeight: '700',
  },
  welcomeLink: {
    alignItems: 'center',
    paddingVertical: Spacing.three,
  },
  welcomeLinkText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
