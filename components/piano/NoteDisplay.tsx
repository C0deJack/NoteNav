import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { PianoColors } from '@/constants/Colors';

interface NoteDisplayProps {
  note: string;
}

export function NoteDisplay({ note }: NoteDisplayProps) {
  // Convert sharp notation for display
  const displayNote = note.replace('#', '\u266F');

  return (
    <View style={styles.noteContainer}>
      <ThemedText style={styles.note}>{displayNote}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
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
