import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

interface GameTimerProps {
  elapsedMs: number;
}

export function GameTimer({ elapsedMs }: GameTimerProps) {
  const seconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formatted = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;

  return <ThemedText style={styles.timer}>{formatted}</ThemedText>;
}

const styles = StyleSheet.create({
  timer: {
    paddingBlockStart: 30,
    fontSize: 32,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
