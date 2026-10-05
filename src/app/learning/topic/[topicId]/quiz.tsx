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
import { getMockTopicById } from '@/data/mockTopics';
import { useTheme } from '@/hooks/use-theme';
import { QuizQuestion } from '@/types/learning';

export default function TopicQuizScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { topicId: rawTopicId } = useLocalSearchParams<{ topicId?: string }>();

  const topicId = typeof rawTopicId === 'string' && rawTopicId.trim() ? rawTopicId : 'ds-probability';
  const topic = useMemo(() => getMockTopicById(topicId), [topicId]);

  const questions: QuizQuestion[] = useMemo(() => {
    if (topic.quizQuestions && topic.quizQuestions.length > 0) {
      return topic.quizQuestions;
    }
    return [
      {
        id: 'q-default-1',
        question: 'What is the probability range of any valid event?',
        options: ['-1 to 1', '0 to 1', '0 to 100', '1 to 10'],
        correctAnswerIndex: 1,
        explanation: 'Probabilities are real numbers bounded between 0 and 1.',
      },
    ];
  }, [topic]);

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIdx] || questions[0];
  const selectedOption = selectedAnswers[currentIdx];
  const isCurrentSubmitted = Boolean(submittedQuestions[currentIdx]);
  const isCurrentCorrect =
    selectedOption !== undefined &&
    selectedOption === currentQuestion.correctAnswerIndex;

  const progressPercent = Math.round(((currentIdx + 1) / totalQuestions) * 100);

  const handleSelectOption = (optIdx: number) => {
    if (isCurrentSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIdx,
    }));
  };

  const handleSubmitCurrent = () => {
    if (selectedOption === undefined) return;
    setSubmittedQuestions((prev) => ({
      ...prev,
      [currentIdx]: true,
    }));
  };

  const handleNextOrFinish = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Calculate final score
      let correct = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctAnswerIndex) {
          correct += 1;
        }
      });
      const scorePercent = Math.round((correct / totalQuestions) * 100);

      router.push({
        pathname: '/learning/topic/[topicId]/result',
        params: {
          topicId: topic.id,
          score: scorePercent.toString(),
          correctCount: correct.toString(),
          totalQuestions: totalQuestions.toString(),
        },
      });
    }
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
              accessibilityLabel="Exit Quiz">
              <Text style={[styles.backBtnText, { color: theme.text }]}>✕ Exit</Text>
            </Pressable>
            <View style={[styles.badgePill, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.badgePillText, { color: theme.primary }]}>OFFICIAL QUIZ</Text>
            </View>
          </View>

          {/* Header & Question Counter */}
          <View style={styles.headerBox}>
            <Text style={[styles.topicHeading, { color: theme.textSecondary }]}>
              Topic Quiz • {topic.title}
            </Text>
            <View style={styles.progressRow}>
              <Text style={[styles.questionCounter, { color: theme.text }]}>
                Question {currentIdx + 1} of {totalQuestions}
              </Text>
              <Text style={[styles.percentLabel, { color: theme.primary }]}>
                {progressPercent}%
              </Text>
            </View>

            {/* Progress Bar Track */}
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

                if (isCurrentSubmitted) {
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
                    <View
                      style={[
                        styles.optionLetterBadge,
                        {
                          backgroundColor: isSelected ? theme.primary : '#F1F5F9',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.optionLetterText,
                          { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                        ]}>
                        {String.fromCharCode(65 + idx)}
                      </Text>
                    </View>
                    <Text style={[styles.optionLabel, { color: theme.text }]}>
                      {option}
                    </Text>
                    {isCurrentSubmitted && idx === currentQuestion.correctAnswerIndex && (
                      <Text style={[styles.resultIndicator, { color: theme.success }]}>✓</Text>
                    )}
                  </Pressable>
                );
              })}
            </View>

            {/* Submitted Feedback Explanation */}
            {isCurrentSubmitted && (
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
                  {isCurrentCorrect ? '✓ Correct Answer' : '✕ Incorrect'}
                </Text>
                <Text style={[styles.feedbackBody, { color: theme.text }]}>
                  {currentQuestion.explanation}
                </Text>
              </View>
            )}
          </View>

          {/* Action Button: Submit Answer / Next Question */}
          <View style={styles.actionRow}>
            {!isCurrentSubmitted ? (
              <Pressable
                onPress={handleSubmitCurrent}
                disabled={selectedOption === undefined}
                style={[
                  styles.primaryActionBtn,
                  {
                    backgroundColor: selectedOption !== undefined ? theme.primary : theme.cardBorder,
                    opacity: selectedOption !== undefined ? 1 : 0.6,
                  },
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Submit Answer">
                <Text style={styles.primaryActionBtnText}>Confirm Answer</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleNextOrFinish}
                style={[styles.primaryActionBtn, { backgroundColor: theme.primary }]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={currentIdx < totalQuestions - 1 ? 'Next Question' : 'View Results'}>
                <Text style={styles.primaryActionBtnText}>
                  {currentIdx < totalQuestions - 1 ? 'Next Question →' : 'View Quiz Results 📊'}
                </Text>
              </Pressable>
            )}
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
  actionRow: {
    marginBottom: Spacing.five,
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
});
