import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';

interface SettingToggleProps {
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}

export function SettingToggle({
  label,
  description,
  value,
  onToggle,
}: SettingToggleProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={[styles.container, { borderColor: colors.border }]}
      onPress={onToggle}
    >
      <View style={styles.info}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <ThemedText type="muted" style={styles.description}>
          {description}
        </ThemedText>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.surface}
      />
    </Pressable>
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
