import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdaptiveRecommendationCard } from '@/components/AdaptiveRecommendationCard';
import {
  BorderRadius,
  MaxContentWidth,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useAssessment } from '@/context/assessment-context';
import { getMockTopicById } from '@/data/mockTopics';
import { useTheme } from '@/hooks/use-theme';
import { getAdaptiveRecommendation } from '@/services/adaptiveService';
import { submitQuizAttempt } from '@/services/api';

export default function QuizResultScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams<{
    topicId?: string;
    score?: string;
    correctCount?: string;
    totalQuestions?: string;
  }>();

  const { recordTopicQuizScore, roadmap } = useAssessment();

  const topicId = params.topicId || 'ds-probability';
  const topic = useMemo(() => getMockTopicById(topicId), [topicId]);

  const initialScore = params.score ? parseInt(params.score, 10) : 72;
  const initialCorrect = params.correctCount ? parseInt(params.correctCount, 10) : 6;
  const initialTotal = params.totalQuestions ? parseInt(params.totalQuestions, 10) : 8;

  // Active score state (allows interactive testing between 90%, 70%, 40%)
  const [activeScore, setActiveScore] = useState<number>(initialScore);
  const [correctCount, setCorrectCount] = useState<number>(initialCorrect);
  const totalQuestions = initialTotal;

  // Sync to context on mount and whenever activeScore changes
  useEffect(() => {
    recordTopicQuizScore(topic.id, activeScore);
    submitQuizAttempt('learner-demo-1', {
      topic_id: topic.id,
      score: activeScore,
      total_questions: totalQuestions,
      correct_answers: correctCount,
    }).catch(() => {});
  }, [activeScore, topic.id, recordTopicQuizScore, totalQuestions, correctCount]);

  const recommendation = useMemo(() => {
    return getAdaptiveRecommendation(activeScore);
  }, [activeScore]);

  const handleSimulateScenario = (simScore: number, simCorrect: number) => {
    setActiveScore(simScore);
    setCorrectCount(simCorrect);
  };

  const isMastered = activeScore >= 80;
  const isPractice = activeScore >= 60 && activeScore < 80;
  const isReview = activeScore < 60;

  const scoreBadgeColor = isMastered
    ? theme.success
    : isPractice
    ? theme.warning
    : theme.primary;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <Pressable
              onPress={() => router.push('/(tabs)/learning-path')}
              style={[styles.backBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="To Learning Path">
              <Text style={[styles.backBtnText, { color: theme.text }]}>← Learning Path</Text>
            </Pressable>
            <View style={[styles.badgePill, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.badgePillText, { color: theme.primary }]}>EVALUATION</Text>
            </View>
          </View>

          {/* Interactive Scenario Testing Switcher for Review & Verification */}
          <View
            style={[
              styles.scenarioBar,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={[styles.scenarioLabel, { color: theme.textSecondary }]}>
              Test Adaptive Outcome:
            </Text>
            <View style={styles.scenarioPillsRow}>
              <Pressable
                onPress={() => handleSimulateScenario(90, Math.round(totalQuestions * 0.9))}
                style={[
                  styles.scenarioPill,
                  { backgroundColor: isMastered ? theme.success : theme.backgroundElement },
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Simulate 90% score">
                <Text
                  style={[
                    styles.scenarioPillText,
                    { color: isMastered ? '#FFFFFF' : theme.text },
                  ]}>
                  90% (Mastered)
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleSimulateScenario(70, Math.round(totalQuestions * 0.7))}
                style={[
                  styles.scenarioPill,
                  { backgroundColor: isPractice ? theme.warning : theme.backgroundElement },
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Simulate 70% score">
                <Text
                  style={[
                    styles.scenarioPillText,
                    { color: isPractice ? '#FFFFFF' : theme.text },
                  ]}>
                  70% (Practice)
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleSimulateScenario(40, Math.round(totalQuestions * 0.4))}
                style={[
                  styles.scenarioPill,
                  { backgroundColor: isReview ? theme.primary : theme.backgroundElement },
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Simulate 40% score">
                <Text
                  style={[
                    styles.scenarioPillText,
                    { color: isReview ? '#FFFFFF' : theme.text },
                  ]}>
                  40% (Review)
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Primary Result Card */}
          <View
            style={[
              styles.resultCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={[styles.headerHeading, { color: theme.textSecondary }]}>
              {topic.title} • Performance
            </Text>
            <Text style={[styles.resultTitle, { color: theme.text }]}>Your Result</Text>

            {/* Score Ring / Display */}
            <View style={styles.scoreDisplayBox}>
              <Text style={[styles.scoreNumber, { color: scoreBadgeColor }]}>
                {activeScore}%
              </Text>
              <Text style={[styles.scoreStatusLabel, { color: scoreBadgeColor }]}>
                {isMastered
                  ? 'Mastery Confirmed'
                  : isPractice
                  ? 'Nearly There'
                  : 'Needs Conceptual Review'}
              </Text>
            </View>

            {/* Subtitle / Feedback Text */}
            <Text style={[styles.resultMessage, { color: theme.textSecondary }]}>
              {isMastered
                ? 'Outstanding performance! You displayed exceptional grasp of core principles.'
                : isPractice
                ? 'Good progress! You understand the basics, but this topic needs a little more practice.'
                : 'This topic needs more attention before you move forward. Let our AI tutor guide your revision.'}
            </Text>

            {/* Metric Breakdown Stats */}
            <View style={styles.metricsRow}>
              <View
                style={[
                  styles.metricBox,
                  { backgroundColor: theme.backgroundElement, borderColor: theme.cardBorder },
                ]}>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                  Correct Answers
                </Text>
                <Text style={[styles.metricVal, { color: theme.text }]}>
                  {correctCount} / {totalQuestions}
                </Text>
              </View>

              <View
                style={[
                  styles.metricBox,
                  { backgroundColor: theme.backgroundElement, borderColor: theme.cardBorder },
                ]}>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                  Mastery Level
                </Text>
                <Text style={[styles.metricVal, { color: scoreBadgeColor }]}>
                  {activeScore}%
                </Text>
              </View>
            </View>
          </View>

          {/* Reusable Adaptive Recommendation Card */}
          <AdaptiveRecommendationCard
            score={activeScore}
            topicTitle={topic.title}
            recommendation={recommendation}
            onContinue={() => router.push('/(tabs)/learning-path')}
            onPractice={() =>
              router.push({
                pathname: '/learning/topic/[topicId]/practice',
                params: { topicId: topic.id },
              })
            }
            onQuiz={() =>
              router.push({
                pathname: '/learning/topic/[topicId]/quiz',
                params: { topicId: topic.id },
              })
            }
            onAiExplanation={() =>
              router.push({
                pathname: '/learning/topic/[topicId]/ai-explanation',
                params: { topicId: topic.id },
              })
            }
            onVideo={() =>
              router.push({
                pathname: '/learning/topic/[topicId]/video',
                params: { topicId: topic.id },
              })
            }
            onReview={() =>
              router.push({
                pathname: '/learning/topic/[topicId]/ai-explanation',
                params: { topicId: topic.id },
              })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  backBtn: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  backBtnText: {
    ...Typography.subtext,
    fontWeight: '600',
  },
  badgePill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
  },
  badgePillText: {
    ...Typography.caption,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scenarioBar: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.three,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  scenarioLabel: {
    ...Typography.caption,
    fontWeight: '700',
    marginBottom: Spacing.two,
    textTransform: 'uppercase',
  },
  scenarioPillsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  scenarioPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scenarioPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  resultCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.five,
    borderWidth: 1,
    marginBottom: Spacing.three,
    alignItems: 'center',
    ...Shadows.card,
  },
  headerHeading: {
    ...Typography.caption,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  resultTitle: {
    ...Typography.h1,
    marginBottom: Spacing.three,
  },
  scoreDisplayBox: {
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: '900',
    lineHeight: 62,
    letterSpacing: -1,
  },
  scoreStatusLabel: {
    ...Typography.bodyBold,
    marginTop: 2,
  },
  resultMessage: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.four,
    maxWidth: 340,
    lineHeight: 22,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    width: '100%',
  },
  metricBox: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  metricLabel: {
    ...Typography.caption,
    marginBottom: 4,
  },
  metricVal: {
    ...Typography.h2,
    fontSize: 18,
    fontWeight: '800',
  },
});
