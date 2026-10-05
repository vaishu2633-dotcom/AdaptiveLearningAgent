import { useRouter } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { GOAL_OPTIONS } from '@/data/assessmentQuestions';
import { useTheme } from '@/hooks/use-theme';
import { PredefinedGoalId } from '@/types/assessment';

export default function GoalScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { selectedGoal, setSelectedGoal, customGoal, setCustomGoal, resetAssessment } =
    useAssessment();

  // Validate whether continue is allowed
  const isContinueEnabled =
    selectedGoal !== 'other'
      ? selectedGoal !== null && selectedGoal !== undefined
      : customGoal.trim().length > 0;

  const handleSelectGoal = (goalId: PredefinedGoalId) => {
    setSelectedGoal(goalId);
  };

  const handleContinue = () => {
    if (!isContinueEnabled) return;
    resetAssessment();
    router.push('/onboarding/assessment');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            {/* Step Pill */}
            <View style={styles.stepBadgeRow}>
              <View style={[styles.stepBadge, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.stepText, { color: theme.primary }]}>STEP 1 OF 2</Text>
              </View>
            </View>

            {/* Page Title & Subtitle */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.text }]}>What do you want to become?</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Choose a goal and we'll create a learning path around it.
              </Text>
            </View>

            {/* Goal Cards List */}
            <View style={styles.goalsList}>
              {GOAL_OPTIONS.map((goal) => {
                const isSelected = selectedGoal === goal.id;
                return (
                  <View key={goal.id} style={styles.goalCardWrapper}>
                    <Pressable
                      onPress={() => handleSelectGoal(goal.id)}
                      style={({ pressed }) => [
                        styles.goalCard,
                        {
                          backgroundColor: isSelected ? theme.primaryLight : theme.card,
                          borderColor: isSelected ? theme.primary : theme.cardBorder,
                          borderWidth: isSelected ? 2 : 1,
                          transform: [{ scale: pressed ? 0.99 : 1 }],
                        },
                      ]}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={`${goal.title}: ${goal.description}`}
                      accessibilityState={{ selected: isSelected }}>
                      <View style={styles.goalRow}>
                        {/* Icon */}
                        <View
                          style={[
                            styles.emojiCircle,
                            {
                              backgroundColor: isSelected ? '#FFFFFF' : theme.backgroundElement,
                              borderColor: isSelected ? theme.primary : 'transparent',
                              borderWidth: isSelected ? 1 : 0,
                            },
                          ]}>
                          <Text style={styles.goalEmoji}>{goal.icon}</Text>
                        </View>

                        {/* Text */}
                        <View style={styles.goalInfo}>
                          <Text style={[styles.goalTitle, { color: theme.text }]}>
                            {goal.title}
                          </Text>
                          <Text style={[styles.goalDesc, { color: theme.textSecondary }]}>
                            {goal.description}
                          </Text>
                        </View>

                        {/* Radio Check Indicator */}
                        <View
                          style={[
                            styles.radioCircle,
                            {
                              borderColor: isSelected ? theme.primary : theme.cardBorder,
                              backgroundColor: isSelected ? theme.primary : 'transparent',
                            },
                          ]}>
                          {isSelected && <Text style={styles.radioCheck}>✓</Text>}
                        </View>
                      </View>
                    </Pressable>

                    {/* Reveal custom input when 'Other' is selected */}
                    {goal.id === 'other' && isSelected && (
                      <View
                        style={[
                          styles.customInputContainer,
                          {
                            backgroundColor: theme.card,
                            borderColor: theme.cardBorder,
                          },
                        ]}>
                        <Text style={[styles.customInputLabel, { color: theme.text }]}>
                          What do you want to learn?
                        </Text>
                        <TextInput
                          value={customGoal}
                          onChangeText={setCustomGoal}
                          placeholder="Example: Cybersecurity, Cloud Computing, Web Development..."
                          placeholderTextColor={theme.textMuted}
                          style={[
                            styles.textInput,
                            {
                              backgroundColor: theme.backgroundElement,
                              color: theme.text,
                              borderColor: customGoal.trim() ? theme.primary : theme.cardBorder,
                            },
                          ]}
                          autoFocus={false}
                          accessible={true}
                          accessibilityLabel="Custom learning goal input"
                        />
                        {customGoal.trim().length === 0 && (
                          <Text style={[styles.helperWarning, { color: theme.warning }]}>
                            Please enter your target topic to continue.
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Bottom Actions */}
            <View style={styles.bottomSection}>
              <Pressable
                onPress={handleContinue}
                disabled={!isContinueEnabled}
                style={({ pressed }) => [
                  styles.primaryButton,
                  {
                    backgroundColor: theme.primary,
                    opacity: !isContinueEnabled ? 0.45 : pressed ? 0.92 : 1,
                    transform: [{ scale: pressed && isContinueEnabled ? 0.985 : 1 }],
                  },
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Continue to Skill Assessment"
                accessibilityState={{ disabled: !isContinueEnabled }}>
                <Text style={styles.primaryButtonText}>Continue to Skill Assessment</Text>
                <Text style={styles.primaryButtonArrow}>→</Text>
              </Pressable>

              <Pressable
                onPress={() => router.back()}
                style={styles.backButton}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Back to Welcome">
                <Text style={[styles.backText, { color: theme.textSecondary }]}>
                  ← Back to Welcome
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: Spacing.four,
    paddingBottom: Spacing.six,
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  stepBadgeRow: {
    marginBottom: Spacing.two,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  header: {
    marginBottom: Spacing.four,
  },
  title: {
    ...Typography.h1,
    marginBottom: Spacing.two,
  },
  subtitle: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  goalsList: {
    gap: Spacing.three,
    marginBottom: Spacing.five,
  },
  goalCardWrapper: {
    gap: 8,
  },
  goalCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.four,
    ...Shadows.card,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.three,
  },
  goalEmoji: {
    fontSize: 26,
  },
  goalInfo: {
    flex: 1,
    paddingRight: Spacing.two,
  },
  goalTitle: {
    ...Typography.h3,
    fontSize: 18,
    marginBottom: 4,
  },
  goalDesc: {
    ...Typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  radioCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCheck: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  customInputContainer: {
    borderRadius: BorderRadius.md,
    padding: Spacing.three + 2,
    borderWidth: 1,
    gap: 8,
    marginTop: 4,
  },
  customInputLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  textInput: {
    height: 48,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    fontSize: 15,
  },
  helperWarning: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSection: {
    gap: Spacing.three,
    marginTop: Spacing.two,
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
  backButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
