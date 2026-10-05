import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RecommendedResourceCard } from '@/components/RecommendedResourceCard';
import {
  BorderRadius,
  MaxContentWidth,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useAssessment } from '@/context/assessment-context';
import { getTopicById } from '@/data/learningPathData';
import { getResourcesForTopic } from '@/data/learningResources';
import { useTheme } from '@/hooks/use-theme';
import { LearningResource } from '@/types/resources';

type LearningMode = 'ALL' | 'WATCH' | 'READ' | 'PRACTICE' | 'TEST';

export default function TopicDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { roadmap, goalTitle } = useAssessment();

  const topicId = typeof id === 'string' ? id : 'ds-5';

  const topic = useMemo(() => {
    return getTopicById(topicId, roadmap);
  }, [topicId, roadmap]);

  const resources = useMemo(() => {
    return getResourcesForTopic(topicId, topic?.title);
  }, [topicId, topic?.title]);

  const [activeMode, setActiveMode] = useState<LearningMode>('ALL');
  const [youTubeModalVisible, setYouTubeModalVisible] = useState<boolean>(false);
  const [selectedYtResource, setSelectedYtResource] = useState<LearningResource | null>(null);

  if (!topic) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Topic not found.</Text>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.primary }]}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const isCompleted = topic.status === 'completed';
  const isNeedsReview = topic.status === 'needs_review';
  const isCurrent = topic.status === 'current';

  // Filter resources based on active mode
  const filteredResources = useMemo(() => {
    if (activeMode === 'ALL') return resources;
    if (activeMode === 'WATCH') return resources.filter((r) => r.type === 'AI_VIDEO' || r.type === 'YOUTUBE');
    if (activeMode === 'READ') return resources.filter((r) => r.type === 'ARTICLE');
    if (activeMode === 'PRACTICE') return resources.filter((r) => r.type === 'PRACTICE');
    if (activeMode === 'TEST') return resources.filter((r) => r.type === 'QUIZ');
    return resources;
  }, [resources, activeMode]);

  const handleResourcePress = (res: LearningResource) => {
    if (res.type === 'AI_VIDEO') {
      router.push({
        pathname: '/learning/topic/[topicId]/ai-explanation',
        params: { topicId },
      });
    } else if (res.type === 'ARTICLE') {
      router.push({
        pathname: '/learning/topic/[topicId]/concept',
        params: { topicId },
      });
    } else if (res.type === 'PRACTICE') {
      router.push({
        pathname: '/learning/topic/[topicId]/practice',
        params: { topicId },
      });
    } else if (res.type === 'QUIZ') {
      router.push({
        pathname: '/learning/topic/[topicId]/quiz',
        params: { topicId },
      });
    } else if (res.type === 'YOUTUBE') {
      router.push({
        pathname: '/learning/topic/[topicId]/video',
        params: { topicId },
      });
    }
  };

  const learningModes: { id: LearningMode; label: string; icon: string }[] = [
    { id: 'ALL', label: 'All', icon: '✨' },
    { id: 'WATCH', label: 'Watch', icon: '🎥' },
    { id: 'READ', label: 'Read', icon: '📖' },
    { id: 'PRACTICE', label: 'Practice', icon: '🧩' },
    { id: 'TEST', label: 'Test', icon: '📝' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Category & Status Pill Row */}
          <View style={styles.pillRow}>
            <View style={[styles.categoryPill, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.categoryPillText, { color: theme.primary }]}>
                {topic.sectionCategory} • TOPIC {topic.number}
              </Text>
            </View>

            <View
              style={[
                styles.statusPill,
                {
                  backgroundColor: isCompleted
                    ? theme.successLight
                    : isNeedsReview
                    ? theme.errorLight
                    : isCurrent
                    ? theme.primaryLight
                    : theme.backgroundElement,
                },
              ]}>
              <Text
                style={[
                  styles.statusPillText,
                  {
                    color: isCompleted
                      ? theme.success
                      : isNeedsReview
                      ? theme.error
                      : isCurrent
                      ? theme.primary
                      : theme.textMuted,
                  },
                ]}>
                {isCompleted
                  ? '✓ Completed'
                  : isNeedsReview
                  ? '⚠️ Needs Review'
                  : isCurrent
                  ? '→ In Progress'
                  : '○ Upcoming'}
              </Text>
            </View>
          </View>

          {/* Topic Title & Subtitle */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>{topic.title}</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {topic.shortDescription}
            </Text>
          </View>

          {/* Quick Metrics: Progress, Difficulty, Estimated Time */}
          <View style={styles.metaGrid}>
            <View
              style={[
                styles.metaCard,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}>
              <Text style={styles.metaIcon}>📊</Text>
              <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>Progress</Text>
              <Text style={[styles.metaValue, { color: theme.primary }]}>
                {topic.progressPercent}% Done
              </Text>
            </View>

            <View
              style={[
                styles.metaCard,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}>
              <Text style={styles.metaIcon}>⚡</Text>
              <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>Difficulty</Text>
              <Text style={[styles.metaValue, { color: theme.text }]}>{topic.difficulty}</Text>
            </View>

            <View
              style={[
                styles.metaCard,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}>
              <Text style={styles.metaIcon}>⏱</Text>
              <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>Est. Time</Text>
              <Text style={[styles.metaValue, { color: theme.text }]}>{topic.estimatedTime}</Text>
            </View>
          </View>

          {/* Learning Mode Choice Filter */}
          <View style={styles.modeSection}>
            <Text style={[styles.sectionHeading, { color: theme.text }]}>
              How do you want to learn?
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.modeChipsRow}>
              {learningModes.map((m) => {
                const isSelected = activeMode === m.id;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => setActiveMode(m.id)}
                    style={[
                      styles.modeChip,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.card,
                        borderColor: isSelected ? theme.primary : theme.cardBorder,
                      },
                    ]}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Filter by ${m.label}`}>
                    <Text style={styles.modeChipIcon}>{m.icon}</Text>
                    <Text
                      style={[
                        styles.modeChipText,
                        { color: isSelected ? '#FFFFFF' : theme.text },
                      ]}>
                      {m.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Resource Hub Cards List */}
          <View style={styles.resourceCardsContainer}>
            <View style={styles.resourceHeaderRow}>
              <Text style={[styles.resourceSectionTitle, { color: theme.text }]}>
                Choose your resource
              </Text>
              <Text style={[styles.resourceCountText, { color: theme.textSecondary }]}>
                {filteredResources.length} available
              </Text>
            </View>

            <View style={styles.resourcesList}>
              {filteredResources.map((res) => {
                const isDominant = res.type === 'AI_VIDEO';
                return (
                  <RecommendedResourceCard
                    key={res.id}
                    resource={res}
                    isDominant={isDominant}
                    onPress={() => handleResourcePress(res)}
                  />
                );
              })}
            </View>
          </View>

          {/* What You'll Learn Section */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={[styles.cardHeading, { color: theme.text }]}>
              What You'll Learn
            </Text>
            <View style={styles.bulletList}>
              {topic.whatYoullLearn.map((item, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <View style={[styles.bulletDot, { backgroundColor: theme.primary }]} />
                  <Text style={[styles.bulletText, { color: theme.textSecondary }]}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Why This Matters for Goal */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={[styles.cardHeading, { color: theme.text }]}>
              Why This Matters for {goalTitle}
            </Text>
            <Text style={[styles.contextText, { color: theme.textSecondary }]}>
              Mastering {topic.title.toLowerCase()} provides the foundation for interpreting models, avoiding misleading interpretations in raw datasets, and preparing data for machine learning algorithms.
            </Text>
          </View>

          {/* Primary Quick Start Action */}
          <View style={styles.bottomCtaRow}>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/learning/video/[id]',
                  params: { id: topicId },
                })
              }
              style={({ pressed }) => [
                styles.mainCtaBtn,
                {
                  backgroundColor: theme.primary,
                  opacity: pressed ? 0.92 : 1,
                  transform: [{ scale: pressed ? 0.985 : 1 }],
                },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Start Recommended AI Explanation">
              <Text style={styles.mainCtaText}>Start AI Explanation (4 min) →</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* YouTube Mock Preview Modal */}
      <Modal
        visible={youTubeModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setYouTubeModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <View style={[styles.modalIconBox, { backgroundColor: theme.errorLight }]}>
              <Text style={styles.modalEmoji}>🎥</Text>
            </View>

            <Text style={[styles.modalTitle, { color: theme.text }]}>
              YouTube External Resource
            </Text>

            <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
              {selectedYtResource?.title}
            </Text>

            {/* Architecture placeholder note */}
            <View
              style={[
                styles.archNoticeBox,
                { backgroundColor: theme.backgroundElement, borderColor: theme.cardBorder },
              ]}>
              <Text style={styles.archNoticeIcon}>⚙️</Text>
              <Text style={[styles.archNoticeText, { color: theme.textSecondary }]}>
                Mock Architecture: In production, the Resource Retrieval Agent fetches verified YouTube tutorials and timestamps without client-side web scraping.
              </Text>
            </View>

            <View style={styles.modalMetaRow}>
              <Text style={[styles.modalMetaLabel, { color: theme.textMuted }]}>
                Duration: {selectedYtResource?.duration || '18 min'} • Source: YouTube
              </Text>
            </View>

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setYouTubeModalVisible(false)}
                style={[styles.modalCloseBtn, { backgroundColor: theme.primary }]}>
                <Text style={styles.modalCloseText}>Got it</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  errorText: {
    ...Typography.h2,
    fontSize: 18,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  header: {
    gap: 4,
  },
  title: {
    ...Typography.h1,
  },
  subtitle: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  metaCard: {
    flex: 1,
    borderRadius: BorderRadius.card,
    padding: Spacing.three,
    borderWidth: 1,
    ...Shadows.card,
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: 20,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  modeSection: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  sectionHeading: {
    ...Typography.h2,
    fontSize: 17,
  },
  modeChipsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingVertical: 2,
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    gap: 6,
  },
  modeChipIcon: {
    fontSize: 14,
  },
  modeChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  resourceCardsContainer: {
    gap: Spacing.three,
  },
  resourceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resourceSectionTitle: {
    ...Typography.h2,
    fontSize: 18,
  },
  resourceCountText: {
    fontSize: 13,
    fontWeight: '600',
  },
  resourcesList: {
    gap: Spacing.three,
  },
  sectionCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
    gap: Spacing.two + 2,
  },
  cardHeading: {
    ...Typography.h2,
    fontSize: 17,
  },
  bulletList: {
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  bulletText: {
    flex: 1,
    ...Typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  contextText: {
    ...Typography.body,
    fontSize: 14,
    lineHeight: 22,
  },
  bottomCtaRow: {
    marginTop: Spacing.two,
  },
  mainCtaBtn: {
    height: 56,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.primaryBtn,
  },
  mainCtaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    borderRadius: BorderRadius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.two + 2,
    ...Shadows.card,
  },
  modalIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalEmoji: {
    fontSize: 28,
  },
  modalTitle: {
    ...Typography.h2,
    fontSize: 19,
    textAlign: 'center',
  },
  modalSubtitle: {
    ...Typography.body,
    fontSize: 14,
    textAlign: 'center',
  },
  archNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.two,
    marginVertical: 4,
  },
  archNoticeIcon: {
    fontSize: 16,
  },
  archNoticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  modalMetaRow: {
    marginTop: 2,
  },
  modalMetaLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalActions: {
    width: '100%',
    marginTop: Spacing.two,
  },
  modalCloseBtn: {
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
