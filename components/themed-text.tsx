import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
  | 'default'
  | 'title'
  | 'defaultSemiBold'
  | 'subtitle'
  | 'link'
  | 'largeTitle'      // 48px - for large numbers/stats
  | 'largeNumber'     // 36px - for large stats
  | 'heading1'        // 32px - same as title
  | 'heading2'        // 28px - section headers
  | 'heading3'        // 24px - medium headers
  | 'heading4'        // 18px - subsection headers
  | 'body'            // 16px - same as default
  | 'bodyMedium'      // 15px - medium body text
  | 'bodySmall'       // 14px - small body text
  | 'caption'         // 12px - labels and captions
  | 'captionBold'     // 12px bold - labels
  | 'tiny';           // 10px - very small text
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'largeTitle' ? styles.largeTitle : undefined,
        type === 'largeNumber' ? styles.largeNumber : undefined,
        type === 'heading1' ? styles.heading1 : undefined,
        type === 'heading2' ? styles.heading2 : undefined,
        type === 'heading3' ? styles.heading3 : undefined,
        type === 'heading4' ? styles.heading4 : undefined,
        type === 'body' ? styles.body : undefined,
        type === 'bodyMedium' ? styles.bodyMedium : undefined,
        type === 'bodySmall' ? styles.bodySmall : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'captionBold' ? styles.captionBold : undefined,
        type === 'tiny' ? styles.tiny : undefined,
        style,
      ]}
      allowFontScaling={false}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
  largeTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    lineHeight: 58,
  },
  largeNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 44,
  },
  heading1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  heading2: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  heading3: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  heading4: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  captionBold: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'bold',
  },
  tiny: {
    fontSize: 10,
    lineHeight: 14,
  },
});
