import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path } from 'react-native-svg';
import { NOTE_STAFF_POSITIONS, STAFF_CONFIG } from '@/constants/StaffConfig';
import { useTheme } from '@/hooks/useTheme';
import type { NoteName } from '@/types/piano';

interface StaffDisplayProps {
  note: string; // Display name like "C#" or "Db"
}

export function StaffDisplay({ note }: StaffDisplayProps) {
  const { colors } = useTheme();

  // Parse the note to get base note and accidental
  const isSharp = note.includes('#');
  const isFlat = note.includes('b');
  const baseLetter = note.charAt(0).toUpperCase();

  // Map display note to NoteName for position lookup
  // For flats, map to the equivalent sharp (Db -> C#, etc.)
  const flatToSharpMap: Record<string, NoteName> = {
    Db: 'C#',
    Eb: 'D#',
    Gb: 'F#',
    Ab: 'G#',
    Bb: 'A#',
  };

  let noteName: NoteName;
  if (isFlat) {
    noteName = flatToSharpMap[note] || (baseLetter as NoteName);
  } else if (isSharp) {
    noteName = note as NoteName;
  } else {
    noteName = baseLetter as NoteName;
  }

  const position = NOTE_STAFF_POSITIONS[noteName] ?? 0;
  const {
    width,
    height,
    lineSpacing,
    noteRadius,
    leftPadding,
    accidentalOffset,
  } = STAFF_CONFIG;

  // Calculate Y position for the note
  // Staff center is at height/2, each position step moves by half lineSpacing
  const centerY = height / 2;
  const noteY = centerY - position * (lineSpacing / 2);

  // Note X position
  const noteX = leftPadding + 60;

  // Determine if we need a ledger line (for middle C)
  const needsLedgerLine = position <= -6;

  // Staff lines Y positions (5 lines)
  const staffLineYs = [
    centerY - 2 * lineSpacing, // Top line
    centerY - lineSpacing,
    centerY, // Middle line (B)
    centerY + lineSpacing,
    centerY + 2 * lineSpacing, // Bottom line (E)
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.noteDisplay }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Staff lines */}
        {staffLineYs.map((y) => (
          <Line
            key={y}
            x1={leftPadding - 10}
            y1={y}
            x2={width - 10}
            y2={y}
            stroke={colors.staffLine}
            strokeWidth={1.5}
          />
        ))}

        {/* Treble clef */}
        <G transform={`translate(${leftPadding - 5}, ${centerY - 25})`}>
          <TrebleClef color={colors.staffLine} />
        </G>

        {/* Ledger line for middle C */}
        {needsLedgerLine && (
          <Line
            x1={noteX - noteRadius - 6}
            y1={noteY}
            x2={noteX + noteRadius + 6}
            y2={noteY}
            stroke={colors.staffLine}
            strokeWidth={1.5}
          />
        )}

        {/* Accidental (sharp or flat) */}
        {(isSharp || isFlat) && (
          <G transform={`translate(${noteX - accidentalOffset}, ${noteY})`}>
            {isSharp ? (
              <SharpSymbol color={colors.staffAccidental} />
            ) : (
              <FlatSymbol color={colors.staffAccidental} />
            )}
          </G>
        )}

        {/* Note head (filled ellipse for quarter note) */}
        <Ellipse
          cx={noteX}
          cy={noteY}
          rx={noteRadius}
          ry={noteRadius * 0.75}
          fill={colors.staffNote}
          transform={`rotate(-20, ${noteX}, ${noteY})`}
        />
      </Svg>
    </View>
  );
}

function TrebleClef({ color }: { color: string }) {
  return (
    <G transform="scale(0.7)">
      {/* Simplified treble clef using basic shapes */}
      <Path
        d="M 15 45 C 15 30 25 15 25 8 C 25 2 20 0 15 3 C 10 6 12 15 15 20 C 18 25 22 30 22 40 C 22 50 18 58 14 62 C 10 66 6 66 6 62 C 6 58 10 54 14 50 C 18 46 22 40 22 32"
        stroke={color}
        strokeWidth={2.5}
        fill="none"
      />
      <Circle cx={15} cy={65} r={3} fill={color} />
    </G>
  );
}

function SharpSymbol({ color }: { color: string }) {
  return (
    <G>
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
    <G>
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
  },
});
