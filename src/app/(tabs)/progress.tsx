import React from 'react';
import {
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
import { useTheme } from '@/hooks/use-theme';

export default function ProgressScreen() {
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Page Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Your Learning Progress</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            A simple overview of your mastery, study streak, and completed topics.
          </Text>
        </View>

        {/* Overall Mastery Highlight Card */}
        <View
          style={[
            styles.masteryCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}>
          <View style={styles.masteryHeader}>
            <View>
              <Text style={[styles.masteryLabel, { color: theme.textSecondary }]}>
                Overall Mastery
              </Text>
              <Text style={[styles.masteryPercentage, { color: theme.primary }]}>
                74%
              </Text>
            </View>
            <View style={[styles.streakBadge, { backgroundColor: theme.warningLight }]}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={[styles.streakText, { color: theme.warning }]}>5 Day Streak</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={[styles.progressBarBg, { backgroundColor: theme.backgroundElement }]}>
            <View
              style={[
                styles.progressBarFill,
                { backgroundColor: theme.primary, width: '74%' },
              ]}
            />
          </View>

          <Text style={[styles.masteryHint, { color: theme.textSecondary }]}>
            You have mastered 12 out of 16 core curriculum competencies.
          </Text>
        </View>

        {/* 2x2 Student Core Stats */}
        <View style={styles.statsGrid}>
          {/* Stat 1 */}
          <View
            style={[
              styles.statBox,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={styles.statEmoji}>📚</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>12 / 16</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Topics Completed
            </Text>
          </View>

          {/* Stat 2 */}
          <View
            style={[
              styles.statBox,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={styles.statEmoji}>🎯</Text>
            <Text style={[styles.statValue, { color: theme.success }]}>88%</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Quiz Performance
            </Text>
          </View>

          {/* Stat 3 */}
          <View
            style={[
              styles.statBox,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={styles.statEmoji}>⚡</Text>
            <Text style={[styles.statValue, { color: theme.accent }]}>14</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Quizzes Taken
            </Text>
          </View>

          {/* Stat 4 */}
          <View
            style={[
              styles.statBox,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={styles.statEmoji}>⏱️</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>6.5 hrs</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Total Study Time
            </Text>
          </View>
        </View>

        {/* Simple Topic Breakdown */}
        <View
          style={[
            styles.topicsCard,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Topic Breakdown</Text>

          {[
            { topic: 'Python & Vector Embeddings', score: 95, status: 'Mastered ✓' },
            { topic: 'RAG Architecture & Retrieval', score: 78, status: 'In Progress' },
            { topic: 'Autonomous Agent State Loops', score: 62, status: 'Practicing' },
            { topic: 'Async & Performance Optimization', score: 88, status: 'Mastered ✓' },
          ].map((item, idx) => (
            <View key={idx} style={styles.topicItem}>
              <View style={styles.topicHeaderRow}>
                <Text style={[styles.topicTitle, { color: theme.text }]}>
                  {item.topic}
                </Text>
                <Text
                  style={[
                    styles.topicStatus,
                    {
                      color:
                        item.score >= 85
                          ? theme.success
                          : item.score >= 70
                          ? theme.accent
                          : theme.warning,
                    },
                  ]}>
                  {item.status} ({item.score}%)
                </Text>
              </View>

              <View style={[styles.topicTrackBg, { backgroundColor: theme.backgroundElement }]}>
                <View
                  style={[
                    styles.topicTrackFill,
                    {
                      width: `${item.score}%`,
                      backgroundColor:
                        item.score >= 85
                          ? theme.success
                          : item.score >= 70
                          ? theme.accent
                          : theme.warning,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Student-Friendly AI Insight */}
        <View
          style={[
            styles.agentTipBox,
            { backgroundColor: theme.primaryLight, borderColor: theme.cardBorder },
          ]}>
          <Text style={styles.agentTipIcon}>💡</Text>
          <View style={styles.agentTipContent}>
            <Text style={[styles.agentTipTitle, { color: theme.primaryDark }]}>
              Agent Insight
            </Text>
            <Text style={[styles.agentTipBody, { color: theme.primaryDark }]}>
              High accuracy on Vector Embeddings! Next session will accelerate directly to advanced Agent Memory architectures.
            </Text>
          </View>
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
  masteryCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
    gap: Spacing.two,
  },
  masteryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  masteryLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  masteryPercentage: {
    fontSize: 34,
    fontWeight: '800',
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    gap: 6,
  },
  streakEmoji: {
    fontSize: 16,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  masteryHint: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    borderRadius: BorderRadius.card,
    padding: Spacing.three + 2,
    borderWidth: 1,
    ...Shadows.card,
    alignItems: 'center',
    gap: 4,
  },
  statEmoji: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  topicsCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
    gap: Spacing.three,
  },
  cardTitle: {
    ...Typography.h2,
    fontSize: 18,
  },
  topicItem: {
    gap: 6,
  },
  topicHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  topicStatus: {
    fontSize: 13,
    fontWeight: '700',
  },
  topicTrackBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  topicTrackFill: {
    height: '100%',
    borderRadius: 3,
  },
  agentTipBox: {
    flexDirection: 'row',
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  agentTipIcon: {
    fontSize: 24,
  },
  agentTipContent: {
    flex: 1,
    gap: 2,
  },
  agentTipTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  agentTipBody: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
