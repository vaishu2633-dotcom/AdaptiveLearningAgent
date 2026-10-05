import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
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
import { getPracticeQuestionsForTopic } from '@/data/learningResources';
import { useTheme } from '@/hooks/use-theme';

export default function PracticeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { roadmap } = useAssessment();

  const topicId = typeof id === 'string' ? id : 'ds-5';

  const topic = useMemo(() => {
    return roadmap.find((t) => t.id === topicId) || {
      id: topicId,
      number: 5,
      title: 'Statistics Fundamentals',
      shortDescription: 'Build the foundation you need for data analysis and machine learning.',
    };
  }, [topicId, roadmap]);

  const questions = useMemo(() => {
    return getPracticeQuestionsForTopic(topicId, topic.title);
  }, [topicId, topic.title]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQuestion = questions[currentIndex] || questions[0];
  const selectedOption = selectedAnswers[currentIndex];
  const hasAnsweredCurrent = selectedOption !== undefined;
  const isCurrentCorrect =
    hasAnsweredCurrent && selectedOption === currentQuestion.correctAnswerIndex;

  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Score calculation
  const correctCount = useMemo(() => {
    return Object.entries(selectedAnswers).reduce((count, [qIdxStr, ansIdx]) => {
      const qIdx = parseInt(qIdxStr, 10);
      const q = questions[qIdx];
      if (q && q.correctAnswerIndex === ansIdx) {
        return count + 1;
      }
      return count;
    }, 0);
  }, [selectedAnswers, questions]);

  const handleSelectOption = (optIdx: number) => {
    if (hasAnsweredCurrent) return; // Freeze selection once chosen
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIdx,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
  };

  const handleGoToQuiz = () => {
    router.push({
      pathname: '/quiz',
      params: { topicId },
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Top Header Row */}
          <View style={styles.topHeader}>
            <View style={[styles.practiceBadge, { backgroundColor: theme.accentLight }]}>
              <Text style={styles.practiceBadgeEmoji}>🧩</Text>
              <Text style={[styles.practiceBadgeText, { color: theme.accent }]}>
                QUICK PRACTICE
              </Text>
            </View>

            <View style={[styles.topicChip, { backgroundColor: theme.backgroundElement }]}>
              <Text style={[styles.topicChipText, { color: theme.textSecondary }]}>
                {topic.title}
              </Text>
            </View>
          </View>

          {isFinished ? (
            /* Practice Completed Summary View */
            <View
              style={[
                styles.summaryCard,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}>
              <View style={[styles.trophyCircle, { backgroundColor: theme.primaryLight }]}>
                <Text style={styles.trophyEmoji}>🎉</Text>
              </View>

              <Text style={[styles.summaryTitle, { color: theme.text }]}>
                Practice Complete!
              </Text>

              <Text style={[styles.summarySubtitle, { color: theme.textSecondary }]}>
                You checked your understanding for {topic.title}.
              </Text>

              {/* Score Display Card */}
              <View
                style={[
                  styles.scoreBox,
                  { backgroundColor: theme.backgroundElement, borderColor: theme.cardBorder },
                ]}>
                <Text style={[styles.scoreBig, { color: theme.primary }]}>
                  {correctCount} / {totalQuestions}
                </Text>
                <Text style={[styles.scoreLabel, { color: theme.textSecondary }]}>
                  Questions Correct ({Math.round((correctCount / totalQuestions) * 100)}%)
                </Text>
              </View>

              {/* Readiness Prompt */}
              <View
                style={[
                  styles.quizPromptCard,
                  { backgroundColor: theme.primaryLight, borderColor: theme.primary },
                ]}>
                <Text style={styles.quizPromptIcon}>📝</Text>
                <View style={styles.quizPromptContent}>
                  <Text style={[styles.quizPromptHeading, { color: theme.primaryDark }]}>
                    Ready for the quiz?
                  </Text>
                  <Text style={[styles.quizPromptSub, { color: theme.primaryDark }]}>
                    Take the checkpoint quiz to officially advance this topic on your adaptive roadmap.
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.summaryActions}>
                <Pressable
                  onPress={handleGoToQuiz}
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
                  accessibilityLabel="Take Quiz">
                  <Text style={styles.primaryBtnText}>Take Quiz →</Text>
                </Pressable>

                <Pressable
                  onPress={handleRestart}
                  style={[styles.secondaryBtn, { backgroundColor: theme.backgroundElement }]}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Practice Again">
                  <Text style={[styles.secondaryBtnText, { color: theme.text }]}>
                    ↻ Practice Again
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            /* Active Practice Question View */
            <>
              {/* Progress Bar & Counter */}
              <View style={styles.progressSection}>
                <View style={styles.progressRow}>
                  <Text style={[styles.questionCounter, { color: theme.textSecondary }]}>
                    Question {currentIndex + 1} of {totalQuestions}
                  </Text>
                  <Text style={[styles.activeStatus, { color: theme.primary }]}>
                    Active Practice
                  </Text>
                </View>

                <View style={[styles.progressBarBg, { backgroundColor: theme.backgroundElement }]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${progressPercent}%`, backgroundColor: theme.primary },
                    ]}
                  />
                </View>
              </View>

              {/* Question Statement Box */}
              <View
                style={[
                  styles.questionCard,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder },
                ]}>
                <Text style={[styles.questionTitle, { color: theme.text }]}>
                  {currentQuestion.question}
                </Text>
              </View>

              {/* Options List */}
              <View style={styles.optionsList}>
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isOptionCorrect = optIdx === currentQuestion.correctAnswerIndex;
                  const letter = String.fromCharCode(65 + optIdx);

                  let optBg: string = theme.card;
                  let optBorder: string = theme.cardBorder;
                  let optTextColor: string = theme.text;

                  if (hasAnsweredCurrent) {
                    if (isOptionCorrect) {
                      optBg = theme.successLight;
                      optBorder = theme.success;
                      optTextColor = theme.success;
                    } else if (isSelected && !isCurrentCorrect) {
                      optBg = theme.errorLight;
                      optBorder = theme.error;
                      optTextColor = theme.error;
                    }
                  } else if (isSelected) {
                    optBg = theme.primaryLight;
                    optBorder = theme.primary;
                    optTextColor = theme.primary;
                  }

                  return (
                    <Pressable
                      key={optIdx}
                      disabled={hasAnsweredCurrent}
                      onPress={() => handleSelectOption(optIdx)}
                      style={({ pressed }) => [
                        styles.optionCard,
                        {
                          backgroundColor: optBg,
                          borderColor: optBorder,
                          borderWidth: isSelected || (hasAnsweredCurrent && isOptionCorrect) ? 2 : 1,
                          opacity: pressed && !hasAnsweredCurrent ? 0.9 : 1,
                        },
                      ]}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={`Option ${letter}: ${opt}`}>
                      <View
                        style={[
                          styles.letterCircle,
                          {
                            backgroundColor: isSelected
                              ? theme.primary
                              : theme.backgroundElement,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.letterText,
                            {
                              color: isSelected ? '#FFFFFF' : theme.textSecondary,
                            },
                          ]}>
                          {letter}
                        </Text>
                      </View>
                      <Text style={[styles.optionText, { color: optTextColor }]}>
                        {opt}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Real-time Feedback Card */}
              {hasAnsweredCurrent && (
                <View
                  style={[
                    styles.feedbackBox,
                    {
                      backgroundColor: isCurrentCorrect
                        ? theme.successLight
                        : theme.errorLight,
                      borderColor: isCurrentCorrect ? theme.success : theme.error,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.feedbackHeading,
                      { color: isCurrentCorrect ? theme.success : theme.error },
                    ]}>
                    {isCurrentCorrect
                      ? '✓ Great! Correct answer.'
                      : '✗ Not quite. Review the explanation:'}
                  </Text>
                  <Text style={[styles.feedbackDetail, { color: theme.text }]}>
                    {currentQuestion.explanation}
                  </Text>
                </View>
              )}

              {/* Bottom Next Question CTA */}
              {hasAnsweredCurrent && (
                <Pressable
                  onPress={handleNext}
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
                  accessibilityLabel="Next Question">
                  <Text style={styles.primaryBtnText}>
                    {currentIndex === totalQuestions - 1
                      ? 'View Practice Result →'
                      : 'Next Question →'}
                  </Text>
                </Pressable>
              )}
            </>
          )}
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  practiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
    gap: 6,
  },
  practiceBadgeEmoji: {
    fontSize: 13,
  },
  practiceBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  topicChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
  },
  topicChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressSection: {
    gap: 8,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questionCounter: {
    fontSize: 14,
    fontWeight: '700',
  },
  activeStatus: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  questionCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
  },
  questionTitle: {
    ...Typography.h2,
    fontSize: 18,
    lineHeight: 25,
  },
  optionsList: {
    gap: Spacing.two + 3,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    gap: Spacing.three,
    minHeight: 52,
    ...Shadows.card,
  },
  letterCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterText: {
    fontSize: 14,
    fontWeight: '800',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  feedbackBox: {
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 4,
  },
  feedbackHeading: {
    fontSize: 14,
    fontWeight: '800',
  },
  feedbackDetail: {
    fontSize: 13,
    lineHeight: 19,
  },
  primaryBtn: {
    height: 56,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.one,
    ...Shadows.primaryBtn,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  summaryCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.three,
    ...Shadows.card,
  },
  trophyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyEmoji: {
    fontSize: 30,
  },
  summaryTitle: {
    ...Typography.h1,
    fontSize: 22,
    textAlign: 'center',
  },
  summarySubtitle: {
    ...Typography.body,
    fontSize: 14,
    textAlign: 'center',
  },
  scoreBox: {
    width: '100%',
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  scoreBig: {
    fontSize: 32,
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  quizPromptCard: {
    width: '100%',
    flexDirection: 'row',
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    gap: Spacing.two,
    alignItems: 'center',
  },
  quizPromptIcon: {
    fontSize: 22,
  },
  quizPromptContent: {
    flex: 1,
    gap: 2,
  },
  quizPromptHeading: {
    fontSize: 14,
    fontWeight: '800',
  },
  quizPromptSub: {
    fontSize: 12,
    lineHeight: 17,
  },
  summaryActions: {
    width: '100%',
    gap: Spacing.two + 2,
    marginTop: Spacing.two,
  },
  secondaryBtn: {
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
