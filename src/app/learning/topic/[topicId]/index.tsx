import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
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

export default function TopicResourceHubScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { topicId: rawTopicId } = useLocalSearchParams<{ topicId?: string }>();
  const { getTopicProgress } = useAssessment();

  const topicId = typeof rawTopicId === 'string' && rawTopicId.trim() ? rawTopicId : 'ds-probability';
  const topic = useMemo(() => getMockTopicById(topicId), [topicId]);
  const progressState = getTopicProgress(topic.id);

  const displayProgress = progressState.progress !== undefined ? progressState.progress : topic.progress;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Back Navigation Bar */}
          <View style={styles.topBar}>
            <Pressable
              onPress={() => router.back()}
              style={[styles.backBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Back to Roadmap">
              <Text style={[styles.backBtnText, { color: theme.text }]}>← Roadmap</Text>
            </Pressable>
            <View style={[styles.badgePill, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.badgePillText, { color: theme.primary }]}>
                {topic.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Header & Subtitle */}
          <View style={styles.headerBox}>
            <Text style={[styles.title, { color: theme.text }]}>{topic.title}</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {topic.description}
            </Text>

            {/* Progress Section */}
            <View style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <View style={styles.progressHeaderRow}>
                <Text style={[styles.progressLabel, { color: theme.text }]}>Topic Progress</Text>
                <Text style={[styles.progressPercent, { color: theme.primary }]}>
                  {displayProgress}%
                </Text>
              </View>
              <View style={[styles.progressBarTrack, { backgroundColor: theme.backgroundElement }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(Math.max(displayProgress, 5), 100)}%`,
                      backgroundColor: displayProgress >= 80 ? theme.success : theme.primary,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.metaText, { color: theme.textMuted }]}>
                ⏱ Estimated: {topic.estimatedMinutes} mins • Prerequisites: {topic.prerequisites}
              </Text>
            </View>
          </View>

          {/* Selection Prompt */}
          <View style={styles.sectionHeadingBox}>
            <Text style={[styles.sectionHeading, { color: theme.text }]}>
              How do you want to learn?
            </Text>
            <Text style={[styles.sectionSubheading, { color: theme.textSecondary }]}>
              Choose a method that fits your current pace and learning style.
            </Text>
          </View>

          {/* Resource Options (5 Large Touch-Friendly Cards) */}
          <View style={styles.cardsList}>
            {/* 1. Read Concept */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/learning/topic/[topicId]/concept',
                  params: { topicId: topic.id },
                })
              }
              style={[
                styles.methodCard,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Read Concept">
              <View style={[styles.iconWrapper, { backgroundColor: '#EEF2FF' }]}>
                <Text style={styles.cardEmoji}>📖</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Read Concept</Text>
                <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
                  Learn the concept step by step
                </Text>
              </View>
              <Text style={[styles.cardArrow, { color: theme.primary }]}>→</Text>
            </Pressable>

            {/* 2. AI Explanation */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/learning/topic/[topicId]/ai-explanation',
                  params: { topicId: topic.id },
                })
              }
              style={[
                styles.methodCard,
                styles.highlightCard,
                { backgroundColor: theme.card, borderColor: theme.primary },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="AI Explanation">
              <View style={[styles.iconWrapper, { backgroundColor: theme.primaryLight }]}>
                <Text style={styles.cardEmoji}>🤖</Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.featuredBadgeRow}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>AI Explanation</Text>
                  <View style={[styles.aiPill, { backgroundColor: theme.primary }]}>
                    <Text style={styles.aiPillText}>ADAPTIVE</Text>
                  </View>
                </View>
                <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
                  Get a simple explanation based on your level
                </Text>
              </View>
              <Text style={[styles.cardArrow, { color: theme.primary }]}>→</Text>
            </Pressable>

            {/* 3. Watch Video */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/learning/topic/[topicId]/video',
                  params: { topicId: topic.id },
                })
              }
              style={[
                styles.methodCard,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Watch YouTube Video">
              <View style={[styles.iconWrapper, { backgroundColor: '#FEF2F2' }]}>
                <Text style={styles.cardEmoji}>▶️</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Watch Video</Text>
                <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
                  Watch a recommended YouTube explanation
                </Text>
              </View>
              <Text style={[styles.cardArrow, { color: theme.primary }]}>→</Text>
            </Pressable>

            {/* 4. Practice */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/learning/topic/[topicId]/practice',
                  params: { topicId: topic.id },
                })
              }
              style={[
                styles.methodCard,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Practice with quick questions">
              <View style={[styles.iconWrapper, { backgroundColor: '#F0FDF4' }]}>
                <Text style={styles.cardEmoji}>✏️</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Practice</Text>
                <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
                  Practice with quick questions
                </Text>
              </View>
              <Text style={[styles.cardArrow, { color: theme.primary }]}>→</Text>
            </Pressable>

            {/* 5. Take Quiz */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/learning/topic/[topicId]/quiz',
                  params: { topicId: topic.id },
                })
              }
              style={[
                styles.methodCard,
                styles.quizCard,
                { backgroundColor: theme.backgroundSelected, borderColor: theme.primary },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Take Quiz">
              <View style={[styles.iconWrapper, { backgroundColor: theme.primary }]}>
                <Text style={[styles.cardEmoji, { color: '#FFFFFF' }]}>🧠</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: theme.primaryDark }]}>Take Quiz</Text>
                <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
                  Test your understanding
                </Text>
              </View>
              <Text style={[styles.cardArrow, { color: theme.primary }]}>→</Text>
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
  headerBox: {
    marginBottom: Spacing.four,
  },
  title: {
    ...Typography.h1,
    marginBottom: Spacing.one,
  },
  subtitle: {
    ...Typography.body,
    marginBottom: Spacing.three,
  },
  progressCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.three,
    borderWidth: 1,
    ...Shadows.card,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  progressLabel: {
    ...Typography.bodyBold,
  },
  progressPercent: {
    ...Typography.bodyBold,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.two,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  metaText: {
    ...Typography.caption,
  },
  sectionHeadingBox: {
    marginBottom: Spacing.three,
  },
  sectionHeading: {
    ...Typography.h2,
    marginBottom: Spacing.one,
  },
  sectionSubheading: {
    ...Typography.subtext,
  },
  cardsList: {
    gap: Spacing.three,
    marginBottom: Spacing.five,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    minHeight: 74,
    ...Shadows.card,
  },
  highlightCard: {
    borderWidth: 2,
  },
  quizCard: {
    borderWidth: 2,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.three,
  },
  cardEmoji: {
    fontSize: 22,
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
  },
  featuredBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: 2,
  },
  aiPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  aiPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardTitle: {
    ...Typography.bodyBold,
    marginBottom: 2,
  },
  cardDescription: {
    ...Typography.subtext,
  },
  cardArrow: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: Spacing.two,
  },
});
