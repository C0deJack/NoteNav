import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { DIFFICULTIES } from '@/constants/PianoConfig';
import { useThemeColor } from '@/hooks/useThemeColor';
import type { Difficulty } from '@/types/piano';

interface DifficultySelectorProps {
  selected: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

export function DifficultySelector({
  selected,
  onSelect,
}: DifficultySelectorProps) {
  const tintColor = useThemeColor({}, 'tint');

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Select Difficulty</ThemedText>
      <View style={styles.options}>
        {DIFFICULTIES.map(({ value, label }) => (
          <Pressable
            key={value}
            style={[
              styles.option,
              selected === value && { backgroundColor: tintColor },
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
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  options: {
    gap: 12,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
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
