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
import { getResourcesForTopic } from '@/data/learningResources';
import { useTheme } from '@/hooks/use-theme';
import { LearningResource } from '@/types/resources';

/**
 * AI Explanation Video Screen
 * Mock video player UI with play/pause controls, time scrubber, and completion triggers.
 *
 * Future Pipeline Integration:
 * When the Explain Video Generator is connected, replace `mockVideoUrl` with the cloud stream URI
 * and query `videoStatus` ('not_generated' | 'generating' | 'ready' | 'failed') from backend.
 */
export default function AiVideoExplainerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { roadmap, watchedResources, markResourceWatched } = useAssessment();

  const topicId = typeof id === 'string' ? id : 'ds-5';
  const topic = useMemo(() => {
    return roadmap.find((t) => t.id === topicId) || {
      id: topicId,
      number: 5,
      title: 'Statistics Fundamentals',
      difficulty: 'Beginner',
      shortDescription: 'Build the foundation you need for data analysis and machine learning.',
    };
  }, [topicId, roadmap]);

  const resources = useMemo(() => {
    return getResourcesForTopic(topicId, topic.title);
  }, [topicId, topic.title]);

  const aiVideoResource: LearningResource = useMemo(() => {
    return (
      resources.find((r) => r.type === 'AI_VIDEO') || {
        id: `res-${topicId}-ai`,
        topicId,
        type: 'AI_VIDEO',
        title: 'Mean, Median & Standard Deviation',
        description: 'Visual explanation generated specifically for your learning level.',
        duration: '4 min',
        difficulty: 'Beginner',
        mockVideoUrl: 'mock://video/ai-explainer/statistics-fundamentals.mp4',
        videoStatus: 'ready',
        keyPoints: [
          'Beginner friendly visualization',
          '4 minutes focused runtime',
          'Calculated based on your learning path',
        ],
      }
    );
  }, [resources, topicId]);

  // Video playback simulation state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSeconds, setPlaybackSeconds] = useState<number>(0);
  const totalSeconds = 252; // 4 min 12 sec
  const [isMarkedWatched, setIsMarkedWatched] = useState<boolean>(
    Boolean(watchedResources[aiVideoResource.id])
  );

  // Playback timer simulation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackSeconds((prev) => {
          if (prev >= totalSeconds) {
            setIsPlaying(false);
            return totalSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(
    Math.round((playbackSeconds / totalSeconds) * 100),
    100
  );

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleMarkAsWatched = () => {
    setIsMarkedWatched(true);
    markResourceWatched(aiVideoResource.id);
  };

  const handleGoToPractice = () => {
    router.push({
      pathname: '/practice/[id]',
      params: { id: topicId },
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Header Badge */}
          <View style={styles.topHeader}>
            <View style={[styles.aiBadge, { backgroundColor: theme.primaryLight }]}>
              <Text style={styles.aiBadgeSparkle}>⚡</Text>
              <Text style={[styles.aiBadgeText, { color: theme.primary }]}>
                AI EXPLANATION
              </Text>
            </View>

            <View style={[styles.statusChip, { backgroundColor: theme.backgroundElement }]}>
              <Text style={[styles.statusChipText, { color: theme.textSecondary }]}>
                {topic.title}
              </Text>
            </View>
          </View>

          {/* Video Player Mock Container */}
          <View style={styles.playerContainer}>
            {/* 16:9 Screen Canvas */}
            <Pressable
              onPress={handleTogglePlay}
              style={styles.videoScreen}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? 'Pause AI Explainer' : 'Play AI Explainer'}>
              {/* Background Geometric / Gradient Elements */}
              <View style={styles.canvasBackground}>
                <View style={[styles.gridCircle, { borderColor: '#312E81' }]} />
                <View style={[styles.gridCircleSmall, { borderColor: '#4338CA' }]} />
              </View>

              {/* Notice label: AI-generated explanation */}
              <View style={styles.watermarkTag}>
                <Text style={styles.watermarkText}>🤖 AI-generated visual explainer</Text>
              </View>

              {/* Center Play / Pause Icon Button */}
              <View style={styles.centerControlBox}>
                <View style={[styles.playButtonCircle, isPlaying && styles.pauseCircle]}>
                  <Text style={styles.playIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
                </View>
                <Text style={styles.canvasSubtitle}>
                  {isPlaying ? 'Streaming visual animation...' : 'Tap to start lesson'}
                </Text>
              </View>

              {/* Lower Time Overlay */}
              <View style={styles.canvasBottomBar}>
                <Text style={styles.canvasTimer}>
                  {formatTime(playbackSeconds)} / {formatTime(totalSeconds)}
                </Text>
              </View>
            </Pressable>

            {/* Scrubber & Player Controls Bar */}
            <View style={[styles.playerControlsBar, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              {/* Progress Scrubber */}
              <View style={[styles.scrubberTrack, { backgroundColor: theme.backgroundElement }]}>
                <View
                  style={[
                    styles.scrubberFill,
                    { width: `${Math.max(progressPercent, 2)}%`, backgroundColor: theme.primary },
                  ]}
                />
              </View>

              <View style={styles.controlsRow}>
                <Pressable
                  onPress={handleTogglePlay}
                  style={[styles.miniPlayBtn, { backgroundColor: theme.primaryLight }]}>
                  <Text style={[styles.miniPlayBtnText, { color: theme.primary }]}>
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                  </Text>
                </Pressable>

                <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>
                  {formatTime(playbackSeconds)} / {formatTime(totalSeconds)}
                </Text>
              </View>
            </View>
          </View>

          {/* Video Metadata Card */}
          <View
            style={[
              styles.infoCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}>
            <Text style={[styles.videoTitle, { color: theme.text }]}>
              {aiVideoResource.title}
            </Text>
            <Text style={[styles.videoDescription, { color: theme.textSecondary }]}>
              Visual explanation generated for your learning level.
            </Text>

            {/* Trust Badges */}
            <View style={styles.trustBadgesList}>
              <View style={styles.trustItem}>
                <Text style={[styles.checkMark, { color: theme.success }]}>✓</Text>
                <Text style={[styles.trustText, { color: theme.textSecondary }]}>
                  Beginner friendly
                </Text>
              </View>
              <View style={styles.trustItem}>
                <Text style={[styles.checkMark, { color: theme.success }]}>✓</Text>
                <Text style={[styles.trustText, { color: theme.textSecondary }]}>
                  4 minutes
                </Text>
              </View>
              <View style={styles.trustItem}>
                <Text style={[styles.checkMark, { color: theme.success }]}>✓</Text>
                <Text style={[styles.trustText, { color: theme.textSecondary }]}>
                  Based on your learning path
                </Text>
              </View>
            </View>
          </View>

          {/* Action Trigger Section */}
          <View style={styles.actionsContainer}>
            {!isMarkedWatched ? (
              <Pressable
                onPress={handleMarkAsWatched}
                style={({ pressed }) => [
                  styles.primaryActionBtn,
                  {
                    backgroundColor: theme.primary,
                    opacity: pressed ? 0.92 : 1,
                    transform: [{ scale: pressed ? 0.985 : 1 }],
                  },
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Mark explanation as watched">
                <Text style={styles.primaryActionText}>Mark as Watched</Text>
              </Pressable>
            ) : (
              <View
                style={[
                  styles.completedBanner,
                  {
                    backgroundColor: theme.successLight,
                    borderColor: theme.success,
                  },
                ]}>
                <Text style={[styles.completedBannerTitle, { color: theme.success }]}>
                  Explanation completed ✓
                </Text>
                <Text style={[styles.completedBannerSubtitle, { color: theme.textSecondary }]}>
                  Great job! Try a quick practice question to test your intuition.
                </Text>

                <Pressable
                  onPress={handleGoToPractice}
                  style={({ pressed }) => [
                    styles.practiceNowBtn,
                    {
                      backgroundColor: theme.primary,
                      opacity: pressed ? 0.92 : 1,
                      transform: [{ scale: pressed ? 0.985 : 1 }],
                    },
                  ]}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Practice Now">
                  <Text style={styles.practiceNowText}>Practice Now →</Text>
                </Pressable>
              </View>
            )}

            {/* Secondary navigation to other modes */}
            <View style={styles.secondaryLinksRow}>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/practice/[id]',
                    params: { id: topicId },
                  })
                }
                style={[styles.altBtn, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.altBtnText, { color: theme.text }]}>
                  🧩 Skip to Practice
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/learning-session/[id]',
                    params: { id: topicId },
                  })
                }
                style={[styles.altBtn, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.altBtnText, { color: theme.text }]}>
                  📖 Read Concept Notes
                </Text>
              </Pressable>
            </View>
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
    gap: 6,
  },
  aiBadgeSparkle: {
    fontSize: 13,
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  playerContainer: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.card,
  },
  videoScreen: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#0F172A',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    position: 'relative',
    overflow: 'hidden',
  },
  canvasBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.4,
  },
  gridCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    position: 'absolute',
  },
  gridCircleSmall: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    position: 'absolute',
  },
  watermarkTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  watermarkText: {
    color: '#E0E7FF',
    fontSize: 11,
    fontWeight: '700',
  },
  centerControlBox: {
    alignItems: 'center',
    gap: 8,
  },
  playButtonCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.primaryBtn,
  },
  pauseCircle: {
    backgroundColor: '#4338CA',
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginLeft: 3,
  },
  canvasSubtitle: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },
  canvasBottomBar: {
    alignSelf: 'flex-end',
  },
  canvasTimer: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  playerControlsBar: {
    padding: Spacing.three,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    gap: 10,
  },
  scrubberTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  scrubberFill: {
    height: '100%',
    borderRadius: 3,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniPlayBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
  },
  miniPlayBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
    gap: Spacing.two + 2,
  },
  videoTitle: {
    ...Typography.h2,
    fontSize: 20,
    lineHeight: 26,
  },
  videoDescription: {
    ...Typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  trustBadgesList: {
    gap: 8,
    marginTop: 4,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkMark: {
    fontSize: 14,
    fontWeight: '800',
  },
  trustText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionsContainer: {
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
  primaryActionBtn: {
    height: 56,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.primaryBtn,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  completedBanner: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    borderWidth: 1.5,
    gap: Spacing.two,
  },
  completedBannerTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  completedBannerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  practiceNowBtn: {
    height: 50,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    ...Shadows.primaryBtn,
  },
  practiceNowText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryLinksRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  altBtn: {
    flex: 1,
    height: 46,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  altBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
