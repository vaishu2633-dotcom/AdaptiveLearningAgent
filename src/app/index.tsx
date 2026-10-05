import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LearningPathVisual } from '@/components/learning-path-visual';
import {
  BorderRadius,
  Colors,
  MaxContentWidth,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  const handleCreatePath = () => {
    router.push('/onboarding/goal');
  };

  const handleExistingPath = () => {
    router.push('/(tabs)/home');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.contentWrapper}>
          {/* Header Brand Pill */}
          <View style={styles.brandRow}>
            <View style={[styles.brandPill, { backgroundColor: theme.primaryLight }]}>
              <Text style={styles.brandSparkle}>✨</Text>
              <Text style={[styles.brandTitle, { color: theme.primary }]}>
                Adaptive Learning Path Agent
              </Text>
            </View>
          </View>

          {/* Hero Headline */}
          <View style={styles.heroSection}>
            <Text style={[styles.headline, { color: theme.text }]}>
              Learn Smarter.{'\n'}
              <Text style={{ color: theme.primary }}>Grow Faster.</Text>
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Your AI learning path adapts to your skills, progress, and performance.
            </Text>
          </View>

          {/* AI Interactive Pipeline Visual */}
          <View style={styles.visualSection}>
            <LearningPathVisual />
          </View>

          {/* Trust & Value Section: 3 Core Highlights */}
          <View
            style={[
              styles.trustCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}
            accessible={true}
            accessibilityLabel="Key benefits: Personalized roadmap, AI assessments, Adaptive learning">
            <View style={styles.benefitItem}>
              <View style={[styles.checkCircle, { backgroundColor: theme.successLight }]}>
                <Text style={[styles.checkMark, { color: theme.success }]}>✓</Text>
              </View>
              <View style={styles.benefitTextContainer}>
                <Text style={[styles.benefitTitle, { color: theme.text }]}>
                  Personalized roadmap
                </Text>
                <Text style={[styles.benefitSubtitle, { color: theme.textSecondary }]}>
                  Curriculum continuously crafted to match your target goals and pace
                </Text>
              </View>
            </View>

            <View style={[styles.benefitDivider, { backgroundColor: theme.cardBorder }]} />

            <View style={styles.benefitItem}>
              <View style={[styles.checkCircle, { backgroundColor: theme.successLight }]}>
                <Text style={[styles.checkMark, { color: theme.success }]}>✓</Text>
              </View>
              <View style={styles.benefitTextContainer}>
                <Text style={[styles.benefitTitle, { color: theme.text }]}>
                  AI assessments
                </Text>
                <Text style={[styles.benefitSubtitle, { color: theme.textSecondary }]}>
                  Short, targeted diagnostic checks that evaluate deep conceptual understanding
                </Text>
              </View>
            </View>

            <View style={[styles.benefitDivider, { backgroundColor: theme.cardBorder }]} />

            <View style={styles.benefitItem}>
              <View style={[styles.checkCircle, { backgroundColor: theme.successLight }]}>
                <Text style={[styles.checkMark, { color: theme.success }]}>✓</Text>
              </View>
              <View style={styles.benefitTextContainer}>
                <Text style={[styles.benefitTitle, { color: theme.text }]}>
                  Adaptive learning
                </Text>
                <Text style={[styles.benefitSubtitle, { color: theme.textSecondary }]}>
                  Real-time replanning that speeds ahead or offers practice where needed
                </Text>
              </View>
            </View>
          </View>

          {/* Clear Primary & Secondary Actions */}
          <View style={styles.actionSection}>
            <Pressable
              onPress={handleCreatePath}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: theme.primary,
                  opacity: pressed ? 0.92 : 1,
                  transform: [{ scale: pressed ? 0.985 : 1 }],
                },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Create My Learning Path"
              accessibilityHint="Starts the onboarding flow to set your learning goal">
              <Text style={styles.primaryButtonText}>Create My Learning Path</Text>
              <Text style={styles.primaryButtonArrow}>→</Text>
            </Pressable>

            <Pressable
              onPress={handleExistingPath}
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.cardBorder,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="I already have a learning path"
              accessibilityHint="Navigates directly to your active learning dashboard">
              <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
                I already have a learning path
              </Text>
            </Pressable>
          </View>

          {/* Footer Subtext */}
          <Text style={[styles.footerText, { color: theme.textMuted }]}>
            Diagnostic Checks • Real-Time Adaptation • Continuous Mastery
          </Text>
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
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
    borderRadius: BorderRadius.pill,
    gap: 8,
  },
  brandSparkle: {
    fontSize: 15,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  headline: {
    ...Typography.hero,
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
  subtitle: {
    ...Typography.body,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 520,
  },
  visualSection: {
    marginBottom: Spacing.four,
  },
  trustCard: {
    borderRadius: BorderRadius.card,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderWidth: 1,
    ...Shadows.card,
    marginBottom: Spacing.four,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.two + 2,
    gap: Spacing.three,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkMark: {
    fontSize: 16,
    fontWeight: '800',
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitTitle: {
    ...Typography.h3,
    marginBottom: 2,
  },
  benefitSubtitle: {
    ...Typography.subtext,
    fontSize: 14,
    lineHeight: 20,
  },
  benefitDivider: {
    height: 1,
    width: '100%',
  },
  actionSection: {
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  primaryButton: {
    height: 56,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    ...Shadows.primaryBtn,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  primaryButtonArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 52,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: Spacing.two,
    fontWeight: '500',
  },
});
