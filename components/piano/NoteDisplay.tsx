import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { PianoColors } from '@/constants/Colors';

interface NoteDisplayProps {
  note: string;
  currentIndex: number;
  totalNotes: number;
}

export function NoteDisplay({
  note,
  currentIndex,
  totalNotes,
}: NoteDisplayProps) {
  // Convert sharp notation for display
  const displayNote = note.replace('#', '\u266F');

  return (
    <View style={styles.container}>
      <ThemedText style={styles.progress}>
        {currentIndex + 1} / {totalNotes}
      </ThemedText>
      <View style={styles.noteContainer}>
        <ThemedText style={styles.note}>{displayNote}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  progress: {
    fontSize: 16,
    opacity: 0.7,
  },
  noteContainer: {
    backgroundColor: PianoColors.noteDisplay,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  note: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
});
