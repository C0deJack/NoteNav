import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';

import { ThemedView } from '@/components/ThemedView';
import { PianoKeyboard } from '@/components/piano/PianoKeyboard';
import { NoteDisplay } from '@/components/piano/NoteDisplay';
import { GameTimer } from '@/components/piano/GameTimer';
import { usePianoGame } from '@/hooks/usePianoGame';
import { usePianoAudio } from '@/hooks/usePianoAudio';
import { useGameSettings } from '@/hooks/useGameSettings';
import { Difficulty, NoteName } from '@/types/piano';

export default function PianoGameScreen() {
  const params = useLocalSearchParams<{ difficulty: string }>();
  const difficulty = (parseInt(params.difficulty || '10', 10) as Difficulty) || 10;

  const { state, keyFeedback, startGame, handleKeyPress } = usePianoGame();
  const { playNote, playError } = usePianoAudio();
  const { settings } = useGameSettings();

  // Start game on mount
  useEffect(() => {
    startGame(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <View style={styles.header}>
        <GameTimer elapsedMs={state.elapsedMs} />
      </View>

      <View style={styles.noteArea}>
        <NoteDisplay
          note={currentNote.displayName}
          currentIndex={state.currentNoteIndex}
          totalNotes={state.notes.length}
        />
      </View>

      <View style={styles.keyboardArea}>
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
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  noteArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardArea: {
    paddingBottom: 40,
    alignItems: 'center',
  },
});
