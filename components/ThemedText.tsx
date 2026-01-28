import { StyleSheet, Text, type TextProps } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'title'
    | 'defaultSemiBold'
    | 'subtitle'
    | 'link'
    | 'muted';
};

export function ThemedText({
  style,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const { colors } = useTheme();

  const typeColor = type === 'muted' ? colors.textMuted : colors.text;
  const linkColor = type === 'link' ? colors.primary : typeColor;

  return (
    <Text
      style={[
        { color: linkColor },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'defaultSemiBold' && styles.defaultSemiBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'muted' && styles.muted,
        style,
      ]}
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
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
  },
  muted: {
    fontSize: 14,
    lineHeight: 20,
  },
});
