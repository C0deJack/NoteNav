import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import type { KeyFeedback, NoteName } from '@/types/piano';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PianoKeyProps {
  note: NoteName;
  isBlack: boolean;
  onPress: (note: NoteName) => void;
  feedback: KeyFeedback;
  showLabel?: boolean;
}

export function PianoKey({
  note,
  isBlack,
  onPress,
  feedback,
  showLabel = false,
}: PianoKeyProps) {
  const feedbackValue = useSharedValue(0);
  const { colors } = useTheme();

  useEffect(() => {
    if (feedback !== 'none') {
      feedbackValue.value = 1;
      feedbackValue.value = withTiming(0, { duration: 300 });
    }
  }, [feedback, feedbackValue]);

  const animatedStyle = useAnimatedStyle(() => {
    const baseColor = isBlack ? colors.blackKey : colors.whiteKey;
    const feedbackColor =
      feedback === 'correct'
        ? colors.correctFeedback
        : feedback === 'incorrect'
          ? colors.incorrectFeedback
          : baseColor;

    return {
      backgroundColor: interpolateColor(
        feedbackValue.value,
        [0, 1],
        [baseColor, feedbackColor],
      ),
    };
  });

  const displayNote = note.replace('#', '\u266F'); // Use sharp symbol

  return (
    <View style={isBlack ? styles.blackKey : styles.whiteKey}>
      <AnimatedPressable
        onPressIn={() => onPress(note)}
        style={[
          styles.keyPressable,
          animatedStyle,
          { backgroundColor: isBlack ? colors.blackKey : colors.whiteKey },
          {
            borderColor: isBlack ? colors.blackKeyBorder : colors.whiteKeyBorder,
          },
        ]}
      />
      {showLabel && (
        <View style={styles.labelContainer} pointerEvents="none">
          <Text style={[styles.label, isBlack && styles.blackLabel]}>
            {displayNote}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  whiteKey: {
    flex: 1,
    height: '80%',
  },
  blackKey: {
    width: '100%',
    height: '80%',
  },
  keyPressable: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
  },
  labelContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  blackLabel: {
    color: '#fff',
  },
});
