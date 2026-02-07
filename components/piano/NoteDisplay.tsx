import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import type { KeyFeedback, NoteDisplayMode, NoteName } from '@/types/piano';
import { StaffDisplay } from './StaffDisplay';

interface NoteDisplayProps {
  note: string;
  noteName?: NoteName; // Internal note name with octave (e.g., 'C2')
  displayMode?: NoteDisplayMode;
  feedback?: KeyFeedback;
  incorrectNote?: NoteName | null;
  showIncorrectFeedback?: boolean;
  showStaffLabels?: boolean;
  correctAnimationTrigger?: number;
  lastCorrectNote?: NoteName | null;
}

export const NoteDisplay = memo(function NoteDisplay({
  note,
  noteName,
  displayMode = 'text',
  feedback = 'none',
  incorrectNote = null,
  showIncorrectFeedback = true,
  showStaffLabels = false,
  correctAnimationTrigger = 0,
  lastCorrectNote = null,
}: NoteDisplayProps) {
  const { colors } = useTheme();

  if (displayMode === 'staff') {
    return (
      <StaffDisplay
        note={note}
        noteName={noteName}
        feedback={feedback}
        incorrectNote={showIncorrectFeedback ? incorrectNote : null}
        showLabels={showStaffLabels}
        correctAnimationTrigger={correctAnimationTrigger}
        lastCorrectNote={lastCorrectNote}
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
});

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
