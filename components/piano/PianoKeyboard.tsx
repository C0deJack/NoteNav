import { StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  BLACK_KEYS,
  BLACK_KEYS_OCTAVE2,
  WHITE_KEYS,
  WHITE_KEYS_OCTAVE2,
} from '@/constants/PianoConfig';
import type { KeyFeedback, NoteName } from '@/types/piano';
import { PianoKey } from './PianoKey';

interface PianoKeyboardProps {
  onKeyPress: (note: NoteName) => void;
  keyFeedback: Record<NoteName, KeyFeedback>;
  showWhiteKeyLabels?: boolean;
  showBlackKeyLabels?: boolean;
  showSecondOctave?: boolean;
}

// Black keys positioned relative to white keys (offset from left edge)
const BLACK_KEY_OFFSETS: Partial<Record<NoteName, number>> = {
  'C#': 0,
  'D#': 1,
  'F#': 3,
  'G#': 4,
  'A#': 5,
  // Second octave offsets (relative to start of second octave)
  'C#2': 0,
  'D#2': 1,
  'F#2': 3,
};

export function PianoKeyboard({
  onKeyPress,
  keyFeedback,
  showWhiteKeyLabels = false,
  showBlackKeyLabels = false,
  showSecondOctave = false,
}: PianoKeyboardProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // Calculate key dimensions based on number of white keys
  const totalWhiteKeys = showSecondOctave
    ? WHITE_KEYS.length + WHITE_KEYS_OCTAVE2.length
    : WHITE_KEYS.length;
  const maxKeyboardWidth = showSecondOctave ? 800 : 600;
  const keyboardWidth = Math.min(width - 32, maxKeyboardWidth);
  const whiteKeyWidth = keyboardWidth / totalWhiteKeys;
  const blackKeyWidth = whiteKeyWidth * 0.6;
  const maxKeyboardHeight = isLandscape ? 180 : 300;
  const keyboardHeight = Math.min(keyboardWidth * 0.35, maxKeyboardHeight);

  // Offset for second octave black keys (after 7 white keys of first octave)
  const octave2Offset = WHITE_KEYS.length;

  return (
    <View
      style={[
        styles.container,
        { width: keyboardWidth, height: keyboardHeight },
      ]}
    >
      {/* White keys */}
      <View style={styles.whiteKeysContainer}>
        {WHITE_KEYS.map((note) => (
          <PianoKey
            key={note}
            note={note}
            isBlack={false}
            onPress={onKeyPress}
            feedback={keyFeedback[note]}
            showLabel={showWhiteKeyLabels}
          />
        ))}
        {showSecondOctave &&
          WHITE_KEYS_OCTAVE2.map((note) => (
            <PianoKey
              key={note}
              note={note}
              isBlack={false}
              onPress={onKeyPress}
              feedback={keyFeedback[note]}
              showLabel={showWhiteKeyLabels}
            />
          ))}
      </View>

      {/* Black keys overlay - first octave */}
      <View style={styles.blackKeysContainer} pointerEvents="box-none">
        {BLACK_KEYS.map((note) => {
          const offset = BLACK_KEY_OFFSETS[note] ?? 0;
          const leftPosition = (offset + 1) * whiteKeyWidth - blackKeyWidth / 2;

          return (
            <View
              key={note}
              style={[
                styles.blackKeyWrapper,
                {
                  left: leftPosition,
                  width: blackKeyWidth,
                  height: keyboardHeight * 0.6,
                },
              ]}
            >
              <PianoKey
                note={note}
                isBlack={true}
                onPress={onKeyPress}
                feedback={keyFeedback[note]}
                showLabel={showBlackKeyLabels}
              />
            </View>
          );
        })}

        {/* Black keys - second octave */}
        {showSecondOctave &&
          BLACK_KEYS_OCTAVE2.map((note) => {
            const offset = BLACK_KEY_OFFSETS[note] ?? 0;
            const leftPosition =
              (octave2Offset + offset + 1) * whiteKeyWidth - blackKeyWidth / 2;

            return (
              <View
                key={note}
                style={[
                  styles.blackKeyWrapper,
                  {
                    left: leftPosition,
                    width: blackKeyWidth,
                    height: keyboardHeight * 0.6,
                  },
                ]}
              >
                <PianoKey
                  note={note}
                  isBlack={true}
                  onPress={onKeyPress}
                  feedback={keyFeedback[note]}
                  showLabel={showBlackKeyLabels}
                />
              </View>
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  whiteKeysContainer: {
    flexDirection: 'row',
    height: '100%',
    gap: 5,
  },
  blackKeysContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  blackKeyWrapper: {
    position: 'absolute',
    top: 0,
  },
});
