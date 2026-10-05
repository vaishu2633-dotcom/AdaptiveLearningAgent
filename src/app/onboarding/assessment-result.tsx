import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
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

export default function AssessmentResultScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { result, finishAssessment, goalTitle, resetAssessment } = useAssessment();

  // If user lands directly without finishing, calculate now
  useEffect(() => {
    if (!result) {
      finishAssessment();
    }
  }, [result, finishAssessment]);

  const activeResult = result || {
    overallScore: 70,
    correctAnswersCount: 7,
    totalQuestions: 10,
    skillScores: [
      { skill: 'Core Concepts', correctCount: 2, totalCount: 2, percentage: 100 },
      { skill: 'Practical Applications', correctCount: 3, totalCount: 4, percentage: 75 },
      { skill: 'System Architecture', correctCount: 2, totalCount: 4, percentage: 50 },
    ],
    strengths: ['Core Concepts Fundamentals', 'Applied Problem Solving'],
    focusAreas: ['System Architecture & Edge Cases'],
    goalId: 'data-scientist',
    goalTitle: goalTitle || 'Data Scientist',
  };

  const handleBuildPath = () => {
    // Navigate to the learning-path tab
    router.replace('/(tabs)/learning-path');
  };

  const handleRetake = () => {
    resetAssessment();
    router.replace('/onboarding/assessment');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Header Tag */}
          <View style={styles.pillRow}>
            <View style={[styles.completeBadge, { backgroundColor: theme.successLight }]}>
              <Text style={styles.completeIcon}>✓</Text>
              <Text style={[styles.completeText, { color: theme.success }]}>
                DIAGNOSTIC COMPLETE
              </Text>
            </View>
          </View>

          {/* Title & Subtitle */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Your Skill Snapshot</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              We'll use these results to personalize your learning path for {activeResult.goalTitle}.
            </Text>
          </View>

          {/* Overall Readiness Card */}
          <View
            style={[
              styles.overallCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <View style={styles.overallHeader}>
              <View>
                <Text style={[styles.overallLabel, { color: theme.textSecondary }]}>
                  Overall Readiness
                </Text>
                <Text style={[styles.overallPercent, { color: theme.primary }]}>
                  {activeResult.overallScore}%
                </Text>
              </View>
              <View style={[styles.scoreChip, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.scoreChipText, { color: theme.primary }]}>
                  {activeResult.correctAnswersCount} / {activeResult.totalQuestions} Correct
                </Text>
              </View>
            </View>

            {/* Overall Progress Bar */}
            <View style={[styles.overallBarTrack, { backgroundColor: theme.backgroundElement }]}>
              <View
                style={[
                  styles.overallBarFill,
                  { backgroundColor: theme.primary, width: `${Math.max(activeResult.overallScore, 8)}%` },
                ]}
              />
            </View>

            <Text style={[styles.overallSummary, { color: theme.textSecondary }]}>
              Diagnostic baseline calibrated. The AI will start you at Module 2 and bypass redundant basics.
            </Text>
          </View>

          {/* Skill Breakdown Card */}
          <View
            style={[
              styles.skillsCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Skill Categories
            </Text>

            <View style={styles.skillList}>
              {activeResult.skillScores.map((scoreItem, idx) => {
                const isHigh = scoreItem.percentage >= 70;
                const isMid = scoreItem.percentage >= 50 && scoreItem.percentage < 70;
                const scoreColor = isHigh ? theme.success : isMid ? theme.primary : theme.warning;

                return (
                  <View key={idx} style={styles.skillRow}>
                    <View style={styles.skillRowHeader}>
                      <Text style={[styles.skillName, { color: theme.text }]}>
                        {scoreItem.skill}
                      </Text>
                      <Text style={[styles.skillScoreVal, { color: scoreColor }]}>
                        {scoreItem.percentage}%
                      </Text>
                    </View>

                    {/* Mini Progress Bar */}
                    <View style={[styles.miniTrack, { backgroundColor: theme.backgroundElement }]}>
                      <View
                        style={[
                          styles.miniTrackFill,
                          {
                            backgroundColor: scoreColor,
                            width: `${Math.max(scoreItem.percentage, 6)}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Strengths & Focus Areas Side by Side / Stacked */}
          <View style={styles.insightsSection}>
            {/* Strengths */}
            <View
              style={[
                styles.insightBox,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}>
              <View style={styles.insightHeader}>
                <View style={[styles.circleBadge, { backgroundColor: theme.successLight }]}>
                  <Text style={[styles.circleCheck, { color: theme.success }]}>✓</Text>
                </View>
                <Text style={[styles.insightTitle, { color: theme.text }]}>Your strengths</Text>
              </View>
              <View style={styles.insightItemsList}>
                {activeResult.strengths.map((str, idx) => (
                  <View key={idx} style={styles.bulletItem}>
                    <Text style={[styles.bulletSign, { color: theme.success }]}>✓</Text>
                    <Text style={[styles.bulletText, { color: theme.textSecondary }]}>
                      {str}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* We'll focus more on */}
            <View
              style={[
                styles.insightBox,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}>
              <View style={styles.insightHeader}>
                <View style={[styles.circleBadge, { backgroundColor: theme.accentLight }]}>
                  <Text style={[styles.circleArrow, { color: theme.accent }]}>→</Text>
                </View>
                <Text style={[styles.insightTitle, { color: theme.text }]}>
                  We'll focus more on
                </Text>
              </View>
              <View style={styles.insightItemsList}>
                {activeResult.focusAreas.map((foc, idx) => (
                  <View key={idx} style={styles.bulletItem}>
                    <Text style={[styles.bulletSign, { color: theme.accent }]}>→</Text>
                    <Text style={[styles.bulletText, { color: theme.textSecondary }]}>
                      {foc}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Key Adaptive Message Card: "Your path won't stay fixed" */}
          <View
            style={[
              styles.adaptiveCard,
              {
                backgroundColor: theme.primaryLight,
                borderColor: theme.primary,
              },
            ]}>
            <View style={styles.adaptiveCardHeader}>
              <Text style={styles.adaptiveCardSparkle}>⚡</Text>
              <Text style={[styles.adaptiveCardTitle, { color: theme.primaryDark }]}>
                Your path won't stay fixed.
              </Text>
            </View>

            <Text style={[styles.adaptiveCardDesc, { color: theme.primaryDark }]}>
              As you learn and complete quizzes, your AI learning path will adjust based on your performance.
            </Text>

            {/* Flow diagram: Assess -> Learn -> Quiz -> Adapt */}
            <View style={styles.flowDiagram}>
              <View style={[styles.flowPill, { backgroundColor: '#FFFFFF' }]}>
                <Text style={[styles.flowPillText, { color: theme.primary }]}>Assess</Text>
              </View>
              <Text style={[styles.flowArrow, { color: theme.primary }]}>→</Text>
              <View style={[styles.flowPill, { backgroundColor: '#FFFFFF' }]}>
                <Text style={[styles.flowPillText, { color: theme.primary }]}>Learn</Text>
              </View>
              <Text style={[styles.flowArrow, { color: theme.primary }]}>→</Text>
              <View style={[styles.flowPill, { backgroundColor: '#FFFFFF' }]}>
                <Text style={[styles.flowPillText, { color: theme.primary }]}>Quiz</Text>
              </View>
              <Text style={[styles.flowArrow, { color: theme.primary }]}>→</Text>
              <View style={[styles.flowPill, { backgroundColor: theme.primary }]}>
                <Text style={[styles.flowPillText, { color: '#FFFFFF' }]}>Adapt</Text>
              </View>
            </View>
          </View>

          {/* Primary CTA */}
          <View style={styles.bottomSection}>
            <Pressable
              onPress={handleBuildPath}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: theme.primary,
                  opacity: pressed ? 0.92 : 1,
                  transform: [{ scale: pressed ? 0.985 : 1 }],
                },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Build My Learning Path">
              <Text style={styles.primaryButtonText}>Build My Learning Path</Text>
              <Text style={styles.primaryButtonArrow}>→</Text>
            </Pressable>

            <Pressable
              onPress={handleRetake}
              style={styles.retakeButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Retake Diagnostic Assessment">
              <Text style={[styles.retakeText, { color: theme.textSecondary }]}>
                ↻ Retake Assessment
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
  pillRow: {
    marginBottom: -4,
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
    gap: 6,
  },
  completeIcon: {
    fontSize: 13,
    fontWeight: '800',
  },
  completeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
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
  overallCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
    gap: Spacing.two,
  },
  overallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  overallPercent: {
    fontSize: 36,
    fontWeight: '800',
    marginTop: 2,
  },
  scoreChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
  },
  scoreChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  overallBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  overallBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  overallSummary: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  skillsCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
    gap: Spacing.three,
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: 18,
  },
  skillList: {
    gap: Spacing.three,
  },
  skillRow: {
    gap: 6,
  },
  skillRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillName: {
    fontSize: 14,
    fontWeight: '600',
  },
  skillScoreVal: {
    fontSize: 14,
    fontWeight: '700',
  },
  miniTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  miniTrackFill: {
    height: '100%',
    borderRadius: 3,
  },
  insightsSection: {
    gap: Spacing.three,
  },
  insightBox: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
    gap: Spacing.two,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  circleBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCheck: {
    fontSize: 14,
    fontWeight: '800',
  },
  circleArrow: {
    fontSize: 14,
    fontWeight: '800',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  insightItemsList: {
    gap: 6,
    paddingLeft: 4,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulletSign: {
    fontSize: 14,
    fontWeight: '700',
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  adaptiveCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1.5,
    gap: Spacing.two,
  },
  adaptiveCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adaptiveCardSparkle: {
    fontSize: 18,
  },
  adaptiveCardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  adaptiveCardDesc: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  flowDiagram: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
    paddingVertical: 4,
  },
  flowPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    ...Shadows.card,
  },
  flowPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  flowArrow: {
    fontSize: 16,
    fontWeight: '800',
  },
  bottomSection: {
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  primaryButton: {
    height: 56,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.primaryBtn,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  primaryButtonArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  retakeButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
