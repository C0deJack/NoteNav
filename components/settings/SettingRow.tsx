import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';

interface SettingRowProps {
  label: string;
  description?: string;
  onPress?: () => void;
  rightElement?: ReactNode;
}

export function SettingRow({
  label,
  description,
  onPress,
  rightElement,
}: SettingRowProps) {
  const { colors } = useTheme();

  const content = (
    <>
      <View style={styles.info}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        {description && (
          <ThemedText type="muted" style={styles.description}>
            {description}
          </ThemedText>
        )}
      </View>
      {rightElement}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={[styles.container, { borderColor: colors.border }]}
        onPress={onPress}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    marginTop: 2,
  },
});
