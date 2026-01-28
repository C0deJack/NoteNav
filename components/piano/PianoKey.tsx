import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { PianoColors } from '@/constants/Colors';
import { NoteName, KeyFeedback } from '@/types/piano';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PianoKeyProps {
  note: NoteName;
  isBlack: boolean;
  onPress: (note: NoteName) => void;
  feedback: KeyFeedback;
  showLabel?: boolean;
}

export function PianoKey({ note, isBlack, onPress, feedback, showLabel = false }: PianoKeyProps) {
  const feedbackValue = useSharedValue(0);

  useEffect(() => {
    if (feedback !== 'none') {
      feedbackValue.value = 1;
      feedbackValue.value = withTiming(0, { duration: 300 });
    }
  }, [feedback, feedbackValue]);

  const animatedStyle = useAnimatedStyle(() => {
    const baseColor = isBlack ? PianoColors.blackKey : PianoColors.whiteKey;
    const feedbackColor = feedback === 'correct'
      ? PianoColors.correctFeedback
      : feedback === 'incorrect'
        ? PianoColors.incorrectFeedback
        : baseColor;

    return {
      backgroundColor: interpolateColor(
        feedbackValue.value,
        [0, 1],
        [baseColor, feedbackColor]
      ),
    };
  });

  const displayNote = note.replace('#', '\u266F'); // Use sharp symbol

  return (
    <AnimatedPressable
      onPressIn={() => onPress(note)}
      style={[
        isBlack ? styles.blackKey : styles.whiteKey,
        animatedStyle,
      ]}
    >
      {showLabel && (
        <ThemedText style={[styles.label, isBlack && styles.blackLabel]}>
          {displayNote}
        </ThemedText>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  whiteKey: {
    flex: 1,
    height: '100%',
    backgroundColor: PianoColors.whiteKey,
    borderWidth: 1,
    borderColor: PianoColors.keyBorder,
    borderRadius: 4,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
  blackKey: {
    position: 'absolute',
    width: '60%',
    height: '60%',
    backgroundColor: PianoColors.blackKey,
    borderRadius: 4,
    zIndex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  blackLabel: {
    color: '#fff',
  },
});
