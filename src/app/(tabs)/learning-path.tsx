import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  BorderRadius,
  MaxContentWidth,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useAssessment } from '@/context/assessment-context';
import { useTheme } from '@/hooks/use-theme';
import { TopicItem } from '@/types/assessment';

export default function LearningPathScreen() {
  const router = useRouter();
  const theme = useTheme();
  const {
    goalTitle,
    goalIcon,
    result,
    roadmap,
    currentTopic,
    completedTopicIds,
    adaptiveNotification,
    dismissNotification,
  } = useAssessment();

  // Group topics by category
  const groupedSections = useMemo(() => {
    const groups: { category: string; topics: TopicItem[] }[] = [];
    roadmap.forEach((item) => {
      let group = groups.find((g) => g.category === item.sectionCategory);
      if (!group) {
        group = { category: item.sectionCategory, topics: [] };
        groups.push(group);
      }
      group.topics.push(item);
    });
    return groups;
  }, [roadmap]);

  const totalTopics = roadmap.length || 12;
  const completedCount = completedTopicIds.length;
  const readiness = result?.overallScore || 68;
  const currentLevel = readiness >= 75 ? 'Intermediate' : 'Beginner / Intermediate';
  const estimatedWeeks = totalTopics <= 8 ? '8 weeks' : '12 weeks';

  // Adaptive breakdown from results
  const strongSkills = result?.strengths?.length
    ? result.strengths.slice(0, 2)
    : ['Python Fundamentals'];
  const focusSkills = result?.focusAreas?.length
    ? result.focusAreas.slice(0, 2)
    : ['Statistics & Probability'];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Dynamic Notification Banner when AI re-calibrates roadmap */}
        {adaptiveNotification && (
          <View
            style={[
              styles.notificationBanner,
              { backgroundColor: theme.primaryLight, borderColor: theme.primary },
            ]}>
            <View style={styles.notificationHeader}>
              <View style={styles.notificationTitleRow}>
                <Text style={styles.notificationIcon}>⚡</Text>
                <Text style={[styles.notificationTitle, { color: theme.primaryDark }]}>
                  {adaptiveNotification.title}
                </Text>
              </View>
              <Pressable
                onPress={dismissNotification}
                hitSlop={8}
                style={styles.closeBtn}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Dismiss notification">
                <Text style={[styles.closeBtnText, { color: theme.primaryDark }]}>✕</Text>
              </Pressable>
            </View>
            <Text style={[styles.notificationMessage, { color: theme.primaryDark }]}>
              {adaptiveNotification.message}
            </Text>
          </View>
        )}

        {/* Top Goal Pill & Readiness Badge */}
        <View style={styles.topPillRow}>
          <View style={[styles.goalPill, { backgroundColor: theme.primaryLight }]}>
            <Text style={styles.goalIcon}>{goalIcon}</Text>
            <Text style={[styles.goalPillText, { color: theme.primary }]}>
              {goalTitle}
            </Text>
          </View>

          <View style={[styles.readinessPill, { backgroundColor: theme.successLight }]}>
            <Text style={[styles.readinessText, { color: theme.success }]}>
              {readiness}% Readiness
            </Text>
          </View>
        </View>

        {/* Strong Page Title & Subtitle */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Your Personalized Learning Path
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Built from your goal, current skills, and diagnostic assessment.
          </Text>
        </View>

        {/* 1. TOP SUMMARY CARD */}
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Target Goal</Text>
              <Text style={[styles.summaryVal, { color: theme.text }]}>{goalTitle}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Current Level</Text>
              <Text style={[styles.summaryVal, { color: theme.text }]}>{currentLevel}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Overall Readiness</Text>
              <Text style={[styles.summaryVal, { color: theme.primary }]}>{readiness}%</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Estimated Time</Text>
              <Text style={[styles.summaryVal, { color: theme.text }]}>{estimatedWeeks}</Text>
            </View>
          </View>

          {/* Overall Roadmap Progress Track */}
          <View style={styles.overallTrackContainer}>
            <View style={styles.overallTrackHeader}>
              <Text style={[styles.trackLabel, { color: theme.textSecondary }]}>
                Roadmap Progress
              </Text>
              <Text style={[styles.trackCount, { color: theme.primary }]}>
                {completedCount} of {totalTopics} Completed
              </Text>
            </View>
            <View style={[styles.trackBg, { backgroundColor: theme.backgroundElement }]}>
              <View
                style={[
                  styles.trackFill,
                  {
                    backgroundColor: theme.primary,
                    width: `${Math.round((completedCount / totalTopics) * 100)}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* 2. ADAPTIVE PERSONALIZATION CARD: "Why this path?" */}
        <View
          style={[
            styles.adaptiveCard,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}>
          <View style={styles.adaptiveHeader}>
            <View style={[styles.aiSparkleBox, { backgroundColor: theme.primaryLight }]}>
              <Text style={styles.aiSparkleIcon}>⚡</Text>
            </View>
            <View>
              <Text style={[styles.adaptiveTitle, { color: theme.text }]}>Why this path?</Text>
              <Text style={[styles.adaptiveSub, { color: theme.textSecondary }]}>
                Diagnostic calibrations based on your initial assessment:
              </Text>
            </View>
          </View>

          {/* Assessment Findings */}
          <View style={styles.findingsRow}>
            <View style={[styles.findingBox, { backgroundColor: theme.backgroundElement }]}>
              <Text style={[styles.findingLabel, { color: theme.success }]}>✓ Strong baseline:</Text>
              <Text style={[styles.findingText, { color: theme.text }]}>
                {strongSkills.join(', ')}
              </Text>
            </View>

            <View style={[styles.findingBox, { backgroundColor: theme.backgroundElement }]}>
              <Text style={[styles.findingLabel, { color: theme.warning }]}>→ Needs focus:</Text>
              <Text style={[styles.findingText, { color: theme.text }]}>
                {focusSkills.join(', ')}
              </Text>
            </View>
          </View>

          {/* Adaptive Adjustments Bullet Points */}
          <View style={styles.adjustmentsList}>
            <View style={styles.adjItem}>
              <Text style={[styles.adjCheck, { color: theme.success }]}>✓</Text>
              <Text style={[styles.adjText, { color: theme.textSecondary }]}>
                Bypassed redundant basic syntax drills based on your verified strengths.
              </Text>
            </View>
            <View style={styles.adjItem}>
              <Text style={[styles.adjCheck, { color: theme.primary }]}>⚡</Text>
              <Text style={[styles.adjText, { color: theme.textSecondary }]}>
                Allocated focused step-by-step practice to {focusSkills[0] || 'core analytics'}.
              </Text>
            </View>
            <View style={styles.adjItem}>
              <Text style={[styles.adjCheck, { color: theme.textMuted }]}>🔒</Text>
              <Text style={[styles.adjText, { color: theme.textSecondary }]}>
                Preserved sequential unlocks for advanced Machine Learning capstones.
              </Text>
            </View>
          </View>
        </View>

        {/* 3. CURRENT TOPIC HIGHLIGHT CARD */}
        {currentTopic && (
          <View
            style={[
              styles.currentTopicCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.primary,
              },
            ]}>
            <View style={styles.currentCardTopRow}>
              <View style={[styles.activeTag, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.activeTagText, { color: theme.primary }]}>
                  CURRENT FOCUS • MODULE {currentTopic.number}
                </Text>
              </View>
              <View style={[styles.timeChip, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.timeChipText, { color: theme.textSecondary }]}>
                  ⏱ {currentTopic.estimatedTime}
                </Text>
              </View>
            </View>

            <Text style={[styles.currentTopicHeading, { color: theme.text }]}>
              {currentTopic.title}
            </Text>

            <Text style={[styles.currentTopicDesc, { color: theme.textSecondary }]}>
              {currentTopic.shortDescription}
            </Text>

            {/* Topic Meta Row */}
            <View style={styles.currentMetaRow}>
              <View style={[styles.currentMetaChip, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.currentMetaChipText, { color: theme.textSecondary }]}>
                  Difficulty: <Text style={{ color: theme.text, fontWeight: '700' }}>{currentTopic.difficulty}</Text>
                </Text>
              </View>
              <View style={[styles.currentMetaChip, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.currentMetaChipText, { color: theme.textSecondary }]}>
                  Progress: <Text style={{ color: theme.primary, fontWeight: '700' }}>{currentTopic.progressPercent}%</Text>
                </Text>
              </View>
            </View>

            {/* Current Status & Resources Availability */}
            <View style={[styles.resourcesAvailableBox, { backgroundColor: theme.backgroundElement }]}>
              <View style={styles.resAvailHeader}>
                <Text style={[styles.resAvailTitle, { color: theme.textSecondary }]}>
                  STATUS: <Text style={{ color: theme.primary, fontWeight: '800' }}>LEARNING</Text>
                </Text>
                <Text style={[styles.resCountText, { color: theme.textSecondary }]}>
                  5 Resources Ready
                </Text>
              </View>

              <View style={styles.resTagsRow}>
                <View style={[styles.miniResTag, { backgroundColor: theme.primaryLight }]}>
                  <Text style={[styles.miniResTagText, { color: theme.primary }]}>▶ AI Video (4m)</Text>
                </View>
                <View style={[styles.miniResTag, { backgroundColor: theme.card }]}>
                  <Text style={[styles.miniResTagText, { color: theme.textSecondary }]}>🎥 YouTube</Text>
                </View>
                <View style={[styles.miniResTag, { backgroundColor: theme.card }]}>
                  <Text style={[styles.miniResTagText, { color: theme.textSecondary }]}>📖 Notes</Text>
                </View>
                <View style={[styles.miniResTag, { backgroundColor: theme.accentLight }]}>
                  <Text style={[styles.miniResTagText, { color: theme.accent }]}>🧩 Practice</Text>
                </View>
                <View style={[styles.miniResTag, { backgroundColor: theme.card }]}>
                  <Text style={[styles.miniResTagText, { color: theme.textSecondary }]}>📝 Quiz</Text>
                </View>
              </View>
            </View>

            {/* Current Topic Progress Bar */}
            <View style={[styles.topicProgressBarBg, { backgroundColor: theme.backgroundElement }]}>
              <View
                style={[
                  styles.topicProgressBarFill,
                  {
                    backgroundColor: theme.primary,
                    width: `${Math.max(currentTopic.progressPercent, 10)}%`,
                  },
                ]}
              />
            </View>

            {/* Primary Action Button */}
            <View style={styles.currentTopicActions}>
              <Pressable
                onPress={() => router.push('/today')}
                style={({ pressed }) => [
                  styles.continueBtn,
                  {
                    backgroundColor: theme.primary,
                    opacity: pressed ? 0.92 : 1,
                    transform: [{ scale: pressed ? 0.985 : 1 }],
                  },
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Continue Learning">
                <Text style={styles.continueBtnText}>Continue Learning →</Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/topic/[id]',
                    params: { id: currentTopic.id },
                  })
                }
                style={({ pressed }) => [
                  styles.syllabusBtn,
                  {
                    backgroundColor: theme.primaryLight,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="View Topic Details">
                <Text style={[styles.syllabusBtnText, { color: theme.primary }]}>
                  View Topic Syllabus & Details
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* 4. COMPLETE ROADMAP JOURNEY */}
        <View style={styles.roadmapHeader}>
          <Text style={[styles.roadmapSectionTitle, { color: theme.text }]}>
            Complete Curriculum Roadmap
          </Text>
          <Text style={[styles.roadmapSectionSub, { color: theme.textSecondary }]}>
            Tap any module to view topic breakdown, prerequisites, and lesson notes.
          </Text>
        </View>

        <View style={styles.groupsContainer}>
          {groupedSections.map((group, groupIdx) => (
            <View key={groupIdx} style={styles.categorySection}>
              {/* Category Header with Divider */}
              <View style={styles.categoryHeaderRow}>
                <View style={[styles.categoryBadge, { backgroundColor: theme.primaryLight }]}>
                  <Text style={[styles.categoryBadgeText, { color: theme.primary }]}>
                    {group.category}
                  </Text>
                </View>
                <View style={[styles.categoryLine, { backgroundColor: theme.cardBorder }]} />
              </View>

              {/* Topics in Category */}
              <View style={styles.categoryTopicsList}>
                {group.topics.map((item) => {
                  const isCurrent = item.status === 'current';
                  const isCompleted = item.status === 'completed';
                  const isLocked = item.status === 'locked';

                  const isNeedsReview = item.status === 'needs_review';

                  let statusBadgeText = '○ Upcoming';
                  let statusBg: string = theme.backgroundElement;
                  let statusColor: string = theme.textMuted;

                  if (isCompleted) {
                    statusBadgeText = '✓ Completed';
                    statusBg = theme.successLight;
                    statusColor = theme.success;
                  } else if (isNeedsReview) {
                    statusBadgeText = '⚠️ Needs Review';
                    statusBg = theme.errorLight;
                    statusColor = theme.error;
                  } else if (isCurrent) {
                    statusBadgeText = '→ Learning';
                    statusBg = theme.primaryLight;
                    statusColor = theme.primary;
                  } else if (isLocked) {
                    statusBadgeText = '🔒 Locked';
                    statusBg = theme.backgroundElement;
                    statusColor = theme.textMuted;
                  }

                  return (
                    <Pressable
                      key={item.id}
                      onPress={() =>
                        router.push({
                          pathname: '/topic/[id]',
                          params: { id: item.id },
                        })
                      }
                      style={({ pressed }) => [
                        styles.moduleCard,
                        {
                          backgroundColor: theme.card,
                          borderColor: isNeedsReview
                            ? theme.error
                            : isCurrent
                            ? theme.primary
                            : theme.cardBorder,
                          borderWidth: isCurrent || isNeedsReview ? 2 : 1,
                          opacity: pressed ? 0.9 : 1,
                        },
                        isCurrent && {
                          ...Shadows.primaryBtn,
                          shadowOpacity: 0.15,
                        },
                      ]}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={`Topic ${item.number}: ${item.title}, Status: ${statusBadgeText}`}>
                      {/* Card Header */}
                      <View style={styles.cardHeader}>
                        <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
                          <Text style={[styles.statusPillText, { color: statusColor }]}>
                            {statusBadgeText}
                          </Text>
                        </View>

                        <Text style={[styles.moduleBadge, { color: theme.textSecondary }]}>
                          Topic {item.number}
                        </Text>
                      </View>

                      {/* Topic Title */}
                      <Text
                        style={[
                          styles.moduleTitle,
                          { color: isCurrent ? theme.primary : theme.text },
                        ]}>
                        {item.title}
                      </Text>

                      {/* Short Description */}
                      <Text style={[styles.moduleDesc, { color: theme.textSecondary }]}>
                        {item.shortDescription}
                      </Text>

                      {/* Resources Available Row */}
                      <View style={styles.resMiniBar}>
                        <Text style={[styles.resMiniLabel, { color: theme.textMuted }]}>
                          Resources:
                        </Text>
                        <Text style={[styles.resMiniItems, { color: theme.textSecondary }]}>
                          ▶ AI Video • 🎥 YouTube • 📖 Notes • 🧩 Practice • 📝 Quiz
                        </Text>
                      </View>

                      {/* Metadata Row */}
                      <View style={styles.metadataRow}>
                        <View style={[styles.metaChip, { backgroundColor: theme.backgroundElement }]}>
                          <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>
                            ⏱ {item.estimatedTime}
                          </Text>
                        </View>
                        <View style={[styles.metaChip, { backgroundColor: theme.backgroundElement }]}>
                          <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>
                            ⚡ {item.difficulty}
                          </Text>
                        </View>
                        <View style={[styles.metaChip, { backgroundColor: theme.backgroundElement }]}>
                          <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>
                            📊 {item.progressPercent}%
                          </Text>
                        </View>
                      </View>

                      {/* Progress Track */}
                      <View style={[styles.progressTrackBg, { backgroundColor: theme.backgroundElement }]}>
                        <View
                          style={[
                            styles.progressTrackFill,
                            {
                              width: `${item.progressPercent}%`,
                              backgroundColor: isCompleted
                                ? theme.success
                                : isNeedsReview
                                ? theme.error
                                : isCurrent
                                ? theme.primary
                                : theme.textMuted,
                            },
                          ]}
                        />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
  },
  notificationBanner: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1.5,
    gap: 6,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  notificationIcon: {
    fontSize: 16,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  notificationMessage: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  topPillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    gap: 8,
  },
  goalIcon: {
    fontSize: 16,
  },
  goalPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  readinessPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
  },
  readinessText: {
    fontSize: 12,
    fontWeight: '800',
  },
  header: {
    gap: Spacing.one,
  },
  title: {
    ...Typography.h1,
  },
  subtitle: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  summaryCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
    gap: Spacing.four,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  summaryItem: {
    width: '46%',
    gap: 3,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  summaryVal: {
    fontSize: 15,
    fontWeight: '700',
  },
  overallTrackContainer: {
    gap: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  overallTrackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  trackCount: {
    fontSize: 13,
    fontWeight: '700',
  },
  trackBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 4,
  },
  adaptiveCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
    gap: Spacing.three,
  },
  adaptiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
  },
  aiSparkleBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSparkleIcon: {
    fontSize: 18,
  },
  adaptiveTitle: {
    ...Typography.h3,
    fontSize: 17,
  },
  adaptiveSub: {
    fontSize: 13,
    lineHeight: 18,
  },
  findingsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  findingBox: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    gap: 3,
  },
  findingLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  findingText: {
    fontSize: 13,
    fontWeight: '700',
  },
  adjustmentsList: {
    gap: 8,
    marginTop: 2,
  },
  adjItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  adjCheck: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  adjText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  currentTopicCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.four,
    borderWidth: 2,
    ...Shadows.primaryBtn,
    shadowOpacity: 0.14,
    gap: Spacing.two + 2,
  },
  currentCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  activeTagText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  timeChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  currentTopicHeading: {
    ...Typography.h2,
    fontSize: 20,
    lineHeight: 26,
  },
  currentTopicDesc: {
    ...Typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  currentMetaRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  currentMetaChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  currentMetaChipText: {
    fontSize: 12,
  },
  resourcesAvailableBox: {
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    gap: 6,
    marginTop: 2,
  },
  resAvailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resAvailTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resCountText: {
    fontSize: 11,
    fontWeight: '600',
  },
  resTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  miniResTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  miniResTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  topicProgressBarBg: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 2,
  },
  topicProgressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  resMiniBar: {
    gap: 2,
    marginVertical: 2,
  },
  resMiniLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  resMiniItems: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  currentTopicActions: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  continueBtn: {
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  syllabusBtn: {
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syllabusBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  roadmapHeader: {
    marginTop: Spacing.two,
    gap: 3,
  },
  roadmapSectionTitle: {
    ...Typography.h2,
    fontSize: 18,
  },
  roadmapSectionSub: {
    ...Typography.body,
    fontSize: 13,
  },
  groupsContainer: {
    gap: Spacing.four,
  },
  categorySection: {
    gap: Spacing.three,
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  categoryLine: {
    flex: 1,
    height: 1,
  },
  categoryTopicsList: {
    gap: Spacing.three,
  },
  moduleCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    gap: Spacing.two + 2,
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  moduleBadge: {
    fontSize: 12,
    fontWeight: '600',
  },
  moduleTitle: {
    ...Typography.h3,
    fontSize: 17,
    lineHeight: 23,
  },
  moduleDesc: {
    ...Typography.body,
    fontSize: 13,
    lineHeight: 19,
  },
  metadataRow: {
    flexDirection: 'row',
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
  progressTrackBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 2,
  },
  progressTrackFill: {
    height: '100%',
    borderRadius: 3,
  },
});
