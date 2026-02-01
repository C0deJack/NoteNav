import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import type { KeyFeedback, NoteDisplayMode, NoteName } from '@/types/piano';
import { StaffDisplay } from './StaffDisplay';

interface NoteDisplayProps {
  note: string;
  displayMode?: NoteDisplayMode;
  feedback?: KeyFeedback;
  incorrectNote?: NoteName | null;
}

export function NoteDisplay({
  note,
  displayMode = 'text',
  feedback = 'none',
  incorrectNote = null,
}: NoteDisplayProps) {
  const { colors } = useTheme();

  if (displayMode === 'staff') {
    return (
      <StaffDisplay
        note={note}
        feedback={feedback}
        incorrectNote={incorrectNote}
      />
    );
  }

  // Convert sharp notation for display
  const displayNote = note.replace('#', '\u266F');

  // Use staff line color normally, green when correct
  const backgroundColor =
    feedback === 'correct' ? colors.correctFeedback : colors.staffLine;

  return (
    <View style={[styles.noteContainer, { backgroundColor }]}>
      <ThemedText style={[styles.note, { color: colors.noteDisplayText }]}>
        {displayNote}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  noteContainer: {
    borderRadius: 12,
    overflow: 'visible',
  },
  note: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    fontSize: 48,
    fontWeight: 'bold',
  },
});
