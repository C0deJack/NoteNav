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
    borderRadius: 12,
    overflow: 'visible',
  },
  note: {
    paddingInline: 25,
    paddingBlock: 55,
    marginBottom: -45,

    fontSize: 64,
    fontWeight: 'bold',
    color: PianoColors.noteDisplayText,
  },
});
