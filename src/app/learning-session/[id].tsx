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
import { getTopicById } from '@/data/learningPathData';
import { useTheme } from '@/hooks/use-theme';
import { LearningSection } from '@/types/assessment';

export default function LearningSessionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { roadmap, completeTopic } = useAssessment();

  const topicId = typeof id === 'string' ? id : 'ds-5';

  const topic = useMemo(() => {
    return getTopicById(topicId, roadmap);
  }, [topicId, roadmap]);

  const sections: LearningSection[] = useMemo(() => {
    if (topic && topic.sections && topic.sections.length > 0) {
      return topic.sections;
    }
    return [
      {
        sectionNumber: 1,
        title: 'Fundamental Concept & Definition',
        content:
          'Structured learning breaks down complex concepts into manageable, verifiable milestones. Review each rule carefully before proceeding to practical exercises.',
        example:
          'Example: Decompose the objective into inputs, transformations, and verified outputs.',
        checkQuestion: {
          question: 'What is the most effective approach to mastering a new technical concept?',
          options: [
            'Break it down into modular steps and test your understanding',
            'Skip directly to advanced projects without reviewing basics',
            'Memorize without understanding underlying logic',
            'Guess randomly',
          ],
          correctAnswerIndex: 0,
          explanation:
            'Modular decomposition and immediate self-checking provide the highest conceptual retention.',
        },
      },
    ];
  }, [topic]);

  const [currentSectionIdx, setCurrentSectionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [hasCompletedLesson, setHasCompletedLesson] = useState<boolean>(false);

  const activeSection = sections[currentSectionIdx] || sections[0];
  const isLastSection = currentSectionIdx === sections.length - 1;

  const currentAnswer = selectedAnswers[currentSectionIdx];
  const isAnswered = currentAnswer !== undefined;
  const isCorrect = isAnswered && currentAnswer === activeSection.checkQuestion.correctAnswerIndex;

  const handleSelectOption = (optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentSectionIdx]: optionIdx,
    }));
  };

  const handleNextSection = () => {
    if (!isLastSection) {
      setCurrentSectionIdx((prev) => prev + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIdx > 0) {
      setCurrentSectionIdx((prev) => prev - 1);
    }
  };

  const handleCompleteTopic = () => {
    completeTopic(topicId);
    setHasCompletedLesson(true);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Header Row: Topic Badge + Section Progress */}
          <View style={styles.topRow}>
            <View style={[styles.topicBadge, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.topicBadgeText, { color: theme.primary }]}>
                {topic?.title || 'Interactive Lesson'}
              </Text>
            </View>

            <View style={[styles.stepCounterBadge, { backgroundColor: theme.backgroundElement }]}>
              <Text style={[styles.stepCounterText, { color: theme.textSecondary }]}>
                Part {currentSectionIdx + 1} of {sections.length}
              </Text>
            </View>
          </View>

          {/* Section Step Progress Dots */}
          <View style={styles.stepDotsRow}>
            {sections.map((_, idx) => {
              const isPast = idx < currentSectionIdx;
              const isCurrent = idx === currentSectionIdx;
              return (
                <View
                  key={idx}
                  style={[
                    styles.stepBar,
                    {
                      backgroundColor: isPast
                        ? theme.success
                        : isCurrent
                        ? theme.primary
                        : theme.backgroundElement,
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Celebration Screen when Completed */}
          {hasCompletedLesson ? (
            <View
              style={[
                styles.celebrationCard,
                { backgroundColor: theme.card, borderColor: theme.success },
              ]}>
              <View style={[styles.celebrationIconBox, { backgroundColor: theme.successLight }]}>
                <Text style={styles.celebrationEmoji}>🎉</Text>
              </View>

              <Text style={[styles.celebrationTitle, { color: theme.text }]}>
                Topic Completed!
              </Text>

              <Text style={[styles.celebrationDesc, { color: theme.textSecondary }]}>
                You mastered all core concepts for <Text style={{ fontWeight: '700', color: theme.text }}>{topic?.title}</Text>!
              </Text>

              <View
                style={[
                  styles.adaptationBanner,
                  { backgroundColor: theme.primaryLight, borderColor: theme.primary },
                ]}>
                <Text style={styles.bannerIcon}>⚡</Text>
                <View style={styles.bannerContent}>
                  <Text style={[styles.bannerTitle, { color: theme.primaryDark }]}>
                    AI Roadmap Update
                  </Text>
                  <Text style={[styles.bannerText, { color: theme.primaryDark }]}>
                    Your progress has been synchronized. The next milestone has been unlocked in your roadmap.
                  </Text>
                </View>
              </View>

              <View style={styles.celebrationActions}>
                <Pressable
                  onPress={() => router.replace('/(tabs)/learning-path')}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    {
                      backgroundColor: theme.primary,
                      opacity: pressed ? 0.92 : 1,
                    },
                  ]}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Return to Learning Path">
                  <Text style={styles.primaryBtnText}>View Updated Learning Path →</Text>
                </Pressable>

                <Pressable
                  onPress={() => router.push('/today')}
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
                  accessibilityLabel="Back to Today's Learning">
                  <Text style={[styles.secondaryBtnText, { color: theme.text }]}>
                    Back to Today's Learning
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              {/* Active Section Content Card */}
              <View
                style={[
                  styles.contentCard,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder },
                ]}>
                <View style={styles.secHeader}>
                  <View style={[styles.numCircle, { backgroundColor: theme.primaryLight }]}>
                    <Text style={[styles.numCircleText, { color: theme.primary }]}>
                      {activeSection.sectionNumber}
                    </Text>
                  </View>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    {activeSection.title}
                  </Text>
                </View>

                {/* Section Explanation Content */}
                <Text style={[styles.contentText, { color: theme.textSecondary }]}>
                  {activeSection.content}
                </Text>

                {/* Step-by-Step Example Box */}
                <View
                  style={[
                    styles.exampleBox,
                    { backgroundColor: theme.backgroundElement },
                  ]}>
                  <Text style={[styles.exampleHeading, { color: theme.text }]}>
                    💡 Hands-on Example:
                  </Text>
                  <Text style={[styles.exampleText, { color: theme.textSecondary }]}>
                    {activeSection.example}
                  </Text>
                </View>
              </View>

              {/* Interactive Knowledge Check Card */}
              <View
                style={[
                  styles.quizCheckCard,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder },
                ]}>
                <View style={styles.checkHeader}>
                  <Text style={styles.checkIcon}>🧠</Text>
                  <Text style={[styles.checkTitle, { color: theme.text }]}>
                    Quick Concept Check
                  </Text>
                </View>

                <Text style={[styles.questionText, { color: theme.text }]}>
                  {activeSection.checkQuestion.question}
                </Text>

                {/* Options List */}
                <View style={styles.optionsList}>
                  {activeSection.checkQuestion.options.map((opt, optIdx) => {
                    const isSelected = currentAnswer === optIdx;
                    const isOptionCorrect = optIdx === activeSection.checkQuestion.correctAnswerIndex;

                    let optBg: string = theme.card;
                    let optBorder: string = theme.cardBorder;
                    let optTextColor: string = theme.text;

                    if (isAnswered) {
                      if (isOptionCorrect) {
                        optBg = theme.successLight;
                        optBorder = theme.success;
                        optTextColor = theme.success;
                      } else if (isSelected && !isCorrect) {
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
                        onPress={() => handleSelectOption(optIdx)}
                        style={({ pressed }) => [
                          styles.optionCard,
                          {
                            backgroundColor: optBg,
                            borderColor: optBorder,
                            opacity: pressed ? 0.9 : 1,
                          },
                        ]}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel={opt}>
                        <View
                          style={[
                            styles.optLetterBox,
                            {
                              backgroundColor: isSelected
                                ? theme.primary
                                : theme.backgroundElement,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.optLetterText,
                              {
                                color: isSelected ? '#FFFFFF' : theme.textSecondary,
                              },
                            ]}>
                            {String.fromCharCode(65 + optIdx)}
                          </Text>
                        </View>
                        <Text style={[styles.optionText, { color: optTextColor }]}>
                          {opt}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Feedback Explanation (Shows once an answer is selected) */}
                {isAnswered && (
                  <View
                    style={[
                      styles.feedbackBox,
                      {
                        backgroundColor: isCorrect ? theme.successLight : theme.errorLight,
                        borderColor: isCorrect ? theme.success : theme.error,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.feedbackTitle,
                        { color: isCorrect ? theme.success : theme.error },
                      ]}>
                      {isCorrect ? '✓ Correct! Well done.' : '✗ Not quite. Here is why:'}
                    </Text>
                    <Text
                      style={[
                        styles.feedbackExplanation,
                        { color: isCorrect ? theme.text : theme.textSecondary },
                      ]}>
                      {activeSection.checkQuestion.explanation}
                    </Text>
                  </View>
                )}
              </View>

              {/* Bottom Navigation Buttons */}
              <View style={styles.bottomNavRow}>
                {currentSectionIdx > 0 && (
                  <Pressable
                    onPress={handlePrevSection}
                    style={[
                      styles.navPrevBtn,
                      { backgroundColor: theme.backgroundElement },
                    ]}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Previous Section">
                    <Text style={[styles.navPrevBtnText, { color: theme.textSecondary }]}>
                      ← Previous
                    </Text>
                  </Pressable>
                )}

                {isLastSection ? (
                  <Pressable
                    onPress={handleCompleteTopic}
                    style={({ pressed }) => [
                      styles.completeBtn,
                      {
                        backgroundColor: theme.success,
                        opacity: pressed ? 0.92 : 1,
                        flex: currentSectionIdx > 0 ? 1 : undefined,
                      },
                    ]}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Complete Topic">
                    <Text style={styles.completeBtnText}>✓ Complete Topic</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={handleNextSection}
                    style={({ pressed }) => [
                      styles.nextBtn,
                      {
                        backgroundColor: theme.primary,
                        opacity: pressed ? 0.92 : 1,
                        flex: currentSectionIdx > 0 ? 1 : undefined,
                      },
                    ]}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Next Section">
                    <Text style={styles.nextBtnText}>Next Concept →</Text>
                  </Pressable>
                )}
              </View>
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
  },
  topicBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  stepCounterBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  stepCounterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepDotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: -4,
  },
  stepBar: {
    flex: 1,
    height: 5,
    borderRadius: 3,
  },
  contentCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
    gap: Spacing.three,
  },
  secHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  numCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numCircleText: {
    fontSize: 15,
    fontWeight: '800',
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: 18,
    flex: 1,
  },
  contentText: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 23,
  },
  exampleBox: {
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  exampleHeading: {
    fontSize: 13,
    fontWeight: '700',
  },
  exampleText: {
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 19,
  },
  quizCheckCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
    gap: Spacing.three,
  },
  checkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkIcon: {
    fontSize: 18,
  },
  checkTitle: {
    ...Typography.h3,
    fontSize: 16,
  },
  questionText: {
    ...Typography.h3,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  optionsList: {
    gap: Spacing.two + 2,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    gap: Spacing.three,
    minHeight: 52,
  },
  optLetterBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optLetterText: {
    fontSize: 13,
    fontWeight: '700',
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
    marginTop: 4,
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  feedbackExplanation: {
    fontSize: 13,
    lineHeight: 18,
  },
  bottomNavRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
  navPrevBtn: {
    paddingHorizontal: 20,
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navPrevBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  nextBtn: {
    width: '100%',
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.primaryBtn,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  completeBtn: {
    width: '100%',
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.primaryBtn,
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  celebrationCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 2,
    ...Shadows.card,
    alignItems: 'center',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  celebrationIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationEmoji: {
    fontSize: 32,
  },
  celebrationTitle: {
    ...Typography.h1,
    fontSize: 24,
    textAlign: 'center',
  },
  celebrationDesc: {
    ...Typography.body,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  adaptationBanner: {
    width: '100%',
    flexDirection: 'row',
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  bannerIcon: {
    fontSize: 18,
  },
  bannerContent: {
    flex: 1,
    gap: 2,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  bannerText: {
    fontSize: 12,
    lineHeight: 17,
  },
  celebrationActions: {
    width: '100%',
    gap: Spacing.two + 2,
    marginTop: Spacing.two,
  },
  primaryBtn: {
    height: 54,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.primaryBtn,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
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
