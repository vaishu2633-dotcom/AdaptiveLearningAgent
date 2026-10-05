/**
 * Design System constants for the Adaptive Learning Path Agent app.
 * Provides unified tokens for colors, typography, spacing, border radius, and shadows.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#64748B',
    background: '#F8FAFC',
    backgroundElement: '#F1F5F9',
    backgroundSelected: '#E0E7FF', // Subtle Indigo tint for selected states
    card: '#FFFFFF',
    cardBorder: '#E2E8F0',
    primary: '#4F46E5',
    primaryDark: '#4338CA',
    primaryLight: '#EEF2FF',
    accent: '#0284C7',
    accentLight: '#E0F2FE',
    success: '#059669',
    successLight: '#ECFDF5',
    warning: '#D97706',
    warningLight: '#FFFBEB',
    error: '#DC2626',
    errorLight: '#FEF2F2',
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    background: '#090D16',
    backgroundElement: '#131B2E',
    backgroundSelected: '#1E1B4B',
    card: '#0F172A',
    cardBorder: '#1E293B',
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    primaryLight: '#1E1B4B',
    accent: '#38BDF8',
    accentLight: '#082F49',
    success: '#10B981',
    successLight: '#064E3B',
    warning: '#FBBF24',
    warningLight: '#451A03',
    error: '#F87171',
    errorLight: '#450A0A',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
  seven: 64,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  card: 18,
  pill: 9999,
} as const;

export const Typography = {
  hero: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800' as const,
    letterSpacing: -0.4,
  },
  h2: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodyBold: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  subtext: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
} as const;

export const Shadows = {
  card: Platform.select({
    web: {
      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
    },
    default: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
  }) as any,
  primaryBtn: Platform.select({
    web: {
      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
    },
    default: {
      shadowColor: '#4F46E5',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 3,
    },
  }) as any,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 720;
