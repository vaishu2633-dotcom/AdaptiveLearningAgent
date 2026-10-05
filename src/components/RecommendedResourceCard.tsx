import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  BorderRadius,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { LearningResource } from '@/types/resources';

interface RecommendedResourceCardProps {
  resource: LearningResource;
  onPress: () => void;
  isDominant?: boolean;
}

export function RecommendedResourceCard({
  resource,
  onPress,
  isDominant = false,
}: RecommendedResourceCardProps) {
  const theme = useTheme();

  const isAiVideo = resource.type === 'AI_VIDEO';
  const isYouTube = resource.type === 'YOUTUBE';
  const isPractice = resource.type === 'PRACTICE';
  const isQuiz = resource.type === 'QUIZ';
  const isArticle = resource.type === 'ARTICLE';

  let typeBadgeLabel = 'RESOURCE';
  let typeBadgeIcon = '📘';
  let actionBtnText = 'View Resource';

  if (isAiVideo) {
    typeBadgeLabel = 'AI EXPLANATION';
    typeBadgeIcon = '▶';
    actionBtnText = 'Watch Explanation';
  } else if (isYouTube) {
    typeBadgeLabel = 'YOUTUBE VIDEO';
    typeBadgeIcon = '🎥';
    actionBtnText = 'Watch on YouTube';
  } else if (isPractice) {
    typeBadgeLabel = 'PRACTICE';
    typeBadgeIcon = '🧩';
    actionBtnText = 'Start Practice';
  } else if (isQuiz) {
    typeBadgeLabel = 'CHECKPOINT QUIZ';
    typeBadgeIcon = '📝';
    actionBtnText = 'Take Quiz';
  } else if (isArticle) {
    typeBadgeLabel = 'READ CONCEPT';
    typeBadgeIcon = '📖';
    actionBtnText = 'Read Notes';
  }

  const primaryCard = isAiVideo || isDominant;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: primaryCard ? theme.primary : theme.cardBorder,
          borderWidth: primaryCard ? 2 : 1,
        },
        primaryCard && {
          ...Shadows.primaryBtn,
          shadowOpacity: 0.14,
        },
      ]}>
      {/* Top Header: Type Pill & Recommendation Reason / Tag */}
      <View style={styles.topHeader}>
        <View
          style={[
            styles.typePill,
            {
              backgroundColor: isAiVideo
                ? theme.primaryLight
                : isYouTube
                ? theme.errorLight
                : isPractice
                ? theme.accentLight
                : theme.backgroundElement,
            },
          ]}>
          <Text
            style={[
              styles.typePillText,
              {
                color: isAiVideo
                  ? theme.primary
                  : isYouTube
                  ? theme.error
                  : isPractice
                  ? theme.accent
                  : theme.textSecondary,
              },
            ]}>
            {typeBadgeIcon} {typeBadgeLabel}
          </Text>
        </View>

        {resource.recommended && (
          <View style={[styles.recBadge, { backgroundColor: theme.successLight }]}>
            <Text style={[styles.recBadgeText, { color: theme.success }]}>
              Recommended
            </Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: primaryCard ? theme.primary : theme.text },
          primaryCard && { fontSize: 18 },
        ]}>
        {resource.title}
      </Text>

      {/* Description */}
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        {resource.description}
      </Text>

      {/* Duration and Difficulty chips */}
      <View style={styles.metaRow}>
        {resource.duration && (
          <View style={[styles.metaChip, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>
              ⏱ {resource.duration}
            </Text>
          </View>
        )}
        {resource.difficulty && (
          <View style={[styles.metaChip, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>
              ⚡ {resource.difficulty}
            </Text>
          </View>
        )}
        {resource.videoStatus === 'ready' && isAiVideo && (
          <View style={[styles.metaChip, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.metaChipText, { color: theme.primary }]}>
              AI Generated
            </Text>
          </View>
        )}
      </View>

      {/* Recommendation Reason Box (if available) */}
      {resource.recommendationReason && (
        <View
          style={[
            styles.reasonBox,
            { backgroundColor: theme.backgroundElement, borderColor: theme.cardBorder },
          ]}>
          <Text style={styles.reasonIcon}>💡</Text>
          <Text style={[styles.reasonText, { color: theme.textSecondary }]}>
            {resource.recommendationReason}
          </Text>
        </View>
      )}

      {/* Action Button */}
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.actionBtn,
          {
            backgroundColor: primaryCard ? theme.primary : theme.backgroundElement,
            borderWidth: primaryCard ? 0 : 1,
            borderColor: theme.cardBorder,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.985 : 1 }],
          },
        ]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${actionBtnText} for ${resource.title}`}>
        <Text
          style={[
            styles.actionBtnText,
            { color: primaryCard ? '#FFFFFF' : theme.text },
          ]}>
          {actionBtnText} →
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    gap: Spacing.two + 2,
    ...Shadows.card,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  typePillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  recBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  recBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    ...Typography.h3,
    fontSize: 17,
    lineHeight: 23,
  },
  description: {
    ...Typography.body,
    fontSize: 13,
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: 2,
  },
  metaChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  metaChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  reasonBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.two,
    marginTop: 2,
  },
  reasonIcon: {
    fontSize: 14,
  },
  reasonText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
  actionBtn: {
    height: 46,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
