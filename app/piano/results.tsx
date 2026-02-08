import { router, useLocalSearchParams } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useProgress } from '@/hooks/useProgress';
import { useTheme } from '@/hooks/useTheme';
import type { DifficultyLevel, NoteCount } from '@/types/piano';
import { formatTime } from '@/utils/formatting';
import { getDifficultyLabel } from '@/utils/game';

export default function PianoResultsScreen() {
  const params = useLocalSearchParams<{
    difficultyLevel: string;
    noteCount: string;
    elapsedMs: string;
    accuracy: string;
  }>();
  const difficultyLevel = (params.difficultyLevel || 'easy') as DifficultyLevel;
  const noteCount = parseInt(params.noteCount || '10', 10) as NoteCount;
  const elapsedMs = parseInt(params.elapsedMs || '0', 10);
  const accuracy = parseInt(params.accuracy || '0', 10);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { addScore } = useProgress();
  const scoreSaved = useRef(false);

  useEffect(() => {
    if (!scoreSaved.current) {
      scoreSaved.current = true;
      addScore({ difficultyLevel, noteCount, elapsedMs, accuracy });
    }
  }, [addScore, difficultyLevel, noteCount, elapsedMs, accuracy]);

  const formattedTime = formatTime(elapsedMs);
  const difficultyLabel = getDifficultyLabel(difficultyLevel);

  const handlePlayAgain = () => {
    router.replace({
      pathname: '/piano/game',
      params: {
        difficultyLevel,
        noteCount: String(noteCount),
      },
    });
  };

  const handleBackToMenu = () => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    router.replace('/');
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
      >
        <ThemedText style={styles.title}>Complete!</ThemedText>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <ThemedText style={styles.statLabel}>Accuracy</ThemedText>
            <ThemedText style={styles.statValue}>{accuracy}%</ThemedText>
          </View>

          <View style={styles.stat}>
            <ThemedText style={styles.statLabel}>Time</ThemedText>
            <ThemedText style={styles.statValue}>{formattedTime}</ThemedText>
          </View>

          <View style={styles.stat}>
            <ThemedText style={styles.statLabel}>Difficulty</ThemedText>
            <ThemedText
              style={[styles.statValue, styles.difficulty]}
            >{`${difficultyLabel} (${noteCount} notes)`}</ThemedText>
          </View>
        </View>

        <View style={styles.buttons}>
          <Pressable
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handlePlayAgain}
          >
            <ThemedText style={styles.buttonText}>Play Again</ThemedText>
          </Pressable>

          <Pressable
            style={[
              styles.button,
              styles.secondaryButton,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
            onPress={handleBackToMenu}
          >
            <ThemedText style={styles.secondaryButtonText}>
              Back to Menu
            </ThemedText>
          </Pressable>
        </View>
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
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  title: {
    paddingBlockStart: 10,
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  statValue: {
    paddingBlockStart: 18,
    fontSize: 40,
    fontWeight: '600',
  },
  buttons: {
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  difficulty: {
    paddingBlockStart: 7,
    fontSize: 20,
  },
});
