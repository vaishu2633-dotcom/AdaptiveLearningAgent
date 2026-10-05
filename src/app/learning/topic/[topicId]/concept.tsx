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

export default function ReadConceptScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { topicId: rawTopicId } = useLocalSearchParams<{ topicId?: string }>();

  const topicId = typeof rawTopicId === 'string' && rawTopicId.trim() ? rawTopicId : 'ds-probability';
  const topic = useMemo(() => getMockTopicById(topicId), [topicId]);

  // Concept check interactive state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  const conceptCheck = topic.explanation.conceptCheck || {
    question: 'If a dice has 6 sides, what is the probability of getting 3?',
    options: ['1/2', '1/3', '1/6', '1/4'],
    correctAnswerIndex: 2,
    explanation: 'There is 1 favorable side with number 3 out of 6 possible distinct sides, so P(3) = 1/6.',
  };

  const isCorrect = selectedOption === conceptCheck.correctAnswerIndex;

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
    setHasAnswered(true);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Top Back Navigation Bar */}
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
              <Text style={[styles.badgePillText, { color: theme.primary }]}>CONCEPT GUIDE</Text>
            </View>
          </View>

          {/* Title Header */}
          <Text style={[styles.title, { color: theme.text }]}>{topic.title}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {topic.description}
          </Text>

          {/* Section 1: What is this concept? */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              What is {topic.title}?
            </Text>
            <Text style={[styles.bodyText, { color: theme.textSecondary }]}>
              {topic.explanation.intro}
            </Text>
          </View>

          {/* Section 2: Concrete Example */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Example</Text>
            <View style={[styles.exampleBox, { backgroundColor: theme.backgroundElement }]}>
              <Text style={[styles.exampleText, { color: theme.text }]}>
                {topic.explanation.example}
              </Text>
            </View>
          </View>

          {/* Section 3: Key Points */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Key Points</Text>
            <View style={styles.pointsList}>
              {topic.keyPoints.map((point, index) => (
                <View key={index} style={styles.pointRow}>
                  <Text style={[styles.checkIcon, { color: theme.success }]}>✓</Text>
                  <Text style={[styles.pointText, { color: theme.text }]}>{point.replace(/^✓\s*/, '')}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Section 4: Why this matters in Machine Learning */}
          {topic.explanation.whyItMatters && (
            <View
              style={[
                styles.sectionCard,
                { backgroundColor: theme.primaryLight, borderColor: theme.primary },
              ]}>
              <Text style={[styles.sectionTitle, { color: theme.primaryDark }]}>
                💡 Why this matters in Machine Learning
              </Text>
              <Text style={[styles.bodyText, { color: theme.primaryDark }]}>
                {topic.explanation.whyItMatters}
              </Text>
            </View>
          )}

          {/* Section 5: "Try This" Interactive Check */}
          <View
            style={[
              styles.checkCard,
              { backgroundColor: theme.card, borderColor: theme.primary },
            ]}>
            <View style={styles.checkHeaderRow}>
              <Text style={[styles.checkBadge, { backgroundColor: theme.primaryLight, color: theme.primary }]}>
                TRY THIS
              </Text>
              <Text style={[styles.checkHelp, { color: theme.textMuted }]}>
                Quick understanding check
              </Text>
            </View>

            <Text style={[styles.checkQuestion, { color: theme.text }]}>
              {conceptCheck.question}
            </Text>

            {/* Options */}
            <View style={styles.optionsList}>
              {conceptCheck.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                let optBorderColor: string = theme.cardBorder;
                let optBgColor: string = theme.card;

                if (hasAnswered) {
                  if (idx === conceptCheck.correctAnswerIndex) {
                    optBorderColor = theme.success;
                    optBgColor = theme.successLight;
                  } else if (isSelected) {
                    optBorderColor = theme.error;
                    optBgColor = theme.errorLight;
                  }
                } else if (isSelected) {
                  optBorderColor = theme.primary;
                  optBgColor = theme.backgroundSelected;
                }

                return (
                  <Pressable
                    key={idx}
                    onPress={() => handleSelectOption(idx)}
                    style={[
                      styles.optionBtn,
                      { backgroundColor: optBgColor, borderColor: optBorderColor },
                    ]}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Option: ${option}`}>
                    <Text style={[styles.optionText, { color: theme.text }]}>
                      {option}
                    </Text>
                    {hasAnswered && idx === conceptCheck.correctAnswerIndex && (
                      <Text style={[styles.feedbackBadge, { color: theme.success }]}>✓</Text>
                    )}
                  </Pressable>
                );
              })}
            </View>

            {/* Immediate Feedback Banner */}
            {hasAnswered && (
              <View
                style={[
                  styles.feedbackBox,
                  {
                    backgroundColor: isCorrect ? theme.successLight : theme.warningLight,
                    borderColor: isCorrect ? theme.success : theme.warning,
                  },
                ]}>
                <Text
                  style={[
                    styles.feedbackTitle,
                    { color: isCorrect ? theme.success : theme.warning },
                  ]}>
                  {isCorrect ? '🎉 Correct!' : 'Not quite.'}
                </Text>
                <Text style={[styles.feedbackExplanation, { color: theme.text }]}>
                  {conceptCheck.explanation}
                </Text>
              </View>
            )}
          </View>

          {/* Action Flow Navigation */}
          <View style={styles.actionButtonsRow}>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/learning/topic/[topicId]/ai-explanation',
                  params: { topicId: topic.id },
                })
              }
              style={[styles.primaryActionBtn, { backgroundColor: theme.primary }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Next: AI Explanation">
              <Text style={styles.primaryActionBtnText}>Next: AI Explanation 🤖</Text>
            </Pressable>

            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/learning/topic/[topicId]/practice',
                  params: { topicId: topic.id },
                })
              }
              style={[
                styles.secondaryActionBtn,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Practice This Topic">
              <Text style={[styles.secondaryActionBtnText, { color: theme.text }]}>
                ✏️ Practice Now
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
  title: {
    ...Typography.h1,
    marginBottom: Spacing.one,
  },
  subtitle: {
    ...Typography.body,
    marginBottom: Spacing.four,
  },
  sectionCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    borderWidth: 1,
    marginBottom: Spacing.three,
    ...Shadows.card,
  },
  sectionTitle: {
    ...Typography.h2,
    marginBottom: Spacing.two,
  },
  bodyText: {
    ...Typography.body,
    lineHeight: 24,
  },
  exampleBox: {
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
  },
  exampleText: {
    ...Typography.body,
    lineHeight: 22,
    fontWeight: '500',
  },
  pointsList: {
    gap: Spacing.two,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  checkIcon: {
    fontSize: 18,
    fontWeight: '800',
  },
  pointText: {
    ...Typography.body,
    flex: 1,
  },
  checkCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 2,
    marginBottom: Spacing.four,
    ...Shadows.card,
  },
  checkHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  checkBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  checkHelp: {
    ...Typography.caption,
  },
  checkQuestion: {
    ...Typography.bodyBold,
    fontSize: 17,
    lineHeight: 24,
    marginBottom: Spacing.three,
  },
  optionsList: {
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  optionBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    minHeight: 48,
  },
  optionText: {
    ...Typography.body,
    fontWeight: '600',
  },
  feedbackBadge: {
    fontSize: 18,
    fontWeight: '800',
  },
  feedbackBox: {
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.two,
  },
  feedbackTitle: {
    ...Typography.bodyBold,
    marginBottom: 4,
  },
  feedbackExplanation: {
    ...Typography.subtext,
  },
  actionButtonsRow: {
    gap: Spacing.two,
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
