import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

export default function AssessmentScreen() {
  const router = useRouter();
  const theme = useTheme();

  const {
    goalTitle,
    goalIcon,
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    recordAnswer,
    finishAssessment,
  } = useAssessment();

  // Mode: 'intro' | 'testing'
  const [mode, setMode] = useState<'intro' | 'testing'>('intro');

  const totalQuestions = questions.length || 10;
  const currentQuestion = questions[currentQuestionIndex];
  const selectedOptionIndex = answers[currentQuestionIndex];
  const isAnswerSelected = selectedOptionIndex !== undefined;

  const handleStart = () => {
    setMode('testing');
  };

  const handleSelectOption = (optionIdx: number) => {
    recordAnswer(currentQuestionIndex, optionIdx);
  };

  const handleNext = () => {
    if (!isAnswerSelected) return;

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Final question answered - calculate scores and navigate to summary
      finishAssessment();
      router.push('/onboarding/assessment-result');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      setMode('intro');
    }
  };

  // Render Intro Mode
  if (mode === 'intro') {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {/* Target Goal Pill */}
            <View style={styles.pillRow}>
              <View style={[styles.targetPill, { backgroundColor: theme.primaryLight }]}>
                <Text style={styles.targetIcon}>{goalIcon}</Text>
                <Text style={[styles.targetText, { color: theme.primary }]}>
                  Goal: {goalTitle}
                </Text>
              </View>
            </View>

            {/* Intro Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.text }]}>
                Let's understand your current level
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                This short assessment helps us build a learning path that matches your current skills.
              </Text>
            </View>

            {/* Assessment Diagnostics Card */}
            <View
              style={[
                styles.infoCard,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.cardTag, { color: theme.primary }]}>
                  AI DIAGNOSTIC CHECK
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: theme.successLight }]}>
                  <Text style={[styles.statusText, { color: theme.success }]}>● Ready</Text>
                </View>
              </View>

              <View style={styles.infoList}>
                <View style={styles.infoRow}>
                  <View style={[styles.infoIconBox, { backgroundColor: theme.primaryLight }]}>
                    <Text style={styles.infoEmoji}>⏱</Text>
                  </View>
                  <View style={styles.infoTextGroup}>
                    <Text style={[styles.infoHeading, { color: theme.text }]}>
                      About 5 minutes
                    </Text>
                    <Text style={[styles.infoSubtext, { color: theme.textSecondary }]}>
                      Short, focused questions that respect your time
                    </Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />

                <View style={styles.infoRow}>
                  <View style={[styles.infoIconBox, { backgroundColor: theme.accentLight }]}>
                    <Text style={styles.infoEmoji}>📝</Text>
                  </View>
                  <View style={styles.infoTextGroup}>
                    <Text style={[styles.infoHeading, { color: theme.text }]}>
                      10 questions
                    </Text>
                    <Text style={[styles.infoSubtext, { color: theme.textSecondary }]}>
                      One question at a time across essential core competencies
                    </Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />

                <View style={styles.infoRow}>
                  <View style={[styles.infoIconBox, { backgroundColor: theme.successLight }]}>
                    <Text style={styles.infoEmoji}>🎯</Text>
                  </View>
                  <View style={styles.infoTextGroup}>
                    <Text style={[styles.infoHeading, { color: theme.text }]}>
                      Used to personalize your roadmap
                    </Text>
                    <Text style={[styles.infoSubtext, { color: theme.textSecondary }]}>
                      Bypasses topics you know; identifies where to start
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Rationale note */}
            <View
              style={[
                styles.noteBox,
                { backgroundColor: theme.backgroundElement, borderColor: theme.cardBorder },
              ]}>
              <Text style={styles.noteIcon}>💡</Text>
              <Text style={[styles.noteText, { color: theme.textSecondary }]}>
                No pressure! This is not a graded exam. If you are unsure about a question, make your best guess.
              </Text>
            </View>

            {/* Primary Action Button */}
            <View style={styles.bottomSection}>
              <Pressable
                onPress={handleStart}
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
                accessibilityLabel="Start Assessment">
                <Text style={styles.primaryButtonText}>Start Assessment</Text>
                <Text style={styles.primaryButtonArrow}>→</Text>
              </Pressable>

              <Pressable
                onPress={() => router.back()}
                style={styles.backButton}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Back to Goal Selection">
                <Text style={[styles.backText, { color: theme.textSecondary }]}>
                  ← Change Goal
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Render Testing Mode (One question at a time)
  if (!currentQuestion) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.container}>
          <Text style={[styles.title, { color: theme.text }]}>No questions found.</Text>
          <Pressable onPress={() => setMode('intro')} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Return to Intro</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const progressPercentage = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Top Progress Counter */}
          <View style={styles.progressSection}>
            <View style={styles.progressRow}>
              <Text style={[styles.progressCount, { color: theme.text }]}>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </Text>
              <View style={[styles.skillBadge, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.skillBadgeText, { color: theme.primary }]}>
                  {currentQuestion.skill}
                </Text>
              </View>
            </View>

            {/* Visual Progress Bar */}
            <View style={[styles.progressBarTrack, { backgroundColor: theme.backgroundElement }]}>
              <View
                style={[
                  styles.progressBarFill,
                  { backgroundColor: theme.primary, width: `${progressPercentage}%` },
                ]}
              />
            </View>
          </View>

          {/* Question Box */}
          <View
            style={[
              styles.questionCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={[styles.questionDifficulty, { color: theme.textMuted }]}>
              Difficulty: {currentQuestion.difficulty}
            </Text>
            <Text style={[styles.questionPrompt, { color: theme.text }]}>
              {currentQuestion.question}
            </Text>
          </View>

          {/* Answer Choice Cards */}
          <View style={styles.optionsList}>
            {currentQuestion.options.map((optionText, optIdx) => {
              const isSelected = selectedOptionIndex === optIdx;
              const letter = String.fromCharCode(65 + optIdx);

              return (
                <Pressable
                  key={optIdx}
                  onPress={() => handleSelectOption(optIdx)}
                  style={({ pressed }) => [
                    styles.optionCard,
                    {
                      backgroundColor: isSelected ? theme.primaryLight : theme.card,
                      borderColor: isSelected ? theme.primary : theme.cardBorder,
                      borderWidth: isSelected ? 2 : 1,
                      transform: [{ scale: pressed ? 0.99 : 1 }],
                    },
                  ]}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Option ${letter}: ${optionText}`}
                  accessibilityState={{ selected: isSelected }}>
                  <View style={styles.optionRow}>
                    {/* Circle Indicator */}
                    <View
                      style={[
                        styles.radioIndicator,
                        {
                          borderColor: isSelected ? theme.primary : theme.cardBorder,
                          backgroundColor: isSelected ? theme.primary : 'transparent',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.radioLetter,
                          { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                        ]}>
                        {letter}
                      </Text>
                    </View>

                    {/* Option Text */}
                    <Text
                      style={[
                        styles.optionText,
                        { color: theme.text },
                        isSelected && { fontWeight: '600' },
                      ]}>
                      {optionText}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Navigational Controls */}
          <View style={styles.bottomSection}>
            <Pressable
              onPress={handleNext}
              disabled={!isAnswerSelected}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: theme.primary,
                  opacity: !isAnswerSelected ? 0.45 : pressed ? 0.92 : 1,
                  transform: [{ scale: pressed && isAnswerSelected ? 0.985 : 1 }],
                },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={isLastQuestion ? 'Finish Assessment' : 'Next Question'}
              accessibilityState={{ disabled: !isAnswerSelected }}>
              <Text style={styles.primaryButtonText}>
                {isLastQuestion ? 'Finish Assessment' : 'Next Question'}
              </Text>
              <Text style={styles.primaryButtonArrow}>→</Text>
            </Pressable>

            <Pressable
              onPress={handlePrevious}
              style={styles.backButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Go to previous question">
              <Text style={[styles.backText, { color: theme.textSecondary }]}>
                {currentQuestionIndex > 0 ? '← Previous Question' : '← Back to Intro'}
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
  },
  pillRow: {
    marginBottom: Spacing.two,
  },
  targetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    gap: 8,
  },
  targetIcon: {
    fontSize: 16,
  },
  targetText: {
    fontSize: 13,
    fontWeight: '700',
  },
  header: {
    marginBottom: Spacing.four,
  },
  title: {
    ...Typography.h1,
    marginBottom: Spacing.two,
  },
  subtitle: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  infoCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
    marginBottom: Spacing.four,
    gap: Spacing.three,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTag: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  infoList: {
    gap: Spacing.three,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  infoIconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoEmoji: {
    fontSize: 20,
  },
  infoTextGroup: {
    flex: 1,
    gap: 2,
  },
  infoHeading: {
    fontSize: 15,
    fontWeight: '700',
  },
  infoSubtext: {
    fontSize: 13,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  noteBox: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  noteIcon: {
    fontSize: 20,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  progressSection: {
    marginBottom: Spacing.four,
    gap: Spacing.two,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressCount: {
    fontSize: 16,
    fontWeight: '800',
  },
  skillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  skillBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  questionCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    marginBottom: Spacing.four,
    ...Shadows.card,
    gap: 6,
  },
  questionDifficulty: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionPrompt: {
    ...Typography.h2,
    fontSize: 18,
    lineHeight: 26,
  },
  optionsList: {
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  optionCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    ...Shadows.card,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  radioIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioLetter: {
    fontSize: 14,
    fontWeight: '800',
  },
  optionText: {
    flex: 1,
    ...Typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  bottomSection: {
    gap: Spacing.three,
    marginTop: Spacing.one,
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
  backButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
