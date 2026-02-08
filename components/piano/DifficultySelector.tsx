import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { DIFFICULTY_LEVELS, NOTE_COUNTS } from '@/constants/PianoConfig';
import { useTheme } from '@/hooks/useTheme';
import type { DifficultyLevel, NoteCount } from '@/types/piano';

interface DifficultySelectorProps {
  selectedLevel: DifficultyLevel;
  selectedNoteCount: NoteCount;
  onSelectLevel: (level: DifficultyLevel) => void;
  onSelectNoteCount: (count: NoteCount) => void;
}

export function DifficultySelector({
  selectedLevel,
  selectedNoteCount,
  onSelectLevel,
  onSelectNoteCount,
}: DifficultySelectorProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Left Column: Difficulty Level */}
      <View style={styles.column}>
        <ThemedText style={styles.title}>Difficulty</ThemedText>
        <View style={styles.options}>
          {DIFFICULTY_LEVELS.map(({ value, label }) => (
            <Pressable
              key={value}
              style={[
                styles.option,
                { borderColor: colors.border, backgroundColor: colors.surface },
                selectedLevel === value && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => onSelectLevel(value)}
            >
              <ThemedText
                style={[
                  styles.optionText,
                  selectedLevel === value && styles.selectedText,
                ]}
              >
                {label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Right Column: Notes per Game */}
      <View style={styles.column}>
        <ThemedText style={styles.title}>Notes per Game</ThemedText>
        <View style={styles.options}>
          {NOTE_COUNTS.map(({ value, label }) => (
            <Pressable
              key={value}
              style={[
                styles.option,
                { borderColor: colors.border, backgroundColor: colors.surface },
                selectedNoteCount === value && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => onSelectNoteCount(value)}
            >
              <ThemedText
                style={[
                  styles.optionText,
                  selectedNoteCount === value && styles.selectedText,
                ]}
              >
                {label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
  },
  column: {
    flex: 1,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  options: {
    gap: 8,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedText: {
    color: '#fff',
  },
});
