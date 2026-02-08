export type NoteName =
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
  | 'B'
  // Second octave (up to F on top line of treble clef)
  | 'C2'
  | 'C#2'
  | 'D2'
  | 'D#2'
  | 'E2'
  | 'F2';

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
  enableHapticFeedback: boolean;
  playSoundInSilentMode: boolean;
  showTimer: boolean;
  showCorrectAnimation: boolean;
  showSecondOctave: boolean;
}

export type KeyFeedback = 'none' | 'correct' | 'incorrect';

export interface GameScore {
  id: string;
  difficultyLevel: DifficultyLevel;
  noteCount: NoteCount;
  accuracy: number;
  elapsedMs: number;
  timestamp: number;
}

// Route param types for type-safe navigation
export interface GameRouteParams {
  difficultyLevel: DifficultyLevel;
  noteCount: NoteCount;
}

export interface ResultsRouteParams {
  difficultyLevel: string;
  noteCount: string;
  elapsedMs: string;
  accuracy: string;
}
