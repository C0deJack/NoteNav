import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { BLACK_KEYS, WHITE_KEYS } from '@/constants/PianoConfig';
import type { KeyFeedback, NoteName } from '@/types/piano';
import { PianoKey } from './PianoKey';

interface PianoKeyboardProps {
  onKeyPress: (note: NoteName) => void;
  keyFeedback: Record<NoteName, KeyFeedback>;
  showWhiteKeyLabels?: boolean;
  showBlackKeyLabels?: boolean;
}

// Black keys positioned relative to white keys
const BLACK_KEY_OFFSETS: Record<NoteName, number> = {
  'C#': 0,
  'D#': 1,
  'F#': 3,
  'G#': 4,
  'A#': 5,
} as Record<NoteName, number>;

export function PianoKeyboard({
  onKeyPress,
  keyFeedback,
  showWhiteKeyLabels = false,
  showBlackKeyLabels = false,
}: PianoKeyboardProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const keyboardWidth = Math.min(width - 32, 600);
  const whiteKeyWidth = keyboardWidth / 7;
  const blackKeyWidth = whiteKeyWidth * 0.6;
  const maxKeyboardHeight = isLandscape ? 230 : 300;
  const keyboardHeight = Math.min(keyboardWidth * 0.4, maxKeyboardHeight);

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
      </View>

      {/* Black keys overlay */}
      <View style={styles.blackKeysContainer} pointerEvents="box-none">
        {BLACK_KEYS.map((note) => {
          const offset = BLACK_KEY_OFFSETS[note];
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
    gap: 2,
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
