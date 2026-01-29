import { router, useLocalSearchParams } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DIFFICULTIES } from '@/constants/PianoConfig';
import { useTheme } from '@/hooks/useTheme';
import type { Difficulty } from '@/types/piano';

export default function PianoResultsScreen() {
  const params = useLocalSearchParams<{
    difficulty: string;
    elapsedMs: string;
    accuracy: string;
  }>();
  const difficulty = parseInt(params.difficulty || '10', 10) as Difficulty;
  const elapsedMs = parseInt(params.elapsedMs || '0', 10);
  const accuracy = parseInt(params.accuracy || '0', 10);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const seconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedTime = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;

  const difficultyLabel =
    DIFFICULTIES.find((d) => d.value === difficulty)?.label || 'Unknown';

  const handlePlayAgain = () => {
    router.replace({
      pathname: '/piano/game' as const,
      params: { difficulty },
    } as any);
  };

  const handleBackToMenu = () => {
    ScreenOrientation.unlockAsync();
    router.replace('/' as any);
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
            <ThemedText style={[styles.statValue, styles.difficulty]}>{`${difficultyLabel} (${difficulty} notes)`}</ThemedText>
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