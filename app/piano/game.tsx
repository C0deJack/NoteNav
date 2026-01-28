import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GameTimer } from '@/components/piano/GameTimer';
import { NoteDisplay } from '@/components/piano/NoteDisplay';
import { PianoKeyboard } from '@/components/piano/PianoKeyboard';
import { QuitGameModal } from '@/components/piano/QuitGameModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useGameSettings } from '@/hooks/useGameSettings';
import { usePianoAudio } from '@/hooks/usePianoAudio';
import { usePianoGame } from '@/hooks/usePianoGame';
import { useThemeColor } from '@/hooks/useThemeColor';
import type { Difficulty, NoteName } from '@/types/piano';

export default function PianoGameScreen() {
  const params = useLocalSearchParams<{ difficulty: string }>();
  const difficulty =
    (parseInt(params.difficulty || '10', 10) as Difficulty) || 10;
  const insets = useSafeAreaInsets();

  const { state, keyFeedback, startGame, handleKeyPress } = usePianoGame();
  const { playNote, playError } = usePianoAudio();
  const { settings } = useGameSettings();
  const textColor = useThemeColor({}, 'text');
  const [showQuitModal, setShowQuitModal] = useState(false);

  const dynamicStyles = useMemo(
    () => ({
      header: {
        paddingTop: insets.top + 16,
        paddingLeft: insets.left + 16,
        paddingRight: insets.right + 16,
      },
      keyboardArea: {
        paddingBottom: insets.bottom + 16,
      },
    }),
    [insets],
  );

  // Lock to landscape on mount
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

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

  const handleQuitPress = () => {
    setShowQuitModal(true);
  };

  const handleQuitCancel = () => {
    setShowQuitModal(false);
  };

  const handleQuitConfirm = () => {
    setShowQuitModal(false);
    router.replace('/(tabs)/piano' as any);
  };

  const onKeyPress = async (note: NoteName) => {
    if (state.status !== 'playing' || showQuitModal) return;

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
      <View style={[styles.header, dynamicStyles.header]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={handleQuitPress} hitSlop={8}>
            <Ionicons name="close" size={28} color={textColor} />
          </Pressable>
          <ThemedText style={styles.progress}>
            {state.currentNoteIndex + 1}/{state.notes.length}
          </ThemedText>
        </View>
        <GameTimer elapsedMs={state.elapsedMs} />
      </View>

      <View style={styles.noteArea}>
        <NoteDisplay note={currentNote.displayName} />
      </View>

      <View style={[styles.keyboardArea, dynamicStyles.keyboardArea]}>
        <PianoKeyboard
          onKeyPress={onKeyPress}
          keyFeedback={keyFeedback}
          showLabels={settings.showNoteLabels}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progress: {
    fontSize: 18,
    fontWeight: '600',
    opacity: 0.7,
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
