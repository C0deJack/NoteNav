export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export type Difficulty = 3 | 10 | 25 | 100;

export interface Note {
  name: NoteName;
  displayName: string; // For sharps: randomly "C#" or "Db"
  isBlack: boolean;
  soundFile: string;
}

export interface GameState {
  status: 'idle' | 'playing' | 'finished';
  difficulty: Difficulty;
  currentNoteIndex: number;
  notes: Note[];
  startTime: number | null;
  elapsedMs: number;
}

export interface GameSettings {
  showNoteLabels: boolean;
}

export type KeyFeedback = 'none' | 'correct' | 'incorrect';
