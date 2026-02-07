import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { formatTime } from '@/utils/formatting';

interface GameTimerProps {
  elapsedMs: number;
}

export function GameTimer({ elapsedMs }: GameTimerProps) {
  return <ThemedText style={styles.timer}>{formatTime(elapsedMs)}</ThemedText>;
}

const styles = StyleSheet.create({
  timer: {
    paddingBlockStart: 30,
    fontSize: 32,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
