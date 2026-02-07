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
  | 'F2'
  | 'F#2';

export type Difficulty = 3 | 10 | 25 | 100;

export interface Note {
  name: NoteName;
  displayName: string; // For sharps: randomly "C#" or "Db"
  isBlack: boolean;
  soundFile: string;
}

export interface GameState {
  status: 'idle' | 'playing' | 'paused' | 'finished';
  difficulty: Difficulty;
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
  difficulty: Difficulty;
  accuracy: number;
  elapsedMs: number;
  timestamp: number;
}
