/**
 * Aesthetiq Theme Configuration
 * Modern, Sleek, Dark Gradient Vibe.
 */

import { Platform } from 'react-native';

const tintColor = '#ffffff';
const iconColor = '#9BA1A6';

export const Colors = {
  dark: {
    text: '#FFFFFF',
    textSecondary: '#A1A1AA',
    background: '#000000',
    tint: tintColor,
    icon: iconColor,
    tabIconDefault: iconColor,
    tabIconSelected: tintColor,
    cardBackground: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    success: '#4ADE80', // Muted green for success
    error: '#F87171',   // Muted red for error
    primary: '#4ADE80', // Primary brand color
  },
  // Fallback for any legacy light mode usage, mapped to dark for consistency
  light: {
    text: '#FFFFFF',
    textSecondary: '#A1A1AA',
    background: '#000000',
    tint: tintColor,
    icon: iconColor,
    tabIconDefault: iconColor,
    tabIconSelected: tintColor,
    cardBackground: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    success: '#4ADE80',
    error: '#F87171',
  },
};

export const Gradients = {
  background: ['#000000', '#2a2a2e'] as const, // Pure black to lighter charcoal for more visibility
  card: ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)'] as const, // Slightly lighter card for better contrast
  primary: ['#ffffff', '#a1a1aa'] as const,
};

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
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
