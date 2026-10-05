import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
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

export default function AiExplanationScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { topicId: rawTopicId } = useLocalSearchParams<{ topicId?: string }>();
  const { markResourceWatched } = useAssessment();

  const topicId = typeof rawTopicId === 'string' && rawTopicId.trim() ? rawTopicId : 'ds-probability';
  const topic = useMemo(() => getMockTopicById(topicId), [topicId]);

  // Simulated video playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressSec, setProgressSec] = useState<number>(0);
  const totalDurationSec = 180; // 3 minutes

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSec((prev) => {
          if (prev >= totalDurationSec) {
            setIsPlaying(false);
            markResourceWatched(topic.id);
            return totalDurationSec;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalDurationSec, topic.id, markResourceWatched]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
              <Text style={[styles.badgePillText, { color: theme.primary }]}>AI TUTOR</Text>
            </View>
          </View>

          {/* Header & Subtitle */}
          <Text style={[styles.title, { color: theme.text }]}>AI Explanation</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            An explanation adapted to your learning level.
          </Text>

          {/* Large Video-Player-Style Card */}
          <View
            style={[
              styles.videoPlayerCard,
              { backgroundColor: '#0B0F19', borderColor: theme.cardBorder },
            ]}>
            {/* Top Video Header */}
            <View style={styles.videoHeaderRow}>
              <View style={styles.videoTagPill}>
                <Text style={styles.videoTagText}>AI EXPLANATION</Text>
              </View>
              <Text style={styles.videoRuntimeText}>
                {formatTime(progressSec)} / {formatTime(totalDurationSec)}
              </Text>
            </View>

            {/* Central Play/Preview Display */}
            <View style={styles.videoDisplayArea}>
              <Pressable
                onPress={togglePlay}
                style={styles.playButtonCircle}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={isPlaying ? 'Pause video' : 'Play video'}>
                <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
              </Pressable>
              <Text style={styles.videoTitleText}>
                {topic.title} explained in 3 minutes
              </Text>
              <Text style={styles.videoSubtitleText}>
                Visualized with coin toss simulations & machine learning intuition
              </Text>
            </View>

            {/* Scrub Bar & Controls */}
            <View style={styles.scrubberContainer}>
              <View style={styles.scrubTrack}>
                <View
                  style={[
                    styles.scrubFill,
                    {
                      width: `${(progressSec / totalDurationSec) * 100}%`,
                      backgroundColor: theme.primary,
                    },
                  ]}
                />
              </View>
              <View style={styles.scrubberActionsRow}>
                <Pressable onPress={togglePlay} style={styles.smallPlayToggle}>
                  <Text style={styles.smallPlayText}>
                    {isPlaying ? 'Pause' : 'Play'}
                  </Text>
                </Pressable>
                <Text style={styles.scrubberTimestamp}>
                  {progressSec >= totalDurationSec ? 'Finished ✓' : `${Math.round((progressSec / totalDurationSec) * 100)}% viewed`}
                </Text>
              </View>
            </View>
          </View>

          {/* AI Tutor Card */}
          <View
            style={[
              styles.tutorCard,
              { backgroundColor: theme.card, borderColor: theme.primary },
            ]}>
            <View style={styles.tutorHeaderRow}>
              <View style={[styles.avatarBox, { backgroundColor: theme.primaryLight }]}>
                <Text style={styles.avatarEmoji}>🤖</Text>
              </View>
              <View style={styles.tutorTitles}>
                <Text style={[styles.tutorName, { color: theme.text }]}>AI Tutor</Text>
                <Text style={[styles.tutorSubtitle, { color: theme.textSecondary }]}>
                  Let me explain this in a simpler way.
                </Text>
              </View>
            </View>

            <Text style={[styles.tutorExplanationText, { color: theme.text }]}>
              {topic.aiVideo?.simplifiedExplanation ||
                topic.explanation.intro}
            </Text>

            {/* Simple Example Section */}
            <View style={[styles.subSectionBox, { backgroundColor: theme.backgroundElement }]}>
              <Text style={[styles.subSectionTitle, { color: theme.text }]}>
                🎲 Simple Example
              </Text>
              <Text style={[styles.subSectionContent, { color: theme.textSecondary }]}>
                {topic.aiVideo?.simpleExample ||
                  topic.explanation.example}
              </Text>
            </View>

            {/* Why this matters in Machine Learning */}
            <View
              style={[
                styles.subSectionBox,
                { backgroundColor: theme.primaryLight, borderColor: theme.primary },
              ]}>
              <Text style={[styles.subSectionTitle, { color: theme.primaryDark }]}>
                💡 Why this matters in Machine Learning
              </Text>
              <Text style={[styles.subSectionContent, { color: theme.primaryDark }]}>
                {topic.aiVideo?.whyItMatters ||
                  topic.explanation.whyItMatters ||
                  'Machine learning algorithms use probabilities to assess confidence and make predictions.'}
              </Text>
            </View>
          </View>

          {/* Action Buttons as requested: [Start Explanation] [Practice This Topic] [Take Quiz] */}
          <View style={styles.actionsContainer}>
            <Pressable
              onPress={togglePlay}
              style={[styles.primaryActionBtn, { backgroundColor: theme.primary }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Start Explanation">
              <Text style={styles.primaryActionBtnText}>
                {isPlaying ? '⏸ Pause Explanation' : '▶ Start Explanation'}
              </Text>
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
                ✏️ Practice This Topic
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/learning/topic/[topicId]/quiz',
                  params: { topicId: topic.id },
                })
              }
              style={[
                styles.quizActionBtn,
                { backgroundColor: theme.backgroundSelected, borderColor: theme.primary },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Take Quiz">
              <Text style={[styles.quizActionBtnText, { color: theme.primaryDark }]}>
                🧠 Take Quiz
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
  videoPlayerCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    marginBottom: Spacing.four,
    minHeight: 240,
    justifyContent: 'space-between',
    ...Shadows.card,
  },
  videoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoTagPill: {
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  videoTagText: {
    color: '#A5B4FC',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  videoRuntimeText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  videoDisplayArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
  },
  playButtonCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    marginLeft: 2,
  },
  videoTitleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  videoSubtitleText: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 320,
  },
  scrubberContainer: {
    marginTop: Spacing.two,
  },
  scrubTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.two,
  },
  scrubFill: {
    height: '100%',
    borderRadius: 2,
  },
  scrubberActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallPlayToggle: {
    paddingVertical: 2,
  },
  smallPlayText: {
    color: '#A5B4FC',
    fontSize: 12,
    fontWeight: '700',
  },
  scrubberTimestamp: {
    color: '#94A3B8',
    fontSize: 12,
  },
  tutorCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 2,
    marginBottom: Spacing.four,
    ...Shadows.card,
  },
  tutorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
    gap: Spacing.three,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  tutorTitles: {
    flex: 1,
  },
  tutorName: {
    ...Typography.h2,
    fontSize: 18,
    marginBottom: 2,
  },
  tutorSubtitle: {
    ...Typography.subtext,
  },
  tutorExplanationText: {
    ...Typography.body,
    lineHeight: 24,
    marginBottom: Spacing.four,
  },
  subSectionBox: {
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.three,
  },
  subSectionTitle: {
    ...Typography.bodyBold,
    marginBottom: Spacing.one,
  },
  subSectionContent: {
    ...Typography.body,
    lineHeight: 22,
  },
  actionsContainer: {
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
  quizActionBtn: {
    paddingVertical: 13,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    minHeight: 48,
  },
  quizActionBtnText: {
    ...Typography.subtext,
    fontWeight: '700',
  },
});
