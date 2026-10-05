import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Linking,
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
import { YouTubeResource } from '@/types/learning';

export default function YouTubeResourceScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { topicId: rawTopicId } = useLocalSearchParams<{ topicId?: string }>();

  const topicId = typeof rawTopicId === 'string' && rawTopicId.trim() ? rawTopicId : 'ds-probability';
  const topic = useMemo(() => getMockTopicById(topicId), [topicId]);

  const defaultYt: YouTubeResource = {
    id: `yt-${topic.id}`,
    topicId: topic.id,
    title: `${topic.title} for Machine Learning Beginners`,
    channel: 'Example Learning Channel',
    duration: '12 min',
    url: 'https://youtube.com/mock/curated-guide',
    description: `Beginner-friendly explanation of ${topic.title} with worked machine learning examples and intuition.`,
    difficulty: topic.difficulty,
  };

  const video = topic.youtubeResources?.[0] || defaultYt;

  // Simulated embedded player playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleOpenExternal = () => {
    // Graceful external link simulation
    Linking.openURL(video.url).catch(() => {
      // Mock link
    });
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
            <View style={[styles.badgePill, { backgroundColor: '#FEE2E2' }]}>
              <Text style={[styles.badgePillText, { color: '#DC2626' }]}>YOUTUBE VIDEO</Text>
            </View>
          </View>

          {/* Header */}
          <Text style={[styles.title, { color: theme.text }]}>Curated Video Lesson</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Hand-picked lecture from top educators to reinforce your understanding.
          </Text>

          {/* Video Player Style Placeholder Card */}
          <View
            style={[
              styles.videoPlayerCard,
              { backgroundColor: '#0B0F19', borderColor: theme.cardBorder },
            ]}>
            <View style={styles.videoHeaderRow}>
              <View style={styles.redBadge}>
                <Text style={styles.redBadgeText}>▶ YOUTUBE</Text>
              </View>
              <Text style={styles.durationTag}>{video.duration}</Text>
            </View>

            <View style={styles.videoDisplayArea}>
              <Pressable
                onPress={() => setIsPlaying((prev) => !prev)}
                style={styles.playButtonCircle}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Play Video Preview">
                <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
              </Pressable>
              <Text style={styles.videoTitleText}>{video.title}</Text>
              <Text style={styles.channelText}>Channel: {video.channel}</Text>
            </View>

            <View style={styles.videoFooterRow}>
              <Text style={styles.footerNote}>
                {isPlaying ? 'Streaming preview active' : 'Tap play for preview or open full lecture below'}
              </Text>
            </View>
          </View>

          {/* Recommended Video Details Card */}
          <View
            style={[
              styles.detailsCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <View style={styles.detailsHeaderRow}>
              <Text style={[styles.detailsBadge, { backgroundColor: theme.backgroundElement, color: theme.textSecondary }]}>
                RECOMMENDED VIDEO
              </Text>
              <Text style={[styles.difficultyText, { color: theme.primary }]}>
                {video.difficulty}
              </Text>
            </View>

            <Text style={[styles.detailsTitle, { color: theme.text }]}>{video.title}</Text>
            <Text style={[styles.channelName, { color: theme.primary }]}>
              👤 {video.channel} • ⏱ {video.duration}
            </Text>
            <Text style={[styles.descriptionText, { color: theme.textSecondary }]}>
              {video.description}
            </Text>

            {/* Direct Open Button */}
            <Pressable
              onPress={handleOpenExternal}
              style={[styles.youtubeBtn, { backgroundColor: '#DC2626' }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Watch on YouTube">
              <Text style={styles.youtubeBtnText}>▶ Watch on YouTube</Text>
            </Pressable>
          </View>

          {/* Key Takeaways */}
          <View
            style={[
              styles.takeawaysCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={[styles.takeawaysTitle, { color: theme.text }]}>What this video covers:</Text>
            <View style={styles.takeawaysList}>
              <Text style={[styles.takeawayItem, { color: theme.textSecondary }]}>
                • Intuitive geometric and tree diagram visualizations
              </Text>
              <Text style={[styles.takeawayItem, { color: theme.textSecondary }]}>
                • Real-world case study solving sample machine learning problems
              </Text>
              <Text style={[styles.takeawayItem, { color: theme.textSecondary }]}>
                • Common mistakes students make on certification exams
              </Text>
            </View>
          </View>

          {/* Bottom Actions */}
          <View style={styles.actionsContainer}>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/learning/topic/[topicId]/practice',
                  params: { topicId: topic.id },
                })
              }
              style={[styles.primaryActionBtn, { backgroundColor: theme.primary }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Practice This Topic">
              <Text style={styles.primaryActionBtnText}>✏️ Practice This Topic</Text>
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
    minHeight: 220,
    justifyContent: 'space-between',
    ...Shadows.card,
  },
  videoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  redBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  redBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  durationTag: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  videoDisplayArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
  },
  playButtonCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 22,
    marginLeft: 2,
  },
  videoTitleText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  channelText: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
  },
  videoFooterRow: {
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  footerNote: {
    color: '#64748B',
    fontSize: 11,
  },
  detailsCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    marginBottom: Spacing.four,
    ...Shadows.card,
  },
  detailsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  detailsBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  difficultyText: {
    ...Typography.caption,
    fontWeight: '700',
  },
  detailsTitle: {
    ...Typography.h2,
    marginBottom: Spacing.one,
  },
  channelName: {
    ...Typography.subtext,
    fontWeight: '600',
    marginBottom: Spacing.two,
  },
  descriptionText: {
    ...Typography.body,
    lineHeight: 22,
    marginBottom: Spacing.four,
  },
  youtubeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: BorderRadius.lg,
    minHeight: 48,
    ...Shadows.primaryBtn,
  },
  youtubeBtnText: {
    color: '#FFFFFF',
    ...Typography.bodyBold,
  },
  takeawaysCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  takeawaysTitle: {
    ...Typography.bodyBold,
    marginBottom: Spacing.two,
  },
  takeawaysList: {
    gap: Spacing.two,
  },
  takeawayItem: {
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
