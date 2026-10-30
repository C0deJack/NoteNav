import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Platform } from 'react-native';

interface UseHapticsOptions {
  onCorrect: boolean;
  onIncorrect: boolean;
}

// Haptics are fire-and-forget: a failure shouldn't interrupt the game
function trigger(feedback: () => Promise<void>) {
  if (Platform.OS === 'web') return;
  feedback().catch(() => {});
}

const DOUBLE_TAP_GAP_MS = 80;

export function useHaptics({ onCorrect, onIncorrect }: UseHapticsOptions) {
  const correct = useCallback(() => {
    if (!onCorrect) return;
    trigger(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));
  }, [onCorrect]);

  const incorrect = useCallback(() => {
    if (!onIncorrect) return;
    trigger(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
      await new Promise<void>((resolve) => setTimeout(resolve, DOUBLE_TAP_GAP_MS));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    });
  }, [onIncorrect]);

  return { correct, incorrect };
}
