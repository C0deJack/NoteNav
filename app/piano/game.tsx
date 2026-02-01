import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GameTimer } from '@/components/piano/GameTimer';
import { NoteDisplay } from '@/components/piano/NoteDisplay';
import { PianoKeyboard } from '@/components/piano/PianoKeyboard';
import { QuitGameModal } from '@/components/piano/QuitGameModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useGameSettings } from '@/hooks/useGameSettings';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';
import { usePianoAudio } from '@/hooks/usePianoAudio';
import { usePianoGame } from '@/hooks/usePianoGame';
import { useTheme } from '@/hooks/useTheme';
import type { Difficulty, NoteName } from '@/types/piano';

export default function PianoGameScreen() {
  const params = useLocalSearchParams<{ difficulty: string }>();
  const difficulty =
    (parseInt(params.difficulty || '10', 10) as Difficulty) || 10;
  const insets = useSafeAreaInsets();

  const {
    state,
    keyFeedback,
    incorrectNote,
    startGame,
    handleKeyPress,
    pauseGame,
    resumeGame,
  } = usePianoGame();
  const { playNote, playError } = usePianoAudio();
  const { settings } = useGameSettings();
  const { colors } = useTheme();
  const [showQuitModal, setShowQuitModal] = useState(false);

  const handleInactivityTimeout = useCallback(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    router.replace('/' as any);
  }, []);

  const { resetTimer: resetInactivityTimer } = useInactivityTimeout({
    onTimeout: handleInactivityTimeout,
    enabled: state.status === 'playing',
  });

  const dynamicStyles = useMemo(
    () => ({
      header: {
        paddingTop: insets.top + 16,
        paddingLeft: insets.left + 16,
        paddingRight: insets.right + 16,
      },
      keyboardArea: {
        paddingBottom: insets.bottom - 20,
      },
    }),
    [insets],
  );

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
          accuracy: 100 * state.accuracy,
        },
      } as any);
    }
  }, [state.status, state.difficulty, state.elapsedMs, state.accuracy]);
  const handleQuitPress = () => {
    pauseGame();
    setShowQuitModal(true);
  };

  const handleQuitCancel = () => {
    setShowQuitModal(false);
    resumeGame();
  };

  const handleQuitConfirm = () => {
    setShowQuitModal(false);
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    router.replace('/' as any);
  };

  const onKeyPress = async (note: NoteName) => {
    if (state.status !== 'playing' || showQuitModal) return;

    // Reset inactivity timer on any key press
    resetInactivityTimer();

    const isCorrect = handleKeyPress(note);

    if (isCorrect) {
      await playNote(note);
      if (settings.enableHapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else {
      await playError();
      if (settings.enableHapticFeedback) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  if (state.status === 'idle' || state.notes.length === 0) {
    return <ThemedView style={styles.container} />;
  }

  const currentNote = state.notes[state.currentNoteIndex];

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, dynamicStyles.header]}>
        <View style={styles.headerSide}>
          <Pressable onPress={handleQuitPress} hitSlop={8}>
            <Ionicons name="close" size={28} color={colors.text} />
          </Pressable>
          <ThemedText style={styles.progress}>
            {state.currentNoteIndex + 1}/{state.notes.length}
          </ThemedText>
        </View>

        <View style={styles.noteArea}>
          <NoteDisplay
            note={currentNote.displayName}
            displayMode={settings.noteDisplayMode}
            feedback={keyFeedback[currentNote.name]}
            incorrectNote={incorrectNote}
            showIncorrectFeedback={settings.showIncorrectFeedback}
          />
        </View>

        <View style={[styles.headerSide, styles.headerRight]}>
          <GameTimer elapsedMs={state.elapsedMs} />
        </View>
      </View>

      <View style={[styles.keyboardArea, dynamicStyles.keyboardArea]}>
        <PianoKeyboard
          onKeyPress={onKeyPress}
          keyFeedback={keyFeedback}
          showWhiteKeyLabels={settings.showWhiteKeyLabels}
          showBlackKeyLabels={settings.showBlackKeyLabels}
        />
      </View>

      <QuitGameModal
        visible={showQuitModal}
        onCancel={handleQuitCancel}
        onConfirm={handleQuitConfirm}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 100,
  },
  headerRight: {
    justifyContent: 'flex-end',
  },
  progress: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.7,
  },
  noteArea: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardArea: {
    alignItems: 'center',
  },
});
