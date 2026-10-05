import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BorderRadius, Spacing, Typography, Shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function LearningPathVisual() {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
        },
      ]}
      accessible={true}
      accessibilityLabel="AI Adaptive Learning Path preview showing Skill Diagnostics, Dynamic Quizzing, and Curated Roadmap">
      {/* Live status badge */}
      <View style={styles.topRow}>
        <View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
          <View style={[styles.pulseDot, { backgroundColor: theme.primary }]} />
          <Text style={[styles.badgeText, { color: theme.primary }]}>
            AI ADAPTIVE ENGINE
          </Text>
        </View>
        <View style={[styles.liveStatusBadge, { backgroundColor: theme.successLight }]}>
          <Text style={[styles.liveStatus, { color: theme.success }]}>● Active</Text>
        </View>
      </View>

      {/* Adaptive Roadmap Pipeline */}
      <View style={styles.pipeline}>
        {/* Step 1 */}
        <View style={styles.stepItem}>
          <View style={styles.stepLeftColumn}>
            <View
              style={[
                styles.stepCircle,
                { backgroundColor: theme.primaryLight, borderColor: theme.primary },
              ]}>
              <Text style={styles.stepEmoji}>🎯</Text>
            </View>
            <View style={[styles.verticalConnector, { backgroundColor: theme.primary }]} />
          </View>
          <View style={styles.stepContent}>
            <View style={styles.stepHeaderRow}>
              <Text style={[styles.stepTitle, { color: theme.text }]}>Skill Diagnostics</Text>
              <View style={[styles.pillBadge, { backgroundColor: theme.successLight }]}>
                <Text style={[styles.pillText, { color: theme.success }]}>Calibrated</Text>
              </View>
            </View>
            <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
              Identifies baseline strengths & gaps
            </Text>
          </View>
        </View>

        {/* Step 2 */}
        <View style={styles.stepItem}>
          <View style={styles.stepLeftColumn}>
            <View
              style={[
                styles.stepCircle,
                { backgroundColor: theme.accentLight, borderColor: theme.accent },
              ]}>
              <Text style={styles.stepEmoji}>🧠</Text>
            </View>
            <View style={[styles.verticalConnector, { backgroundColor: theme.cardBorder }]} />
          </View>
          <View style={styles.stepContent}>
            <View style={styles.stepHeaderRow}>
              <Text style={[styles.stepTitle, { color: theme.text }]}>Dynamic Quizzing</Text>
              <View style={[styles.pillBadge, { backgroundColor: theme.accentLight }]}>
                <Text style={[styles.pillText, { color: theme.accent }]}>Adapting</Text>
              </View>
            </View>
            <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
              Question difficulty auto-tunes to your pace
            </Text>
            {/* Mini Progress Track */}
            <View style={styles.miniTrackContainer}>
              <View
                style={[
                  styles.miniTrackBackground,
                  { backgroundColor: theme.backgroundElement },
                ]}>
                <View
                  style={[
                    styles.miniTrackFill,
                    { backgroundColor: theme.primary, width: '68%' },
                  ]}
                />
              </View>
              <Text style={[styles.miniTrackLabel, { color: theme.textSecondary }]}>
                Mastery Score: 68% • Difficulty Scaling +18%
              </Text>
            </View>
          </View>
        </View>

        {/* Step 3 */}
        <View style={styles.stepItem}>
          <View style={styles.stepLeftColumn}>
            <View
              style={[
                styles.stepCircle,
                { backgroundColor: theme.primaryLight, borderColor: theme.cardBorder },
              ]}>
              <Text style={styles.stepEmoji}>🚀</Text>
            </View>
          </View>
          <View style={styles.stepContent}>
            <View style={styles.stepHeaderRow}>
              <Text style={[styles.stepTitle, { color: theme.text }]}>Curated Roadmap</Text>
              <View style={[styles.pillBadge, { backgroundColor: theme.backgroundElement }]}>
                <Text style={[styles.pillText, { color: theme.textSecondary }]}>Next</Text>
              </View>
            </View>
            <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
              Bypasses mastered units to save study hours
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
    marginVertical: Spacing.two,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    gap: 6,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  liveStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  liveStatus: {
    fontSize: 12,
    fontWeight: '700',
  },
  pipeline: {
    gap: Spacing.two,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepLeftColumn: {
    alignItems: 'center',
    width: 40,
    marginRight: Spacing.three,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepEmoji: {
    fontSize: 18,
  },
  verticalConnector: {
    width: 2,
    height: 38,
    marginVertical: 4,
    borderRadius: 1,
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
    paddingBottom: Spacing.two,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  stepTitle: {
    ...Typography.h3,
  },
  stepDescription: {
    ...Typography.subtext,
  },
  pillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  miniTrackContainer: {
    marginTop: 8,
    gap: 4,
  },
  miniTrackBackground: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  miniTrackFill: {
    height: '100%',
    borderRadius: 3,
  },
  miniTrackLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});
