import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { getRecommendedResources } from '@/data/learningResources';
import { useTheme } from '@/hooks/use-theme';

export default function QuizResultScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams<{
    score?: string;
    correctCount?: string;
    totalQuestions?: string;
    topicId?: string;
  }>();

  const { recordQuizResult, roadmap, currentTopic } = useAssessment();

  const passedScore = params.score ? parseInt(params.score, 10) : 80;
  const passedCorrect = params.correctCount ? parseInt(params.correctCount, 10) : 4;
  const passedTotal = params.totalQuestions ? parseInt(params.totalQuestions, 10) : 5;
  const topicId = params.topicId || currentTopic?.id || 'ds-5';

  const activeTopic = roadmap.find((t) => t.id === topicId) || currentTopic || {
    id: topicId,
    title: 'Statistics Fundamentals',
  };

  // State for simulated or actual score
  const [activeScore, setActiveScore] = useState<number>(passedScore);
  const [correctNum, setCorrectNum] = useState<number>(passedCorrect);
  const totalNum = passedTotal;

  // Sync to context engine on mount or when activeScore changes
  useEffect(() => {
    recordQuizResult(topicId, activeScore);
  }, [activeScore, topicId]);

  // Derive score tier: High (>=80), Mid (60-79), Low (<60)
  const isHigh = activeScore >= 80;
  const isMid = activeScore >= 60 && activeScore < 80;
  const isLow = activeScore < 60;

  const recommendedResources = getRecommendedResources(activeScore, topicId);

  // Quick Simulation handler for Section 20 verification
  const handleSimulateScenario = (simScore: number, simCorrect: number) => {
    setActiveScore(simScore);
    setCorrectNum(simCorrect);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Section 20 Scenario Tester Pills */}
          <View
            style={[
              styles.scenarioBar,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={[styles.scenarioBarLabel, { color: theme.textSecondary }]}>
              Test Adaptive Outcome:
            </Text>
            <View style={styles.scenarioPillsRow}>
              <Pressable
                onPress={() => handleSimulateScenario(90, 4)}
                style={[
                  styles.scenarioPill,
                  {
                    backgroundColor: isHigh ? theme.success : theme.backgroundElement,
                  },
                ]}>
                <Text
                  style={[
                    styles.scenarioPillText,
                    { color: isHigh ? '#FFFFFF' : theme.text },
                  ]}>
                  90% (Pass)
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleSimulateScenario(70, 3)}
                style={[
                  styles.scenarioPill,
                  {
                    backgroundColor: isMid ? theme.primary : theme.backgroundElement,
                  },
                ]}>
                <Text
                  style={[
                    styles.scenarioPillText,
                    { color: isMid ? '#FFFFFF' : theme.text },
                  ]}>
                  70% (Review)
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleSimulateScenario(40, 2)}
                style={[
                  styles.scenarioPill,
                  {
                    backgroundColor: isLow ? theme.error : theme.backgroundElement,
                  },
                ]}>
                <Text
                  style={[
                    styles.scenarioPillText,
                    { color: isLow ? '#FFFFFF' : theme.text },
                  ]}>
                  40% (Needs Help)
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Top Engine Pill */}
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.engineBadge,
                {
                  backgroundColor: isHigh
                    ? theme.successLight
                    : isMid
                    ? theme.primaryLight
                    : theme.errorLight,
                },
              ]}>
              <Text style={styles.badgeSparkle}>
                {isHigh ? '🏆' : isMid ? '⚡' : '⚠️'}
              </Text>
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: isHigh
                      ? theme.success
                      : isMid
                      ? theme.primary
                      : theme.error,
                  },
                ]}>
                ADAPTIVE REPLANNING ENGINE
              </Text>
            </View>
          </View>

          {/* Score Header Card */}
          <View
            style={[
              styles.scoreHeroCard,
              {
                backgroundColor: theme.card,
                borderColor: isHigh ? theme.success : isMid ? theme.primary : theme.error,
              },
            ]}>
            <Text style={[styles.scoreTitle, { color: theme.textSecondary }]}>
              Your Result • {activeTopic.title}
            </Text>

            <Text
              style={[
                styles.scoreNumber,
                {
                  color: isHigh ? theme.success : isMid ? theme.primary : theme.error,
                },
              ]}>
              {activeScore}%
            </Text>

            <Text style={[styles.scoreFeedback, { color: theme.text }]}>
              {isHigh
                ? 'Great progress! You demonstrated solid mastery.'
                : isMid
                ? "You're close! A little more practice will strengthen this topic."
                : "Let's strengthen this concept before moving forward."}
            </Text>

            {/* Metrics Breakdown */}
            <View style={styles.metricsRow}>
              <View style={[styles.metricChip, { backgroundColor: theme.successLight }]}>
                <Text style={[styles.metricChipText, { color: theme.success }]}>
                  ✓ Correct: {correctNum}
                </Text>
              </View>
              <View style={[styles.metricChip, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.metricChipText, { color: theme.textSecondary }]}>
                  ✗ Incorrect: {Math.max(totalNum - correctNum, 0)}
                </Text>
              </View>
            </View>
          </View>

          {/* Section 9: Adaptive Learning Behavior Banner */}
          <View
            style={[
              styles.adaptiveBanner,
              {
                backgroundColor: isHigh
                  ? theme.successLight
                  : isMid
                  ? theme.primaryLight
                  : theme.errorLight,
                borderColor: isHigh
                  ? theme.success
                  : isMid
                  ? theme.primary
                  : theme.error,
              },
            ]}>
            <View style={styles.adaptiveHeader}>
              <Text style={styles.adaptiveIcon}>{isHigh ? '🚀' : '⚡'}</Text>
              <Text
                style={[
                  styles.adaptiveBannerTitle,
                  {
                    color: isHigh
                      ? theme.success
                      : isMid
                      ? theme.primaryDark
                      : theme.error,
                  },
                ]}>
                Your learning path has been updated
              </Text>
            </View>

            <Text
              style={[
                styles.adaptiveBannerDesc,
                {
                  color: isHigh
                    ? theme.text
                    : isMid
                    ? theme.primaryDark
                    : theme.text,
                },
              ]}>
              {isHigh
                ? `Mastery confirmed for ${activeTopic.title}! The subsequent topic has been automatically unlocked on your roadmap.`
                : isMid
                ? `Your quiz score (${activeScore}%) shows good understanding. 5 extra practice exercises have been queued to cement confidence.`
                : `Your quiz score shows that ${activeTopic.title} needs more practice. We've added an AI visual explanation and practice drills.`}
            </Text>

            {/* What was added / updated */}
            <View style={styles.modificationsList}>
              {isHigh ? (
                <>
                  <View style={styles.modItem}>
                    <Text style={[styles.modCheck, { color: theme.success }]}>✓</Text>
                    <Text style={[styles.modText, { color: theme.text }]}>
                      Topic marked: Completed (100% progress)
                    </Text>
                  </View>
                  <View style={styles.modItem}>
                    <Text style={[styles.modCheck, { color: theme.success }]}>✓</Text>
                    <Text style={[styles.modText, { color: theme.text }]}>
                      Next topic unlocked: Probability Basics
                    </Text>
                  </View>
                </>
              ) : isMid ? (
                <>
                  <View style={styles.modItem}>
                    <Text style={[styles.modCheck, { color: theme.primary }]}>⚡</Text>
                    <Text style={[styles.modText, { color: theme.text }]}>
                      Added: 5 Targeted Practice Drills
                    </Text>
                  </View>
                  <View style={styles.modItem}>
                    <Text style={[styles.modCheck, { color: theme.primary }]}>⚡</Text>
                    <Text style={[styles.modText, { color: theme.text }]}>
                      Added: Summary Formula Notes
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.modItem}>
                    <Text style={[styles.modCheck, { color: theme.error }]}>✓</Text>
                    <Text style={[styles.modText, { color: theme.text }]}>
                      Added: AI Explanation (4 min video)
                    </Text>
                  </View>
                  <View style={styles.modItem}>
                    <Text style={[styles.modCheck, { color: theme.error }]}>✓</Text>
                    <Text style={[styles.modText, { color: theme.text }]}>
                      Added: 5 Step-by-Step Practice Questions
                    </Text>
                  </View>
                  <View style={styles.modItem}>
                    <Text style={[styles.modCheck, { color: theme.error }]}>✓</Text>
                    <Text style={[styles.modText, { color: theme.text }]}>
                      Scheduled: Checkpoint Retest
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Section 8: What We Recommend Next */}
          <Text style={[styles.sectionHeading, { color: theme.text }]}>
            What we recommend next
          </Text>

          <View style={styles.recommendedCardsList}>
            {recommendedResources.map((res) => (
              <View
                key={res.id}
                style={[
                  styles.recResourceItem,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder },
                ]}>
                <View style={styles.recItemTop}>
                  <View style={[styles.recIconCircle, { backgroundColor: theme.backgroundElement }]}>
                    <Text style={styles.recEmoji}>
                      {res.type === 'AI_VIDEO' ? '▶' : res.type === 'PRACTICE' ? '🧩' : '📝'}
                    </Text>
                  </View>
                  <View style={styles.recTitleCol}>
                    <Text style={[styles.recTitle, { color: theme.text }]}>
                      {res.title}
                    </Text>
                    <Text style={[styles.recMeta, { color: theme.textSecondary }]}>
                      {res.duration || '10 min'} • {res.difficulty || 'Beginner'}
                    </Text>
                  </View>
                </View>

                {res.recommendationReason && (
                  <Text style={[styles.recReason, { color: theme.textSecondary }]}>
                    {res.recommendationReason}
                  </Text>
                )}

                <Pressable
                  onPress={() => {
                    if (res.type === 'AI_VIDEO') {
                      router.push({
                        pathname: '/learning/video/[id]',
                        params: { id: topicId },
                      });
                    } else if (res.type === 'PRACTICE') {
                      router.push({
                        pathname: '/practice/[id]',
                        params: { id: topicId },
                      });
                    } else if (res.type === 'QUIZ') {
                      router.push({
                        pathname: '/quiz',
                        params: { topicId },
                      });
                    } else {
                      router.push({
                        pathname: '/learning-session/[id]',
                        params: { id: topicId },
                      });
                    }
                  }}
                  style={[styles.recItemBtn, { backgroundColor: theme.primaryLight }]}>
                  <Text style={[styles.recItemBtnText, { color: theme.primary }]}>
                    {res.type === 'AI_VIDEO'
                      ? 'Watch AI Explanation →'
                      : res.type === 'PRACTICE'
                      ? 'Practice Again →'
                      : res.type === 'QUIZ'
                      ? 'Retake Quiz →'
                      : 'Review Material →'}
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>

          {/* Action CTAs */}
          <View style={styles.bottomActionsSection}>
            {isHigh ? (
              <Pressable
                onPress={() => router.replace('/(tabs)/learning-path')}
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
                <Text style={styles.primaryBtnText}>Continue Learning →</Text>
              </Pressable>
            ) : isMid ? (
              <>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/practice/[id]',
                      params: { id: topicId },
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
                  accessibilityLabel="Practice Again">
                  <Text style={styles.primaryBtnText}>Practice Again →</Text>
                </Pressable>

                <Pressable
                  onPress={() => router.replace('/(tabs)/learning-path')}
                  style={[styles.secondaryBtn, { backgroundColor: theme.backgroundElement }]}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Continue to Learning Path">
                  <Text style={[styles.secondaryBtnText, { color: theme.text }]}>
                    Continue to Learning Path
                  </Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/learning/video/[id]',
                      params: { id: topicId },
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
                  accessibilityLabel="Watch AI Explanation">
                  <Text style={styles.primaryBtnText}>▶ Watch AI Explanation</Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/practice/[id]',
                      params: { id: topicId },
                    })
                  }
                  style={[styles.secondaryBtn, { backgroundColor: theme.backgroundElement }]}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Practice Again">
                  <Text style={[styles.secondaryBtnText, { color: theme.text }]}>
                    🧩 Practice Again
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/quiz',
                      params: { topicId },
                    })
                  }
                  style={[styles.secondaryBtn, { backgroundColor: theme.backgroundElement }]}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Retake Quiz">
                  <Text style={[styles.secondaryBtnText, { color: theme.text }]}>
                    📝 Retake Quiz
                  </Text>
                </Pressable>
              </>
            )}

            <Pressable
              onPress={() => router.replace('/(tabs)/home')}
              style={styles.homeLink}>
              <Text style={[styles.homeLinkText, { color: theme.textSecondary }]}>
                ← Back to Home Dashboard
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
    padding: Spacing.four,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
  },
  scenarioBar: {
    borderRadius: BorderRadius.card,
    padding: Spacing.three,
    borderWidth: 1,
    gap: 8,
  },
  scenarioBarLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  scenarioPillsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  scenarioPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scenarioPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  engineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    gap: 6,
  },
  badgeSparkle: {
    fontSize: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  scoreHeroCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.four,
    borderWidth: 2,
    alignItems: 'center',
    gap: Spacing.two,
    ...Shadows.primaryBtn,
    shadowOpacity: 0.12,
  },
  scoreTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '800',
    marginVertical: -4,
  },
  scoreFeedback: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: 4,
  },
  metricChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
  },
  metricChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  adaptiveBanner: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1.5,
    gap: Spacing.two,
  },
  adaptiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adaptiveIcon: {
    fontSize: 18,
  },
  adaptiveBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  adaptiveBannerDesc: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  modificationsList: {
    gap: 6,
    marginTop: 4,
  },
  modItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modCheck: {
    fontSize: 14,
    fontWeight: '800',
  },
  modText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeading: {
    ...Typography.h2,
    fontSize: 18,
    marginTop: Spacing.one,
  },
  recommendedCardsList: {
    gap: Spacing.three,
  },
  recResourceItem: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    gap: Spacing.two + 2,
    ...Shadows.card,
  },
  recItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  recIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recEmoji: {
    fontSize: 18,
  },
  recTitleCol: {
    flex: 1,
    gap: 2,
  },
  recTitle: {
    ...Typography.h3,
    fontSize: 16,
  },
  recMeta: {
    fontSize: 12,
    fontWeight: '600',
  },
  recReason: {
    fontSize: 13,
    lineHeight: 18,
  },
  recItemBtn: {
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recItemBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  bottomActionsSection: {
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
    height: 50,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  homeLink: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  homeLinkText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
