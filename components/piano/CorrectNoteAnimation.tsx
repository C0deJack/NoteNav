import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';

const AnimatedLine = Animated.createAnimatedComponent(Line);

interface CorrectNoteAnimationProps {
  x: number;
  y: number;
  trigger: number; // Increment to trigger animation
  width: number;
  height: number;
}

const NUM_LINES = 8;
const ANIMATION_DURATION = 350;

export function CorrectNoteAnimation({
  x,
  y,
  trigger,
  width,
  height,
}: CorrectNoteAnimationProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (trigger > 0) {
      // Reset and start animation
      progress.value = 0;
      opacity.value = 1;
      progress.value = withTiming(1, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(0, {
        duration: ANIMATION_DURATION,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [trigger, progress, opacity]);

  // Generate lines at different angles
  const lines = Array.from({ length: NUM_LINES }, (_, i) => {
    const angle = (i * 360) / NUM_LINES;
    return { angle, index: i };
  });

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="none">
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {lines.map(({ angle, index }) => (
          <AnimatedLineComponent
            key={index}
            x={x}
            y={y}
            angle={angle}
            progress={progress}
            opacity={opacity}
            color={colors.primary}
          />
        ))}
      </Svg>
    </View>
  );
}

interface AnimatedLineComponentProps {
  x: number;
  y: number;
  angle: number;
  progress: SharedValue<number>;
  opacity: SharedValue<number>;
  color: string;
}

function AnimatedLineComponent({
  x,
  y,
  angle,
  progress,
  opacity,
  color,
}: AnimatedLineComponentProps) {
  const angleRad = (angle * Math.PI) / 180;
  const maxLength = 20;
  const startOffset = 12;

  const animatedProps = useAnimatedProps(() => {
    const currentStartOffset = startOffset + progress.value * 10;
    const currentLength = maxLength * progress.value;

    const x1 = x + Math.cos(angleRad) * currentStartOffset;
    const y1 = y + Math.sin(angleRad) * currentStartOffset;
    const x2 = x + Math.cos(angleRad) * (currentStartOffset + currentLength);
    const y2 = y + Math.sin(angleRad) * (currentStartOffset + currentLength);

    return {
      x1,
      y1,
      x2,
      y2,
      opacity: opacity.value,
    };
  });

  return (
    <AnimatedLine
      animatedProps={animatedProps}
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
