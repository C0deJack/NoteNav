import { memo, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Ellipse,
  G,
  Line,
  Path,
  Text as SvgText,
} from 'react-native-svg';

const AnimatedG = Animated.createAnimatedComponent(G);

import { STAFF_ANIMATION_CONFIG } from '@/constants/KeyboardConfig';
import { FLAT_SYMBOL } from '@/constants/PianoConfig';
import {
  getStaffPosition,
  STAFF_CONFIG,
  STAFF_LABELS,
} from '@/constants/StaffConfig';
import { useTheme } from '@/hooks/useTheme';
import type { Clef, KeyFeedback, NoteName } from '@/types/piano';
import { getPitchClass, getStaffNoteName } from '@/utils/notes';
import { CorrectNoteAnimation } from './CorrectNoteAnimation';

const {
  width,
  height,
  lineSpacing,
  noteRadius,
  leftPadding,
  accidentalOffset,
} = STAFF_CONFIG;

// Staff center is at height/2, each position step moves by half lineSpacing
const centerY = height / 2;
const positionToY = (position: number) =>
  centerY - position * (lineSpacing / 2);

// Positions of the five staff lines
const STAFF_LINE_POSITIONS = [4, 2, 0, -2, -4];

/** Ledger lines needed for a note outside the five staff lines */
function getLedgerPositions(position: number): number[] {
  const positions: number[] = [];
  for (let p = 6; p <= Math.abs(position); p += 2) {
    positions.push(Math.sign(position) * p);
  }
  return positions;
}

type Accidental = 'sharp' | 'flat' | null;

function getAccidental(displayName: string): Accidental {
  if (displayName.includes('#')) return 'sharp';
  if (displayName.includes(FLAT_SYMBOL)) return 'flat';
  return null;
}

interface DisplayedNote {
  note: string;
  noteName: NoteName;
}

interface StaffDisplayProps {
  note: string; // Display name like "C#" or "Db"
  noteName: NoteName; // Internal note name with octave (e.g., 'C5')
  clef?: Clef;
  feedback?: KeyFeedback;
  incorrectNote?: NoteName | null;
  showLabels?: boolean;
  correctAnimationCounter?: number;
  lastCorrectNote?: NoteName | null;
  upcomingNotes?: Array<{
    displayName: string;
    name: NoteName;
    sequenceIndex: number;
  }>;
}

export const StaffDisplay = memo(function StaffDisplay({
  note,
  noteName,
  clef = 'treble',
  feedback = 'none',
  incorrectNote = null,
  showLabels = false,
  correctAnimationCounter = 0,
  lastCorrectNote = null,
  upcomingNotes,
}: StaffDisplayProps) {
  const { colors } = useTheme();
  const [animationPosition, setAnimationPosition] = useState({ x: 0, y: 0 });

  // Track the note that was just answered correctly so it can slide out.
  // Only updated when correctAnimationCounter changes, so unrelated re-renders
  // don't turn the current note into the departing one.
  const [noteHistory, setNoteHistory] = useState<{
    counter: number;
    current: DisplayedNote;
    departing: DisplayedNote | null;
  }>({
    counter: correctAnimationCounter,
    current: { note, noteName },
    departing: null,
  });
  if (noteHistory.counter !== correctAnimationCounter) {
    setNoteHistory({
      counter: correctAnimationCounter,
      current: { note, noteName },
      departing: noteHistory.current,
    });
  } else if (
    noteHistory.current.note !== note ||
    noteHistory.current.noteName !== noteName
  ) {
    setNoteHistory({ ...noteHistory, current: { note, noteName } });
  }
  const departingNote = noteHistory.departing;

  const scrollOffset = useSharedValue(0);

  const animatedGroupProps = useAnimatedProps(() => ({
    transform: [{ translateX: scrollOffset.value }],
  }));

  // Departing note fades out as it slides left, so it's hidden at rest
  // instead of sitting over the clef
  const departingNoteProps = useAnimatedProps(() => ({
    opacity: scrollOffset.value / STAFF_ANIMATION_CONFIG.NOTE_SPACING,
  }));

  // Parse the note to get base note and accidental
  const accidental = getAccidental(note);
  const baseLetter = note.charAt(0).toUpperCase();

  // Check if user pressed the natural note when they should have pressed the sharp/flat
  // e.g., target is C# but user pressed C, or target is Db but user pressed D
  const pressedNaturalInsteadOfAccidental =
    accidental !== null &&
    incorrectNote !== null &&
    getPitchClass(incorrectNote) === baseLetter;

  // Use staff line color normally, green when correct
  const noteColor =
    feedback === 'correct' ? colors.correctFeedback : colors.staffLine;

  // Highlight accidental in red if user pressed the natural note instead
  const accidentalColor = pressedNaturalInsteadOfAccidental
    ? colors.incorrectFeedback
    : noteColor;

  // Calculate incorrect note position if present
  // Don't show incorrect feedback for sharps/flats - only natural notes
  const incorrectPosition =
    incorrectNote !== null && !incorrectNote.includes('#')
      ? getStaffPosition(incorrectNote, clef)
      : null;

  // Determine the position on the staff
  // Flats must use their letter position (e.g., A♭ at A's position, not G#'s position)
  const position = getStaffPosition(getStaffNoteName(note, noteName), clef);

  // Calculate animation position when a correct note is triggered
  useEffect(() => {
    if (correctAnimationCounter > 0 && lastCorrectNote) {
      // Use the full note name (including octave like 'C5') for position lookup
      const lastNoteY = positionToY(getStaffPosition(lastCorrectNote, clef));
      const lastNoteX = leftPadding + STAFF_ANIMATION_CONFIG.noteXOffset;

      setAnimationPosition({ x: lastNoteX, y: lastNoteY });

      // Snap all notes one slot right, then animate back to rest
      scrollOffset.value = STAFF_ANIMATION_CONFIG.NOTE_SPACING;
      scrollOffset.value = withTiming(0, {
        duration: STAFF_ANIMATION_CONFIG.STAFF_SCROLL_DURATION_MS,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [correctAnimationCounter, lastCorrectNote, clef, scrollOffset]);

  // Note X position
  const noteX = leftPadding + STAFF_ANIMATION_CONFIG.noteXOffset;

  const staffLineYs = STAFF_LINE_POSITIONS.map(positionToY);

  // Extra width for labels when shown
  const labelAreaWidth = showLabels ? 45 : 0;
  const totalWidth = width + labelAreaWidth;

  // Container padding for animation positioning
  const containerPadding = 10;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.staffBackground }]}
    >
      <CorrectNoteAnimation
        x={animationPosition.x + containerPadding}
        y={animationPosition.y + containerPadding}
        trigger={correctAnimationCounter}
        width={totalWidth + containerPadding * 2}
        height={height + containerPadding * 2}
      />
      <Svg
        width={totalWidth}
        height={height}
        viewBox={`0 0 ${totalWidth} ${height}`}
      >
        {/* Staff lines - turn red if incorrect note is on this line */}
        {staffLineYs.map((y) => {
          const incorrectY =
            incorrectPosition !== null ? positionToY(incorrectPosition) : null;
          const isIncorrectOnThisLine =
            incorrectY !== null && Math.abs(y - incorrectY) < 1;

          return (
            <Line
              key={y}
              x1={leftPadding - 10}
              y1={y}
              x2={width - 10}
              y2={y}
              stroke={
                isIncorrectOnThisLine
                  ? colors.incorrectFeedback
                  : colors.staffLine
              }
              strokeWidth={isIncorrectOnThisLine ? 2 : 1.5}
            />
          );
        })}

        {/* Hidden line indicator for incorrect notes (between visible staff lines or on ledger line) */}
        {incorrectPosition !== null &&
          (() => {
            const incorrectY = positionToY(incorrectPosition);
            // Check if this position is on a visible staff line
            const isOnStaffLine = staffLineYs.some(
              (y) => Math.abs(y - incorrectY) < 1,
            );
            // Show the full-width line if it's NOT on a visible staff line
            // This includes spaces between lines AND the ledger line position (C)
            const showHiddenLine = !isOnStaffLine;

            return showHiddenLine ? (
              <Line
                x1={leftPadding - 10}
                y1={incorrectY}
                x2={width - 10}
                y2={incorrectY}
                stroke={colors.incorrectFeedback}
                strokeWidth={2}
              />
            ) : null;
          })()}

        {/* Target note line */}
        <Line
          x1={noteX}
          y1={centerY - 4 * lineSpacing}
          x2={noteX}
          y2={centerY + 3 * lineSpacing}
          stroke="white"
          strokeWidth={1.5}
        />

        {/* Clef — static */}
        {clef === 'treble' ? (
          <G transform={`translate(${leftPadding - 10}, ${centerY - 50})`}>
            <TrebleClef color={colors.staffLine} />
          </G>
        ) : (
          <G transform={`translate(${leftPadding - 4}, ${positionToY(2)})`}>
            <BassClef color={colors.staffLine} />
          </G>
        )}

        {/* Note group — translates together on each correct press */}
        <AnimatedG animatedProps={animatedGroupProps}>
          {/* Departing note — slides out left during animation */}
          {departingNote && (
            <AnimatedG key="departing" animatedProps={departingNoteProps}>
              <StaffNote
                x={noteX - STAFF_ANIMATION_CONFIG.NOTE_SPACING}
                position={getStaffPosition(
                  getStaffNoteName(departingNote.note, departingNote.noteName),
                  clef,
                )}
                accidental={getAccidental(departingNote.note)}
                color={colors.correctFeedback}
              />
            </AnimatedG>
          )}

          {/* Current note - accidental highlights red if user pressed natural instead */}
          <StaffNote
            x={noteX}
            position={position}
            accidental={accidental}
            color={noteColor}
            accidentalColor={accidentalColor}
            ledgerColor={colors.staffLine}
          />

          {/* Upcoming notes (next 4) */}
          {upcomingNotes?.map((upcoming, i) => (
            <StaffNote
              key={upcoming.sequenceIndex}
              x={noteX + (i + 1) * STAFF_ANIMATION_CONFIG.NOTE_SPACING}
              position={getStaffPosition(
                getStaffNoteName(upcoming.displayName, upcoming.name),
                clef,
              )}
              accidental={getAccidental(upcoming.displayName)}
              color={colors.staffLine}
            />
          ))}
        </AnimatedG>

        {/* Staff line/space labels (shown when info button is held) */}
        {showLabels &&
          Object.entries(STAFF_LABELS[clef]).map(([pos, letter]) => {
            const posNum = parseInt(pos, 10);
            const labelY = positionToY(posNum);
            // Only show labels that are within the visible staff area
            if (labelY < 10 || labelY > height - 10) return null;
            // Lines are even positions, spaces are odd - stagger them
            const isLine = posNum % 2 === 0;
            const labelX = isLine ? width + 5 : width + 25;
            return (
              <SvgText
                key={pos}
                x={labelX}
                y={labelY + 5}
                fontSize={14}
                fontWeight="bold"
                fill={colors.staffLine}
                textAnchor="start"
              >
                {letter}
              </SvgText>
            );
          })}
      </Svg>
    </View>
  );
});

interface StaffNoteProps {
  x: number;
  position: number;
  accidental: Accidental;
  color: string;
  accidentalColor?: string;
  ledgerColor?: string;
}

/** A quarter note with its ledger lines and accidental */
function StaffNote({
  x,
  position,
  accidental,
  color,
  accidentalColor = color,
  ledgerColor = color,
}: StaffNoteProps) {
  const y = positionToY(position);
  // Notes above the middle line have stems pointing down, on the left of the head
  const stemDown = position > 0;
  const stemX = stemDown ? x - noteRadius + 1 : x + noteRadius - 1;
  const stemEndY = stemDown ? y + lineSpacing * 3 : y - lineSpacing * 3;

  return (
    <G>
      {getLedgerPositions(position).map((ledger) => (
        <Line
          key={ledger}
          x1={x - noteRadius - 6}
          y1={positionToY(ledger)}
          x2={x + noteRadius + 6}
          y2={positionToY(ledger)}
          stroke={ledgerColor}
          strokeWidth={1.5}
        />
      ))}
      {accidental && (
        <G transform={`translate(${x - accidentalOffset}, ${y})`}>
          {accidental === 'sharp' ? (
            <SharpSymbol color={accidentalColor} />
          ) : (
            <FlatSymbol color={accidentalColor} />
          )}
        </G>
      )}
      <Line
        x1={stemX}
        y1={y}
        x2={stemX}
        y2={stemEndY}
        stroke={color}
        strokeWidth={1.5}
      />
      <Ellipse
        cx={x}
        cy={y}
        rx={noteRadius}
        ry={noteRadius * 0.75}
        fill={color}
        transform={`rotate(-20, ${x}, ${y})`}
      />
    </G>
  );
}

/** F clef, drawn with its origin on the F3 line */
function BassClef({ color }: { color: string }) {
  return (
    <G>
      <Path
        d="M 2 -4 C 4 -20 18 -26 30 -23 C 46 -19 52 -2 44 16 C 36 34 18 48 -2 58 L -3 55 C 14 45 28 30 33 14 C 39 -4 34 -18 22 -18 C 14 -18 10 -13 10 -8 Z"
        fill={color}
      />
      <Circle cx={8} cy={-3} r={7} fill={color} />
      <Circle cx={58} cy={-12} r={3.5} fill={color} />
      <Circle cx={58} cy={12} r={3.5} fill={color} />
    </G>
  );
}

function TrebleClef({ color }: { color: string }) {
  // Path from assets/images/treble_clef.svg, scaled to fit staff
  return (
    <G transform="scale(0.16) translate(-30, -95)">
      <Path
        d="m2002 7851c-61 17-116 55-167 113-51 59-76 124-76 194 0 44 15 94 44 147 29 54 73 93 130 118 19 4 28 14 28 28 0 5-7 10-24 14-91-23-166-72-224-145-58-74-88-158-90-254 3-103 34-199 93-287 60-89 137-152 231-189l-69-355c-154 128-279 261-376 401-97 139-147 290-151 453 2 73 17 144 45 212 28 69 70 131 126 188 113 113 260 172 439 178 61-4 126-15 196-33l-155-783zm72-10l156 769c154-62 231-197 231-403-9-69-29-131-63-186-33-56-77-100-133-132s-119-48-191-48zm-205-1040c33-20 71-55 112-104 41-48 81-105 119-169 39-65 70-131 93-198 23-66 34-129 34-187 0-25-2-50-7-72-4-36-15-64-34-83-19-18-43-28-73-28-60 0-114 37-162 111-37 64-68 140-90 226-23 87-36 173-38 260 5 99 21 180 46 244zm-63 58c-45-162-70-327-75-495 1-108 12-209 33-303 20-94 49-175 87-245 37-70 80-123 128-159 43-32 74-49 91-49 13 0 24 5 34 14s23 24 39 44c119 169 179 373 179 611 0 113-15 223-45 333-29 109-72 213-129 310-58 98-126 183-205 256l81 394c44-5 74-9 91-9 76 0 144 16 207 48s117 75 161 130c44 54 78 116 102 186 23 70 36 143 36 219 0 118-31 226-93 323s-155 168-280 214c8 49 22 120 43 211 20 92 35 165 45 219s14 106 14 157c0 79-19 149-57 211-39 62-91 110-157 144-65 34-137 51-215 51-110 0-206-31-288-92-82-62-126-145-130-251 3-47 14-91 34-133s47-76 82-102c34-27 75-41 122-44 39 0 76 11 111 32 34 22 62 51 83 88 20 37 31 78 31 122 0 59-20 109-60 150s-91 62-152 62h-23c39 60 103 91 192 91 45 0 91-10 137-28 47-19 86-44 119-76s55-66 64-102c17-41 25-98 25-169 0-48-5-96-14-144-9-47-23-110-42-188-19-77-33-137-41-178-60 15-122 23-187 23-109 0-212-22-309-67s-182-107-256-187c-73-80-130-170-171-272-40-101-61-207-62-317 4-102 23-200 59-292 36-93 82-181 139-263s116-157 177-224c62-66 143-151 245-254z"
        fill={color}
        transform="matrix(.21599 0 0 .21546 -250.44 -1202.6)"
      />
    </G>
  );
}

function SharpSymbol({ color }: { color: string }) {
  return (
    <G transform="scale(1.8)">
      {/* Vertical lines */}
      <Line x1={-2} y1={-7} x2={-2} y2={7} stroke={color} strokeWidth={1.5} />
      <Line x1={2} y1={-7} x2={2} y2={7} stroke={color} strokeWidth={1.5} />
      {/* Horizontal lines (slightly angled) */}
      <Line x1={-5} y1={-2} x2={5} y2={-3} stroke={color} strokeWidth={2} />
      <Line x1={-5} y1={3} x2={5} y2={2} stroke={color} strokeWidth={2} />
    </G>
  );
}

function FlatSymbol({ color }: { color: string }) {
  return (
    <G transform="scale(1.8)">
      {/* Vertical stem */}
      <Line x1={-2} y1={-10} x2={-2} y2={5} stroke={color} strokeWidth={1.5} />
      {/* Curved part */}
      <Path
        d="M -2 0 C 2 -2 5 0 5 3 C 5 6 2 7 -2 5"
        stroke={color}
        strokeWidth={1.5}
        fill="none"
      />
    </G>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 10,
    overflow: 'hidden',
  },
});
