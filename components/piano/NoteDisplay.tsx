import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';

interface NoteDisplayProps {
  note: string;
}

export function NoteDisplay({ note }: NoteDisplayProps) {
  const { colors } = useTheme();
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
    paddingInline: 25,
    paddingBlock: 55,
    marginBottom: -45,
    fontSize: 64,
    fontWeight: 'bold',
  },
});
