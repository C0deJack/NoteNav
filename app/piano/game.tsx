import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GameTimer } from '@/components/piano/GameTimer';
import { NoteDisplay } from '@/components/piano/NoteDisplay';
import { PianoKeyboard } from '@/components/piano/PianoKeyboard';
import { ThemedView } from '@/components/ThemedView';
import { useGameSettings } from '@/hooks/useGameSettings';
import { usePianoAudio } from '@/hooks/usePianoAudio';
import { usePianoGame } from '@/hooks/usePianoGame';
import type { Difficulty, NoteName } from '@/types/piano';

export default function PianoGameScreen() {
  const params = useLocalSearchParams<{ difficulty: string }>();
  const difficulty =
    (parseInt(params.difficulty || '10', 10) as Difficulty) || 10;
  const insets = useSafeAreaInsets();

  const { state, keyFeedback, startGame, handleKeyPress } = usePianoGame();
  const { playNote, playError } = usePianoAudio();
  const { settings } = useGameSettings();

  // Start game on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: Only run on mount with initial difficulty
  useEffect(() => {
    startGame(difficulty);
  }, [difficulty]);

  // Navigate to results when finished
  useEffect(() => {
    if (state.status === 'finished') {
      router.replace({
        pathname: '/piano/results' as const,
        params: {
          difficulty: state.difficulty,
          elapsedMs: state.elapsedMs,
        },
      } as any);
    }
  }, [state.status, state.difficulty, state.elapsedMs]);

  const onKeyPress = async (note: NoteName) => {
    if (state.status !== 'playing') return;

    const isCorrect = handleKeyPress(note);

    if (isCorrect) {
      await playNote(note);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      await playError();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  if (state.status === 'idle' || state.notes.length === 0) {
    return <ThemedView style={styles.container} />;
  }

  const currentNote = state.notes[state.currentNoteIndex];

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <GameTimer elapsedMs={state.elapsedMs} />
      </View>

      <View style={styles.noteArea}>
        <NoteDisplay
          note={currentNote.displayName}
          currentIndex={state.currentNoteIndex}
          totalNotes={state.notes.length}
        />
      </View>

      <View
        style={[styles.keyboardArea, { paddingBottom: insets.bottom + 16 }]}
      >
        <PianoKeyboard
          onKeyPress={onKeyPress}
          keyFeedback={keyFeedback}
          showLabels={settings.showNoteLabels}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  noteArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
  },
  keyboardArea: {
    alignItems: 'center',
  },
});
