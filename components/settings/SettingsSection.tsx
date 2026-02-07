import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';

const CHEVRON_SIZE = 35;

interface SettingsSectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  titleType?: 'subtitle' | 'default';
}

export function SettingsSection({
  title,
  expanded,
  onToggle,
  children,
  titleType = 'subtitle',
}: SettingsSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <Pressable style={styles.header} onPress={onToggle}>
        <ThemedText type={titleType} style={styles.title}>
          {title}
        </ThemedText>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={CHEVRON_SIZE}
          color={colors.settingsChevron}
        />
      </Pressable>

      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  title: {
    marginBottom: 0,
  },
  content: {
    gap: 12,
    marginTop: 12,
  },
});
