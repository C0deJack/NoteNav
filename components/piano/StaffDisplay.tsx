import { StyleSheet, View } from 'react-native';
import Svg, { Ellipse, G, Line, Path } from 'react-native-svg';
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
  const noteX = leftPadding + 100;

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
    <View
      style={[styles.container, { backgroundColor: colors.staffBackground }]}
    >
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
        <G transform={`translate(${leftPadding - 10}, ${centerY - 50})`}>
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

        {/* Note stem (upward) */}
        <Line
          x1={noteX + noteRadius - 1}
          y1={noteY}
          x2={noteX + noteRadius - 1}
          y2={noteY - lineSpacing * 3}
          stroke={colors.staffNote}
          strokeWidth={1.5}
        />

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
  },
});
