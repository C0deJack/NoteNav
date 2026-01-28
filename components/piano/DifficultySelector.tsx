import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { DIFFICULTIES } from '@/constants/PianoConfig';
import { useTheme } from '@/hooks/useTheme';
import type { Difficulty } from '@/types/piano';

interface DifficultySelectorProps {
  selected: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

export function DifficultySelector({
  selected,
  onSelect,
}: DifficultySelectorProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Select Difficulty</ThemedText>
      <View style={styles.options}>
        {DIFFICULTIES.map(({ value, label }) => (
          <Pressable
            key={value}
            style={[
              styles.option,
              { borderColor: colors.border },
              selected === value && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => onSelect(value)}
          >
            <ThemedText
              style={[
                styles.optionText,
                selected === value && styles.selectedText,
              ]}
            >
              {label}
            </ThemedText>
            <ThemedText
              style={[
                styles.noteCount,
                selected === value && styles.selectedText,
              ]}
            >
              {value} notes
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  options: {
    gap: 8,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  noteCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  selectedText: {
    color: '#fff',
  },
});
