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
import { getQuizQuestionsForTopic } from '@/data/learningResources';
import { useTheme } from '@/hooks/use-theme';
import { TopicQuizQuestion } from '@/types/resources';

export default function QuizScreen() {
  const router = useRouter();
  const { topicId } = useLocalSearchParams<{ topicId?: string }>();
  const theme = useTheme();
  const { currentTopic, roadmap } = useAssessment();

  const activeTopicId =
    typeof topicId === 'string' && topicId.trim()
      ? topicId
      : currentTopic?.id || 'ds-5';

  const activeTopic = useMemo(() => {
    return (
      roadmap.find((t) => t.id === activeTopicId) ||
      currentTopic || {
        id: 'ds-5',
        title: 'Statistics Fundamentals',
      }
    );
  }, [activeTopicId, roadmap, currentTopic]);

  const questions: TopicQuizQuestion[] = useMemo(() => {
    return getQuizQuestionsForTopic(activeTopicId, activeTopic.title);
  }, [activeTopicId, activeTopic.title]);

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
      // Calculate overall score
      let correct = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctAnswerIndex) {
          correct += 1;
        }
      });
      const scorePercent = Math.round((correct / totalQuestions) * 100);

      router.push({
        pathname: '/quiz/result',
        params: {
          score: scorePercent.toString(),
          correctCount: correct.toString(),
          totalQuestions: totalQuestions.toString(),
          topicId: activeTopicId,
        },
      });
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Header Progress Counter */}
          <View style={styles.header}>
            <View style={styles.progressRow}>
              <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                Question {currentIdx + 1} of {totalQuestions}
              </Text>
              <Text style={[styles.adaptiveBadge, { color: theme.primary }]}>
                {activeTopic.title}
              </Text>
            </View>

            <View style={[styles.progressBarBg, { backgroundColor: theme.backgroundElement }]}>
              <View
                style={[
                  styles.progressBarFill,
                  { backgroundColor: theme.primary, width: `${progressPercent}%` },
                ]}
              />
            </View>
          </View>

          {/* Question Statement */}
          <View
            style={[
              styles.questionBox,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={[styles.questionText, { color: theme.text }]}>
              {currentQuestion.question}
            </Text>
          </View>

          {/* Choices A, B, C, D */}
          <View style={styles.optionsList}>
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const letter = String.fromCharCode(65 + optIdx);

              let cardBg: string = theme.card;
              let borderColor: string = theme.cardBorder;
              let letterBg: string = theme.backgroundElement;
              let letterColor: string = theme.text;

              if (isSelected && !isCurrentSubmitted) {
                cardBg = theme.primaryLight;
                borderColor = theme.primary;
                letterBg = theme.primary;
                letterColor = '#FFFFFF';
              } else if (isCurrentSubmitted) {
                if (optIdx === currentQuestion.correctAnswerIndex) {
                  cardBg = theme.successLight;
                  borderColor = theme.success;
                  letterBg = theme.success;
                  letterColor = '#FFFFFF';
                } else if (isSelected && !isCurrentCorrect) {
                  cardBg = theme.errorLight;
                  borderColor = theme.error;
                  letterBg = theme.error;
                  letterColor = '#FFFFFF';
                }
              }

              return (
                <Pressable
                  key={optIdx}
                  disabled={isCurrentSubmitted}
                  onPress={() => handleSelectOption(optIdx)}
                  style={({ pressed }) => [
                    styles.optionCard,
                    {
                      backgroundColor: cardBg,
                      borderColor: borderColor,
                      borderWidth:
                        isSelected || (isCurrentSubmitted && optIdx === currentQuestion.correctAnswerIndex)
                          ? 2
                          : 1,
                      transform: [{ scale: pressed && !isCurrentSubmitted ? 0.99 : 1 }],
                    },
                  ]}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Option ${letter}: ${opt}`}
                  accessibilityState={{ selected: isSelected }}>
                  <View style={styles.optionRow}>
                    <View
                      style={[
                        styles.letterCircle,
                        { backgroundColor: letterBg, borderColor },
                      ]}>
                      <Text style={[styles.letterText, { color: letterColor }]}>
                        {letter}
                      </Text>
                    </View>
                    <Text style={[styles.optionText, { color: theme.text }]}>
                      {opt}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Explanation Box (Revealed only after submission) */}
          {isCurrentSubmitted && (
            <View
              style={[
                styles.feedbackCard,
                {
                  backgroundColor: isCurrentCorrect ? theme.successLight : theme.warningLight,
                  borderColor: isCurrentCorrect ? theme.success : theme.warning,
                },
              ]}>
              <View style={styles.feedbackHeader}>
                <Text style={styles.feedbackEmoji}>{isCurrentCorrect ? '✓' : '⚠️'}</Text>
                <Text
                  style={[
                    styles.feedbackTitle,
                    { color: isCurrentCorrect ? theme.success : theme.warning },
                  ]}>
                  {isCurrentCorrect ? 'Correct! Excellent reasoning.' : 'Not quite. Review explanation:'}
                </Text>
              </View>
              <Text style={[styles.feedbackBody, { color: theme.text }]}>
                {currentQuestion.explanation}
              </Text>
            </View>
          )}

          {/* Action CTAs */}
          <View style={styles.bottomSection}>
            {!isCurrentSubmitted ? (
              <Pressable
                onPress={handleSubmitCurrent}
                disabled={selectedOption === undefined}
                style={({ pressed }) => [
                  styles.primaryButton,
                  {
                    backgroundColor: theme.primary,
                    opacity: selectedOption === undefined ? 0.5 : pressed ? 0.92 : 1,
                    transform: [{ scale: pressed && selectedOption !== undefined ? 0.985 : 1 }],
                  },
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Submit Answer">
                <Text style={styles.primaryButtonText}>Submit Answer</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleNextOrFinish}
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
                accessibilityLabel={
                  currentIdx === totalQuestions - 1 ? 'View Final Results' : 'Next Question'
                }>
                <Text style={styles.primaryButtonText}>
                  {currentIdx === totalQuestions - 1
                    ? 'View Final Results →'
                    : 'Next Question →'}
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => router.back()}
              style={styles.cancelBtn}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Exit Quiz">
              <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
                Exit Quiz
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
  header: {
    gap: Spacing.two,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 15,
    fontWeight: '700',
  },
  adaptiveBadge: {
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
  questionBox: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
  },
  questionText: {
    ...Typography.h2,
    fontSize: 18,
    lineHeight: 25,
  },
  optionsList: {
    gap: Spacing.three,
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
  letterCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterText: {
    fontSize: 14,
    fontWeight: '800',
  },
  optionText: {
    flex: 1,
    ...Typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
  feedbackCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1.5,
    gap: 6,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  feedbackEmoji: {
    fontSize: 18,
    fontWeight: '800',
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  feedbackBody: {
    ...Typography.body,
    fontSize: 13,
    lineHeight: 19,
  },
  bottomSection: {
    gap: Spacing.two + 4,
    marginTop: Spacing.two,
  },
  primaryButton: {
    height: 56,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.primaryBtn,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  cancelBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
