/**
 * Every note the app can show or play, lowest to highest, in scientific pitch
 * notation (middle C = C4). Sharps only; flats are a display concern.
 */
export const ALL_NOTES = [
  'G2', // Bottom line of bass staff
  'G#2',
  'A2',
  'A#2',
  'B2',
  'C3',
  'C#3',
  'D3',
  'D#3',
  'E3',
  'F3',
  'F#3',
  'G3',
  'G#3',
  'A3',
  'A#3',
  'B3',
  'C4', // Middle C
  'C#4',
  'D4',
  'D#4',
  'E4',
  'F4',
  'F#4',
  'G4',
  'G#4',
  'A4',
  'A#4',
  'B4',
  'C5',
  'C#5',
  'D5',
  'D#5',
  'E5',
  'F5', // Top line of treble staff
] as const;

export type NoteName = (typeof ALL_NOTES)[number];

/** A note without its octave, e.g. 'C#' */
export type PitchClass =
  | 'C'
  | 'C#'
  | 'D'
  | 'D#'
  | 'E'
  | 'F'
  | 'F#'
  | 'G'
  | 'G#'
  | 'A'
  | 'A#'
  | 'B';

/** Which staff the game is played on */
export type Clef = 'treble' | 'bass';

/** Number of notes per game */
export type NoteCount = 3 | 10 | 25 | 100;

/** Difficulty level determines which notes are included */
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

/**
 * @deprecated Use NoteCount instead. Kept for backward compatibility with saved scores.
 */
export type Difficulty = NoteCount;

export interface Note {
  name: NoteName;
  displayName: string; // For sharps: randomly "C#" or "Db"
  isBlack: boolean;
  soundFile: string;
}

export interface GameState {
  status: 'idle' | 'playing' | 'paused' | 'finished';
  clef: Clef;
  difficultyLevel: DifficultyLevel;
  noteCount: NoteCount;
  currentNoteIndex: number;
  notes: Note[];
  startTime: number | null;
  elapsedMs: number;
  accuracy: number;
  correctCount: number;
  incorrectCount: number;
}

export type NoteDisplayMode = 'text' | 'staff';

export interface GameSettings {
  showWhiteKeyLabels: boolean;
  showBlackKeyLabels: boolean;
  noteDisplayMode: NoteDisplayMode;
  showIncorrectFeedback: boolean;
  playIncorrectSound: boolean;
  enableHapticFeedback: boolean;
  playSoundInSilentMode: boolean;
  showTimer: boolean;
  showCorrectAnimation: boolean;
  showSecondOctave: boolean;
}

export type KeyFeedback = 'none' | 'correct' | 'incorrect';

export interface GameScore {
  id: string;
  /** Missing on scores saved before bass clef was added; treat as treble */
  clef?: Clef;
  difficultyLevel: DifficultyLevel;
  noteCount: NoteCount;
  accuracy: number;
  elapsedMs: number;
  timestamp: number;
}

/** Stats for a single difficulty level */
export interface DifficultyStats {
  totalGames: number;
  averageAccuracy: number;
  bestSpeed: number;
  averageScore: number;
  bestScore: number;
  totalTimePlayed: number;
}

// Route param types for type-safe navigation
export interface GameRouteParams {
  clef: Clef;
  difficultyLevel: DifficultyLevel;
  noteCount: NoteCount;
}

export interface ResultsRouteParams {
  clef: string;
  difficultyLevel: string;
  noteCount: string;
  elapsedMs: string;
  accuracy: string;
}
