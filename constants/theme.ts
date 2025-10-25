/**
 * Xplora Game Theme - Vibrant colors inspired by adventure and exploration games
 */

import { Platform } from 'react-native';

const tintColorLight = '#FF6B35';
const tintColorDark = '#00F5FF';

export const Colors = {
  light: {
    text: '#1A1A2E',
    background: '#F8F9FA',
    tint: tintColorLight,
    icon: '#6C757D',
    tabIconDefault: '#6C757D',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF',
    background: '#0F0F23',
    tint: tintColorDark,
    icon: '#8B95A5',
    tabIconDefault: '#8B95A5',
    tabIconSelected: tintColorDark,
  },
};

// Game-specific color palette
export const GameColors = {
  // Primary brand colors
  primary: '#FF6B35',
  primaryDark: '#E63946',
  primaryLight: '#FF8C61',

  // Secondary colors
  secondary: '#00F5FF',
  secondaryDark: '#00D4FF',
  secondaryLight: '#5CFFFF',

  // Accent colors
  accent: '#FFD60A',
  accentDark: '#FFC300',

  // Quest difficulty colors
  easy: '#06FFA5',
  medium: '#FFB800',
  hard: '#FF006E',

  // Category colors
  social: '#8338EC',
  fitness: '#FB5607',
  exploration: '#00BBF9',
  education: '#06FFA5',
  food: '#FFB703',
  community: '#F72585',

  // Status colors
  success: '#06FFA5',
  warning: '#FFB800',
  error: '#FF006E',
  info: '#00F5FF',

  // Background gradients
  gradientStart: '#1A1A2E',
  gradientMid: '#16213E',
  gradientEnd: '#0F3460',

  // UI elements
  cardBg: 'rgba(255, 255, 255, 0.05)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  glowNeon: '#00F5FF',
  shadowColor: 'rgba(0, 0, 0, 0.3)',
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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
