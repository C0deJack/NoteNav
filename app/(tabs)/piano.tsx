import { View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DifficultySelector } from '@/components/piano/DifficultySelector';
import { useGameSettings } from '@/hooks/useGameSettings';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Difficulty } from '@/types/piano';

export default function PianoMenuScreen() {
  const { lastDifficulty, saveLastDifficulty, loaded } = useGameSettings();
  const tintColor = useThemeColor({}, 'tint');

  const handleDifficultySelect = (difficulty: Difficulty) => {
    saveLastDifficulty(difficulty);
  };

  const handleStartGame = () => {
    router.push({
      pathname: '/piano/game' as const,
      params: { difficulty: lastDifficulty },
    } as any);
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

        <View style={styles.selectorContainer}>
          <DifficultySelector
            selected={lastDifficulty}
            onSelect={handleDifficultySelect}
          />
        </View>

        <Pressable
          style={[styles.playButton, { backgroundColor: tintColor }]}
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
    padding: 24,
    justifyContent: 'center',
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  selectorContainer: {
    marginVertical: 16,
  },
  playButton: {
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  playButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
