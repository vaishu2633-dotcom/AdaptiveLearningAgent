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
import { getMockTopicById } from '@/data/mockTopics';
import { useTheme } from '@/hooks/use-theme';

export default function TopicPracticeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { topicId: rawTopicId } = useLocalSearchParams<{ topicId?: string }>();
  const { updateTopicProgress } = useAssessment();

  const topicId = typeof rawTopicId === 'string' && rawTopicId.trim() ? rawTopicId : 'ds-probability';
  const topic = useMemo(() => getMockTopicById(topicId), [topicId]);

  const questions = topic.practiceQuestions && topic.practiceQuestions.length > 0
    ? topic.practiceQuestions
    : [
        {
          id: 'p-default-1',
          question: 'A fair coin is tossed once. What is the probability of getting Heads?',
          options: ['0', '1/4', '1/2', '1'],
          correctAnswerIndex: 2,
          explanation: 'A fair coin has 2 equal outcomes: Heads or Tails. P(Heads) = 1/2 (50%).',
        },
      ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQuestion = questions[currentIndex] || questions[0];
  const selectedOption = selectedAnswers[currentIndex];
  const hasAnsweredCurrent = selectedOption !== undefined;
  const isCurrentCorrect = hasAnsweredCurrent && selectedOption === currentQuestion.correctAnswerIndex;

  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Score count
  const correctCount = useMemo(() => {
    return Object.entries(selectedAnswers).reduce((count, [idxStr, ansIdx]) => {
      const idx = parseInt(idxStr, 10);
      const q = questions[idx];
      if (q && q.correctAnswerIndex === ansIdx) {
        return count + 1;
      }
      return count;
    }, 0);
  }, [selectedAnswers, questions]);

  const handleSelectOption = (optIdx: number) => {
    if (hasAnsweredCurrent) return; // Prevent changing after answered
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
      updateTopicProgress(topic.id, {
        lastPracticeScore: Math.round((correctCount / totalQuestions) * 100),
      });
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
  };

  const handleGoToQuiz = () => {
    router.push({
      pathname: '/learning/topic/[topicId]/quiz',
      params: { topicId: topic.id },
    });
  };

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
              onPress={() => router.back()}
              style={[styles.backBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Back to Topic">
              <Text style={[styles.backBtnText, { color: theme.text }]}>← Back</Text>
            </Pressable>
            <View style={[styles.badgePill, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.badgePillText, { color: theme.primary }]}>PRACTICE DRILL</Text>
            </View>
          </View>

          {/* If Practice Completed */}
          {isFinished ? (
            <View
              style={[
                styles.completionCard,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}>
              <View style={[styles.trophyCircle, { backgroundColor: theme.successLight }]}>
                <Text style={styles.trophyEmoji}>🎉</Text>
              </View>
              <Text style={[styles.completionTitle, { color: theme.text }]}>
                Practice Complete!
              </Text>
              <Text style={[styles.completionScore, { color: theme.success }]}>
                Score: {correctCount} / {totalQuestions}
              </Text>
              <Text style={[styles.completionMessage, { color: theme.textSecondary }]}>
                {correctCount === totalQuestions
                  ? 'Flawless work! You are ready to tackle the topic quiz.'
                  : 'Good practice session! Review the explanations or jump into the quiz to test your mastery.'}
              </Text>

              <View style={styles.completionActions}>
                <Pressable
                  onPress={handleGoToQuiz}
                  style={[styles.primaryActionBtn, { backgroundColor: theme.primary }]}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Take Quiz">
                  <Text style={styles.primaryActionBtnText}>🧠 Take Quiz Now</Text>
                </Pressable>

                <Pressable
                  onPress={handleRestart}
                  style={[
                    styles.secondaryActionBtn,
                    { backgroundColor: theme.card, borderColor: theme.cardBorder },
                  ]}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Try Again">
                  <Text style={[styles.secondaryActionBtnText, { color: theme.text }]}>
                    🔄 Try Again
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              {/* Header & Progress Bar */}
              <View style={styles.headerBox}>
                <Text style={[styles.topicHeading, { color: theme.textSecondary }]}>
                  {topic.title} • Practice
                </Text>
                <View style={styles.progressRow}>
                  <Text style={[styles.questionCounter, { color: theme.text }]}>
                    Question {currentIndex + 1} of {totalQuestions}
                  </Text>
                  <Text style={[styles.percentLabel, { color: theme.primary }]}>
                    {progressPercent}%
                  </Text>
                </View>

                {/* Progress bar track */}
                <View style={[styles.progressTrack, { backgroundColor: theme.backgroundElement }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progressPercent}%`, backgroundColor: theme.primary },
                    ]}
                  />
                </View>
              </View>

              {/* Question Card */}
              <View
                style={[
                  styles.questionCard,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder },
                ]}>
                <Text style={[styles.questionText, { color: theme.text }]}>
                  {currentQuestion.question}
                </Text>

                {/* Options List */}
                <View style={styles.optionsList}>
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    let optBg: string = theme.card;
                    let optBorder: string = theme.cardBorder;

                    if (hasAnsweredCurrent) {
                      if (idx === currentQuestion.correctAnswerIndex) {
                        optBg = theme.successLight;
                        optBorder = theme.success;
                      } else if (isSelected) {
                        optBg = theme.errorLight;
                        optBorder = theme.error;
                      }
                    } else if (isSelected) {
                      optBg = theme.backgroundSelected;
                      optBorder = theme.primary;
                    }

                    return (
                      <Pressable
                        key={idx}
                        onPress={() => handleSelectOption(idx)}
                        style={[
                          styles.optionBtn,
                          { backgroundColor: optBg, borderColor: optBorder },
                        ]}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel={`Option ${idx + 1}: ${option}`}>
                        <View style={styles.optionLetterBadge}>
                          <Text style={[styles.optionLetterText, { color: theme.textSecondary }]}>
                            {String.fromCharCode(65 + idx)}
                          </Text>
                        </View>
                        <Text style={[styles.optionLabel, { color: theme.text }]}>
                          {option}
                        </Text>
                        {hasAnsweredCurrent && idx === currentQuestion.correctAnswerIndex && (
                          <Text style={[styles.resultIndicator, { color: theme.success }]}>✓</Text>
                        )}
                      </Pressable>
                    );
                  })}
                </View>

                {/* Immediate Feedback Box */}
                {hasAnsweredCurrent && (
                  <View
                    style={[
                      styles.feedbackBox,
                      {
                        backgroundColor: isCurrentCorrect ? theme.successLight : theme.warningLight,
                        borderColor: isCurrentCorrect ? theme.success : theme.warning,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.feedbackTitle,
                        { color: isCurrentCorrect ? theme.success : theme.warning },
                      ]}>
                      {isCurrentCorrect ? '🎉 Correct!' : 'Not quite.'}
                    </Text>
                    <Text style={[styles.feedbackBody, { color: theme.text }]}>
                      {currentQuestion.explanation}
                    </Text>
                  </View>
                )}
              </View>

              {/* Next Question / Finish Button */}
              {hasAnsweredCurrent && (
                <Pressable
                  onPress={handleNext}
                  style={[styles.nextBtn, { backgroundColor: theme.primary }]}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={currentIndex < totalQuestions - 1 ? 'Next Question' : 'Complete Practice'}>
                  <Text style={styles.nextBtnText}>
                    {currentIndex < totalQuestions - 1 ? 'Next Question →' : 'Complete Practice ✓'}
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
  headerBox: {
    marginBottom: Spacing.four,
  },
  topicHeading: {
    ...Typography.caption,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  questionCounter: {
    ...Typography.h2,
    fontSize: 18,
  },
  percentLabel: {
    ...Typography.subtext,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  questionCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    marginBottom: Spacing.four,
    ...Shadows.card,
  },
  questionText: {
    ...Typography.h2,
    fontSize: 18,
    lineHeight: 26,
    marginBottom: Spacing.four,
  },
  optionsList: {
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    minHeight: 52,
  },
  optionLetterBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.three,
  },
  optionLetterText: {
    fontSize: 13,
    fontWeight: '700',
  },
  optionLabel: {
    ...Typography.body,
    flex: 1,
  },
  resultIndicator: {
    fontSize: 18,
    fontWeight: '800',
    marginLeft: Spacing.two,
  },
  feedbackBox: {
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.three,
  },
  feedbackTitle: {
    ...Typography.bodyBold,
    marginBottom: 4,
  },
  feedbackBody: {
    ...Typography.subtext,
    lineHeight: 20,
  },
  nextBtn: {
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    marginBottom: Spacing.five,
    ...Shadows.primaryBtn,
  },
  nextBtnText: {
    color: '#FFFFFF',
    ...Typography.bodyBold,
  },
  completionCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.five,
    alignItems: 'center',
    borderWidth: 1,
    ...Shadows.card,
    marginTop: Spacing.three,
  },
  trophyCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  trophyEmoji: {
    fontSize: 36,
  },
  completionTitle: {
    ...Typography.h1,
    marginBottom: Spacing.one,
  },
  completionScore: {
    ...Typography.h2,
    marginBottom: Spacing.three,
  },
  completionMessage: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.four,
    maxWidth: 340,
  },
  completionActions: {
    width: '100%',
    gap: Spacing.two,
  },
  primaryActionBtn: {
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    ...Shadows.primaryBtn,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    ...Typography.bodyBold,
  },
  secondaryActionBtn: {
    paddingVertical: 13,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minHeight: 48,
  },
  secondaryActionBtnText: {
    ...Typography.subtext,
    fontWeight: '600',
  },
});
