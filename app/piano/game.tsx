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
import { NOTE_TO_BASE, usePianoGame } from '@/hooks/usePianoGame';
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
  const { settings } = useGameSettings();
  const [soundEnabled, setSoundEnabled] = useState(
    settings.playSoundInSilentMode,
  );
  const { playNote, playError } = usePianoAudio({
    playSoundInSilentMode: soundEnabled,
  });
  const { colors } = useTheme();
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showStaffLabels, setShowStaffLabels] = useState(false);
  const [correctAnimationCounter, setCorrectAnimationCounter] = useState(0);
  const [lastCorrectNote, setLastCorrectNote] = useState<NoteName | null>(null);

  // Reset sound state when settings change (e.g., when returning to game)
  useEffect(() => {
    setSoundEnabled(settings.playSoundInSilentMode);
  }, [settings.playSoundInSilentMode]);

  const toggleMute = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

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
        paddingTop: insets.top + 8,
        paddingLeft: insets.left + 16,
        paddingRight: insets.right + 16,
      },
      keyboardArea: {
        paddingBottom: 4,
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

    // Hide staff labels when a note is played
    setShowStaffLabels(false);

    // Reset inactivity timer on any key press
    resetInactivityTimer();

    // Capture current note before handleKeyPress moves to next note
    const currentNoteName = state.notes[state.currentNoteIndex]?.name;

    const isCorrect = handleKeyPress(note);

    if (isCorrect) {
      // Trigger the correct animation with the note that was just played
      setLastCorrectNote(currentNoteName);
      setCorrectAnimationCounter((prev) => prev + 1);

      if (soundEnabled) {
        await playNote(note);
      }
      if (settings.enableHapticFeedback) {
        // TODO - Testing - Increased haptic feedback for correct notes
        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } else {
      if (soundEnabled) {
        await playError();
      }
      // TODO - Testing - Increased haptic feedback for correct notes
      // if (settings.enableHapticFeedback) {
      //   Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      // }
    }
  };

  if (state.status === 'idle' || state.notes.length === 0) {
    return <ThemedView style={styles.container} />;
  }

  const currentNote = state.notes[state.currentNoteIndex];

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, dynamicStyles.header]}>
        <View style={styles.controlsGrid}>
          <View style={styles.controlsRow}>
            <Pressable onPress={handleQuitPress} hitSlop={8}>
              <Ionicons name="close" size={36} color={colors.text} />
            </Pressable>
            <ThemedText style={styles.progress}>
              {state.currentNoteIndex + 1}/{state.notes.length}
            </ThemedText>
          </View>
          <View style={styles.controlsRow}>
            <Pressable
              onPressIn={() => setShowStaffLabels(true)}
              onPressOut={() => setShowStaffLabels(false)}
              hitSlop={8}
            >
              <Ionicons
                name="information-circle-outline"
                size={36}
                color={colors.text}
              />
            </Pressable>
            <Pressable onPress={toggleMute} hitSlop={8}>
              <Ionicons
                name={soundEnabled ? 'volume-high' : 'volume-mute'}
                size={38}
                color={colors.text}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.noteArea}>
          <NoteDisplay
            note={currentNote.displayName}
            noteName={currentNote.name}
            displayMode={settings.noteDisplayMode}
            feedback={keyFeedback[NOTE_TO_BASE[currentNote.name]]}
            incorrectNote={incorrectNote}
            showIncorrectFeedback={settings.showIncorrectFeedback}
            showStaffLabels={showStaffLabels}
            correctAnimationCounter={
              settings.showCorrectAnimation ? correctAnimationCounter : 0
            }
            lastCorrectNote={lastCorrectNote}
          />
        </View>

        <View style={[styles.headerSide, styles.headerRight]}>
          {settings.showTimer && <GameTimer elapsedMs={state.elapsedMs} />}
        </View>
      </View>

      <View style={[styles.keyboardArea, dynamicStyles.keyboardArea]}>
        <PianoKeyboard
          onKeyPress={onKeyPress}
          keyFeedback={keyFeedback}
          showWhiteKeyLabels={settings.showWhiteKeyLabels}
          showBlackKeyLabels={settings.showBlackKeyLabels}
          showSecondOctave={settings.showSecondOctave}
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
  controlsGrid: {
    flexDirection: 'column',
    gap: 14,
    alignSelf: 'flex-start',
    marginBlockStart: 40,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  headerRight: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-start',
    marginBlockStart: 40,
  },
  progress: {
    fontSize: 20,
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
