import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { KEYBOARD_CONFIG } from '@/constants/KeyboardConfig';
import { getKeyboardKeys } from '@/constants/PianoConfig';
import type { Clef, KeyFeedback, NoteName } from '@/types/piano';
import { PianoKey } from './PianoKey';

interface PianoKeyboardProps {
  onKeyPress: (note: NoteName) => void;
  keyFeedback: Record<NoteName, KeyFeedback>;
  showWhiteKeyLabels?: boolean;
  showBlackKeyLabels?: boolean;
  clef?: Clef;
  /** Show the extra keys for Medium/Expert games */
  extended?: boolean;
}

export function PianoKeyboard({
  onKeyPress,
  keyFeedback,
  showWhiteKeyLabels = false,
  showBlackKeyLabels = false,
  clef = 'treble',
  extended = false,
}: PianoKeyboardProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const keys = getKeyboardKeys(clef, extended);
  const whiteKeys = keys.filter((k) => !k.includes('#'));
  const blackKeys = keys.filter((k) => k.includes('#'));

  // Calculate key dimensions based on number of white keys
  const maxKeyboardWidth = extended
    ? KEYBOARD_CONFIG.maxWidthWithSecondOctave
    : KEYBOARD_CONFIG.maxWidthSingleOctave;
  const keyboardWidth = Math.min(
    width - KEYBOARD_CONFIG.horizontalPadding,
    maxKeyboardWidth,
  );
  const whiteKeyWidth = keyboardWidth / whiteKeys.length;
  const blackKeyWidth = whiteKeyWidth * KEYBOARD_CONFIG.blackKeyWidthRatio;
  const maxKeyboardHeight = isLandscape
    ? KEYBOARD_CONFIG.maxHeightLandscape
    : KEYBOARD_CONFIG.maxHeightPortrait;
  const keyboardHeight = Math.min(
    keyboardWidth * KEYBOARD_CONFIG.heightToWidthRatio,
    maxKeyboardHeight,
  );

  return (
    <View
      style={[
        styles.container,
        { width: keyboardWidth, height: keyboardHeight },
      ]}
    >
      {/* White keys */}
      <View style={styles.whiteKeysContainer}>
        {whiteKeys.map((note) => (
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
        {blackKeys.map((note) => {
          // Each black key sits on the boundary after the white key below it
          // (C#4 follows C4), so its offset is that white key's index
          const offset = whiteKeys.indexOf(note.replace('#', '') as NoteName);
          const leftPosition = (offset + 1) * whiteKeyWidth - blackKeyWidth / 2;

          return (
            <View
              key={note}
              style={[
                styles.blackKeyWrapper,
                {
                  left: leftPosition,
                  width: blackKeyWidth,
                  height: keyboardHeight * KEYBOARD_CONFIG.blackKeyHeightRatio,
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
