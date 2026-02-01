import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import type { NoteDisplayMode } from '@/types/piano';
import { StaffDisplay } from './StaffDisplay';

interface NoteDisplayProps {
  note: string;
  displayMode?: NoteDisplayMode;
}

export function NoteDisplay({ note, displayMode = 'text' }: NoteDisplayProps) {
  const { colors } = useTheme();

  if (displayMode === 'staff') {
    return <StaffDisplay note={note} />;
  }

  // Convert sharp notation for display
  const displayNote = note.replace('#', '\u266F');

  return (
    <View
      style={[styles.noteContainer, { backgroundColor: colors.noteDisplay }]}
    >
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
