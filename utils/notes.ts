import type { NoteName, PitchClass } from '@/types/piano';

// Kept free of constants imports so constants/PianoConfig.ts can use these
// helpers without a circular import.

/**
 * Strips the octave from a note name.
 * e.g., 'C4' -> 'C', 'C#5' -> 'C#'
 */
export function getPitchClass(note: NoteName): PitchClass {
  return note.slice(0, -1) as PitchClass;
}

/**
 * Gets the octave number of a note name.
 * e.g., 'C4' -> 4, 'C#5' -> 5
 */
export function getOctave(note: NoteName): number {
  return Number(note.slice(-1));
}

/**
 * The note whose staff position a displayed note uses. Flats sit on their own
 * letter's line or space, so a C#4 displayed as D♭ is drawn at D4.
 */
export function getStaffNoteName(
  displayName: string,
  note: NoteName,
): NoteName {
  if (displayName.includes('♭')) {
    return `${displayName.charAt(0)}${getOctave(note)}` as NoteName;
  }
  return note;
}
