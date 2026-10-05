import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import { useTheme } from '@/hooks/use-theme';

export default function AssistantScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [inputText, setInputText] = useState('');

  const messages = [
    {
      id: 1,
      sender: 'agent',
      text: "Hello! I am your AI Learning Path Agent. I analyze your quiz performances, track concept retention, and adapt your study schedule. What would you like to clarify or explore today?",
      time: 'Just now',
    },
    {
      id: 2,
      sender: 'user',
      text: 'Why did my roadmap adjust to add chunking practice?',
      time: '1m ago',
    },
    {
      id: 3,
      sender: 'agent',
      text: "In your last quiz, you aced vector similarity search, but hesitated on retrieval boundary contexts. To keep your mastery solid before building multi-agent systems, I added a targeted 15-minute practice module.",
      time: 'Just now',
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {/* Header info */}
            <View
              style={[
                styles.agentBanner,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}>
              <View style={[styles.agentAvatar, { backgroundColor: theme.primaryLight }]}>
                <Text style={styles.agentAvatarEmoji}>🤖</Text>
              </View>
              <View style={styles.agentBannerText}>
                <Text style={[styles.agentName, { color: theme.text }]}>
                  Adaptive Learning Agent
                </Text>
                <Text style={[styles.agentRole, { color: theme.success }]}>
                  ● Active Tutor & Dynamic Curriculum Engine
                </Text>
              </View>
            </View>

            {/* Chat Bubble Thread */}
            <View style={styles.chatThread}>
              {messages.map((msg) => {
                const isAgent = msg.sender === 'agent';
                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.messageRow,
                      isAgent ? styles.messageRowLeft : styles.messageRowRight,
                    ]}>
                    <View
                      style={[
                        styles.messageBubble,
                        isAgent
                          ? {
                              backgroundColor: theme.card,
                              borderColor: theme.cardBorder,
                              borderWidth: 1,
                              ...Shadows.card,
                            }
                          : {
                              backgroundColor: theme.primary,
                            },
                      ]}>
                      <Text
                        style={[
                          styles.messageText,
                          { color: isAgent ? theme.text : '#FFFFFF' },
                        ]}>
                        {msg.text}
                      </Text>
                      <Text
                        style={[
                          styles.timeText,
                          { color: isAgent ? theme.textMuted : 'rgba(255,255,255,0.7)' },
                        ]}>
                        {msg.time}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Suggested Prompts */}
            <Text style={[styles.suggestedLabel, { color: theme.textSecondary }]}>
              Suggested Questions
            </Text>
            <View style={styles.suggestedContainer}>
              {[
                'Why did my learning path adjust today?',
                'Explain vector embedding distances simply',
                'Give me a 2-minute diagnostic check',
              ].map((prompt, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => setInputText(prompt)}
                  style={({ pressed }) => [
                    styles.promptChip,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: theme.cardBorder,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={prompt}>
                  <Text style={[styles.promptText, { color: theme.primary }]}>
                    💡 {prompt}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Input Bar Mockup */}
        <View
          style={[
            styles.inputBar,
            { backgroundColor: theme.card, borderTopColor: theme.cardBorder },
          ]}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask your AI tutor anything..."
            placeholderTextColor={theme.textMuted}
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundElement,
                color: theme.text,
                borderColor: theme.cardBorder,
              },
            ]}
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendBtn,
              { backgroundColor: theme.primary, opacity: pressed ? 0.85 : 1 },
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Send Question">
            <Text style={styles.sendBtnText}>↑</Text>
          </Pressable>
        </View>
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
    padding: Spacing.four,
    alignItems: 'center',
    paddingBottom: Spacing.six,
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
  agentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    gap: Spacing.three,
    ...Shadows.card,
  },
  agentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentAvatarEmoji: {
    fontSize: 22,
  },
  agentBannerText: {
    flex: 1,
  },
  agentName: {
    ...Typography.h3,
    fontSize: 16,
  },
  agentRole: {
    fontSize: 12,
    fontWeight: '700',
  },
  chatThread: {
    gap: Spacing.three,
    marginVertical: Spacing.two,
  },
  messageRow: {
    flexDirection: 'row',
  },
  messageRowLeft: {
    justifyContent: 'flex-start',
  },
  messageRowRight: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: Spacing.three + 2,
    borderRadius: BorderRadius.card,
    gap: 4,
  },
  messageText: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 21,
  },
  timeText: {
    fontSize: 11,
    alignSelf: 'flex-end',
    fontWeight: '500',
  },
  suggestedLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.two,
  },
  suggestedContainer: {
    gap: 8,
  },
  promptChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  promptText: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderTopWidth: 1,
    gap: Spacing.two,
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 18,
    borderWidth: 1,
    fontSize: 15,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
});
