import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_DIFFICULTY,
  KEY_ORDER,
  NOTES,
  SHARP_DISPLAY_NAMES,
} from '@/constants/PianoConfig';
import type {
  Difficulty,
  GameState,
  KeyFeedback,
  Note,
  NoteName,
} from '@/types/piano';

// Map second octave notes to their base notes (for keyboard input validation)
export const NOTE_TO_BASE: Record<NoteName, NoteName> = {
  C: 'C',
  'C#': 'C#',
  D: 'D',
  'D#': 'D#',
  E: 'E',
  F: 'F',
  'F#': 'F#',
  G: 'G',
  'G#': 'G#',
  A: 'A',
  'A#': 'A#',
  B: 'B',
  // Second octave maps to base notes
  C2: 'C',
  'C#2': 'C#',
  D2: 'D',
  'D#2': 'D#',
  E2: 'E',
  F2: 'F',
};

function generateRandomNotes(count: number): Note[] {
  const notes: Note[] = [];
  let previousNote: NoteName | null = null;

  for (let i = 0; i < count; i++) {
    let note: NoteName;
    // Ensure no consecutive repeats
    do {
      note = KEY_ORDER[Math.floor(Math.random() * KEY_ORDER.length)];
    } while (note === previousNote);

    previousNote = note;

    const noteData = NOTES[note];
    // For display, use the base note name (strip octave suffix)
    // e.g., 'C2' -> 'C', 'C#2' -> 'C#'
    let displayName: string = note.replace('2', '');

    // For sharps, randomly pick sharp or flat notation
    if (SHARP_DISPLAY_NAMES[note]) {
      const variants = SHARP_DISPLAY_NAMES[note];
      displayName = variants[Math.floor(Math.random() * 2)];
    }

    notes.push({
      name: note,
      displayName,
      isBlack: noteData.isBlack,
      soundFile: noteData.soundFile,
    });
  }

  return notes;
}

const initialState: GameState = {
  status: 'idle',
  difficulty: DEFAULT_DIFFICULTY,
  currentNoteIndex: 0,
  notes: [],
  startTime: null,
  elapsedMs: 0,
  accuracy: 0,
  correctCount: 0,
  incorrectCount: 0,
};

export function usePianoGame() {
  const [state, setState] = useState<GameState>(initialState);
  const [keyFeedback, setKeyFeedback] = useState<Record<NoteName, KeyFeedback>>(
    Object.fromEntries(KEY_ORDER.map((k) => [k, 'none'])) as Record<
      NoteName,
      KeyFeedback
    >,
  );
  const [incorrectNote, setIncorrectNote] = useState<NoteName | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedbackTimeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(
    new Set(),
  );
  const feedbackKeyRef = useRef(0);

  // Timer update effect
  useEffect(() => {
    if (state.status === 'playing' && state.startTime) {
      timerRef.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          elapsedMs: Date.now() - (prev.startTime || Date.now()),
        }));
      }, 100);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.status, state.startTime]);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    setState((prev) => ({ ...prev, difficulty }));
  }, []);

  const startGame = useCallback(
    (difficulty?: Difficulty) => {
      const diff = difficulty ?? state.difficulty;
      const notes = generateRandomNotes(diff);

      setState({
        status: 'playing',
        difficulty: diff,
        currentNoteIndex: 0,
        notes,
        startTime: Date.now(),
        elapsedMs: 0,
        accuracy: 0,
        correctCount: 0,
        incorrectCount: 0,
      });
    },
    [state.difficulty],
  );

  const handleKeyPress = useCallback(
    (pressedNote: NoteName): boolean => {
      if (state.status !== 'playing') return false;

      const currentNote = state.notes[state.currentNoteIndex];
      // Check if pressed note matches, accounting for octave equivalents
      // (e.g., pressing 'C' or 'C2' is correct for 'C2', and vice versa)
      const pressedBaseNote = NOTE_TO_BASE[pressedNote];
      const expectedBaseNote = NOTE_TO_BASE[currentNote.name];
      const isCorrect = pressedBaseNote === expectedBaseNote;

      // Set feedback with unique key to trigger animation
      feedbackKeyRef.current += 1;
      setKeyFeedback((prev) => ({
        ...prev,
        [pressedNote]: isCorrect ? 'correct' : 'incorrect',
      }));

      // Track incorrect note for staff display
      if (!isCorrect) {
        setIncorrectNote(pressedNote);
      }

      // Clear feedback after animation (with cleanup tracking)
      const timeoutId = setTimeout(() => {
        feedbackTimeoutsRef.current.delete(timeoutId);
        setKeyFeedback((prev) => ({
          ...prev,
          [pressedNote]: 'none',
        }));
        if (!isCorrect) {
          setIncorrectNote(null);
        }
      }, 300);
      feedbackTimeoutsRef.current.add(timeoutId);

      if (isCorrect) {
        const nextIndex = state.currentNoteIndex + 1;

        if (nextIndex >= state.notes.length) {
          // Game complete
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setState((prev) => {
            const total = prev.correctCount + prev.incorrectCount + 1; // +1 for this last correct
            const correct = prev.correctCount + 1;
            const accuracy = total > 0 ? correct / total : 0;
            return {
              ...prev,
              status: 'finished',
              elapsedMs: Date.now() - (prev.startTime || Date.now()),
              correctCount: correct,
              accuracy,
            };
          });
        } else {
          // Move to next note and increment correctCount
          setState((prev) => ({
            ...prev,
            currentNoteIndex: nextIndex,
            correctCount: prev.correctCount + 1,
          }));
        }
      } else {
        // Increment incorrectCount
        setState((prev) => ({
          ...prev,
          incorrectCount: prev.incorrectCount + 1,
        }));
      }

      return isCorrect;
    },
    [state.status, state.notes, state.currentNoteIndex],
  );

  const pauseGame = useCallback(() => {
    if (state.status !== 'playing') return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      status: 'paused',
      elapsedMs: Date.now() - (prev.startTime || Date.now()),
    }));
  }, [state.status]);

  const resumeGame = useCallback(() => {
    if (state.status !== 'paused') return;

    setState((prev) => ({
      ...prev,
      status: 'playing',
      startTime: Date.now() - prev.elapsedMs,
    }));
  }, [state.status]);

  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // Clear all pending feedback timeouts
    for (const timeoutId of feedbackTimeoutsRef.current) {
      clearTimeout(timeoutId);
    }
    feedbackTimeoutsRef.current.clear();
    setState(initialState);
    setKeyFeedback(
      Object.fromEntries(KEY_ORDER.map((k) => [k, 'none'])) as Record<
        NoteName,
        KeyFeedback
      >,
    );
    setIncorrectNote(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      for (const timeoutId of feedbackTimeoutsRef.current) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return {
    state,
    keyFeedback,
    incorrectNote,
    setDifficulty,
    startGame,
    handleKeyPress,
    pauseGame,
    resumeGame,
    resetGame,
  };
}
