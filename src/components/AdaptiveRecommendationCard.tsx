import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  BorderRadius,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getAdaptiveRecommendation } from '@/services/adaptiveService';
import { AdaptiveRecommendation } from '@/types/learning';

interface AdaptiveRecommendationCardProps {
  score: number;
  topicTitle?: string;
  recommendation?: AdaptiveRecommendation;
  onContinue?: () => void;
  onPractice?: () => void;
  onQuiz?: () => void;
  onAiExplanation?: () => void;
  onVideo?: () => void;
  onReview?: () => void;
}

export function AdaptiveRecommendationCard({
  score,
  topicTitle = 'this topic',
  recommendation: customRec,
  onContinue,
  onPractice,
  onQuiz,
  onAiExplanation,
  onVideo,
  onReview,
}: AdaptiveRecommendationCardProps) {
  const theme = useTheme();
  const rec = customRec || getAdaptiveRecommendation(score);

  const isMastered = rec.status === 'mastered';
  const isPractice = rec.status === 'practice';
  const isReview = rec.status === 'review';

  // Badge and theme colors according to adaptive state
  const accentColor = isMastered
    ? theme.success
    : isPractice
    ? theme.warning
    : theme.primary;

  const bgLightColor = isMastered
    ? theme.successLight
    : isPractice
    ? theme.warningLight
    : theme.primaryLight;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: accentColor,
        },
      ]}>
      {/* Header Badge */}
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: bgLightColor }]}>
          <Text style={[styles.badgeText, { color: accentColor }]}>
            {isMastered
              ? 'LEVEL UNLOCKED'
              : isPractice
              ? 'PRACTICE RECOMMENDED'
              : 'REVIEW ASSIGNED'}
          </Text>
        </View>
        <Text style={[styles.scorePill, { color: theme.textSecondary }]}>
          Score: {Math.round(score)}%
        </Text>
      </View>

      {/* Main Title & Description */}
      <Text style={[styles.title, { color: theme.text }]}>{rec.title}</Text>
      <Text style={[styles.message, { color: theme.textSecondary }]}>
        {rec.message}
      </Text>

      {/* Recommended For You Section (Especially for Review <60% and Practice 60-79%) */}
      {isReview && (
        <View style={[styles.reviewResourcesBox, { backgroundColor: theme.backgroundElement }]}>
          <Text style={[styles.reviewResourcesLabel, { color: theme.text }]}>
            Recommended for you:
          </Text>
          <View style={styles.resourceChipsRow}>
            <Pressable
              onPress={onAiExplanation || onReview}
              style={[styles.resourceChip, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Text style={styles.resourceChipIcon}>🤖</Text>
              <Text style={[styles.resourceChipText, { color: theme.text }]}>AI Explanation</Text>
            </Pressable>

            <Pressable
              onPress={onVideo || onReview}
              style={[styles.resourceChip, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Text style={styles.resourceChipIcon}>▶️</Text>
              <Text style={[styles.resourceChipText, { color: theme.text }]}>Watch Video</Text>
            </Pressable>

            <Pressable
              onPress={onPractice}
              style={[styles.resourceChip, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Text style={styles.resourceChipIcon}>✏️</Text>
              <Text style={[styles.resourceChipText, { color: theme.text }]}>Practice</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {isMastered && (
          <Pressable
            onPress={onContinue}
            style={[styles.primaryBtn, { backgroundColor: theme.success }]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Continue Learning">
            <Text style={styles.primaryBtnText}>Continue Learning →</Text>
          </Pressable>
        )}

        {isPractice && (
          <>
            <Pressable
              onPress={onPractice}
              style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Practice Now">
              <Text style={styles.primaryBtnText}>✏️ Practice Now</Text>
            </Pressable>

            <Pressable
              onPress={onQuiz}
              style={[
                styles.secondaryBtn,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Retake Quiz">
              <Text style={[styles.secondaryBtnText, { color: theme.text }]}>
                🧠 Retake Quiz
              </Text>
            </Pressable>
          </>
        )}

        {isReview && (
          <>
            <Pressable
              onPress={onReview || onAiExplanation}
              style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Start Review">
              <Text style={styles.primaryBtnText}>🔄 Start Review</Text>
            </Pressable>

            <View style={styles.secondaryActionsRow}>
              <Pressable
                onPress={onPractice}
                style={[
                  styles.halfBtn,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder },
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Practice">
                <Text style={[styles.secondaryBtnText, { color: theme.text }]}>
                  ✏️ Practice
                </Text>
              </Pressable>

              <Pressable
                onPress={onQuiz}
                style={[
                  styles.halfBtn,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder },
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Retest">
                <Text style={[styles.secondaryBtnText, { color: theme.text }]}>
                  🧠 Retake Quiz
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.four,
    borderWidth: 2,
    marginVertical: Spacing.three,
    ...Shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  badge: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
  },
  badgeText: {
    ...Typography.caption,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  scorePill: {
    ...Typography.subtext,
    fontWeight: '700',
  },
  title: {
    ...Typography.h2,
    marginTop: Spacing.one,
    marginBottom: Spacing.one,
  },
  message: {
    ...Typography.body,
    marginBottom: Spacing.three,
  },
  reviewResourcesBox: {
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.four,
  },
  reviewResourcesLabel: {
    ...Typography.subtext,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },
  resourceChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  resourceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: 7,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  resourceChipIcon: {
    fontSize: 14,
  },
  resourceChipText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  actionsContainer: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  primaryBtn: {
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    ...Shadows.primaryBtn,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    ...Typography.bodyBold,
  },
  secondaryBtn: {
    paddingVertical: 13,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minHeight: 48,
  },
  secondaryBtnText: {
    ...Typography.subtext,
    fontWeight: '600',
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  halfBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minHeight: 46,
  },
});
