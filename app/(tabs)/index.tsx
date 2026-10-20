import { router, useFocusEffect } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { DifficultySelector } from '@/components/piano/DifficultySelector';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useGameSettings } from '@/hooks/useGameSettings';
import { useTheme } from '@/hooks/useTheme';
import type { DifficultyLevel, NoteCount } from '@/types/piano';
import { getClefLabel } from '@/utils/game';

export default function PianoMenuScreen() {
  const {
    settings,
    reloadSettings,
    lastDifficultyLevel,
    lastNoteCount,
    saveLastDifficultyLevel,
    saveLastNoteCount,
    loaded,
  } = useGameSettings();
  const { colors } = useTheme();

  // Pick up the clef chosen on the Settings tab, which keeps its own copy
  useFocusEffect(
    useCallback(() => {
      reloadSettings();
    }, [reloadSettings]),
  );

  const handleLevelSelect = (level: DifficultyLevel) => {
    saveLastDifficultyLevel(level);
  };

  const handleNoteCountSelect = (count: NoteCount) => {
    saveLastNoteCount(count);
  };

  const handleStartGame = () => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE,
    ).catch(() => {});
    router.push({
      pathname: '/piano/game',
      params: {
        clef: settings.clef,
        difficultyLevel: lastDifficultyLevel,
        noteCount: String(lastNoteCount),
      },
    });
  };

  if (!loaded) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Piano Practice</ThemedText>
        <ThemedText style={styles.subtitle}>
          Identify the notes as fast as you can
        </ThemedText>
        <ThemedText style={[styles.clef, { color: colors.primary }]}>
          {getClefLabel(settings.clef)} Clef
        </ThemedText>

        <View style={styles.selectorContainer}>
          <DifficultySelector
            selectedLevel={lastDifficultyLevel}
            selectedNoteCount={lastNoteCount}
            onSelectLevel={handleLevelSelect}
            onSelectNoteCount={handleNoteCountSelect}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Pressable
          style={[styles.playButton, { backgroundColor: colors.primary }]}
          onPress={handleStartGame}
        >
          <ThemedText style={styles.playButtonText}>Play</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    paddingBlockStart: 10,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  clef: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectorContainer: {
    marginVertical: 8,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  playButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  playButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
