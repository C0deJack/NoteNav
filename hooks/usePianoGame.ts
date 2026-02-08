import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_DIFFICULTY_LEVEL,
  DEFAULT_NOTE_COUNT,
  DIFFICULTY_NOTE_POOLS,
  KEY_ORDER,
  NOTES,
  SHARP_DISPLAY_NAMES,
} from '@/constants/PianoConfig';
import type {
  DifficultyLevel,
  GameState,
  KeyFeedback,
  Note,
  NoteCount,
  NoteName,
} from '@/types/piano';
import { getBaseNoteName } from '@/utils/game';

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

function generateRandomNotes(
  count: NoteCount,
  difficultyLevel: DifficultyLevel,
): Note[] {
  const notePool = DIFFICULTY_NOTE_POOLS[difficultyLevel];
  const notes: Note[] = [];
  let previousNote: NoteName | null = null;

  for (let i = 0; i < count; i++) {
    let note: NoteName;
    // Ensure no consecutive repeats
    do {
      note = notePool[Math.floor(Math.random() * notePool.length)];
    } while (note === previousNote && notePool.length > 1);

    previousNote = note;

    const noteData = NOTES[note];
    // For display, use the base note name (strip octave suffix)
    let displayName: string = getBaseNoteName(note);

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
  difficultyLevel: DEFAULT_DIFFICULTY_LEVEL,
  noteCount: DEFAULT_NOTE_COUNT,
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

  const startGame = useCallback(
    (difficultyLevel?: DifficultyLevel, noteCount?: NoteCount) => {
      const level = difficultyLevel ?? state.difficultyLevel;
      const count = noteCount ?? state.noteCount;
      const notes = generateRandomNotes(count, level);

      setState({
        status: 'playing',
        difficultyLevel: level,
        noteCount: count,
        currentNoteIndex: 0,
        notes,
        startTime: Date.now(),
        elapsedMs: 0,
        accuracy: 0,
        correctCount: 0,
        incorrectCount: 0,
      });
    },
    [state.difficultyLevel, state.noteCount],
  );

  /**
   * Handles a piano key press during gameplay.
   * Returns true if the pressed note was correct, false otherwise.
   */
  const handleKeyPress = useCallback(
    (pressedNote: NoteName): boolean => {
      if (state.status !== 'playing') return false;

      // --- 1. Validate the pressed note against the expected note ---
      const currentNote = state.notes[state.currentNoteIndex];
      // Check if pressed note matches, accounting for octave equivalents
      // (e.g., pressing 'C' or 'C2' is correct for 'C2', and vice versa)
      const pressedBaseNote = NOTE_TO_BASE[pressedNote];
      const expectedBaseNote = NOTE_TO_BASE[currentNote.name];
      const isCorrect = pressedBaseNote === expectedBaseNote;

      // --- 2. Update visual feedback on the pressed key ---
      setKeyFeedback((prev) => ({
        ...prev,
        [pressedNote]: isCorrect ? 'correct' : 'incorrect',
      }));

      // Track incorrect note for staff display highlighting
      if (!isCorrect) {
        setIncorrectNote(pressedNote);
      }

      // --- 3. Schedule feedback cleanup after animation ---
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

      // --- 4. Update game state based on correctness ---
      if (isCorrect) {
        const nextIndex = state.currentNoteIndex + 1;

        if (nextIndex >= state.notes.length) {
          // Game complete: stop timer and calculate final accuracy
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setState((prev) => {
            const total = prev.correctCount + prev.incorrectCount + 1;
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
          // Advance to next note
          setState((prev) => ({
            ...prev,
            currentNoteIndex: nextIndex,
            correctCount: prev.correctCount + 1,
          }));
        }
      } else {
        // Wrong note: increment error count (player must retry same note)
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
    startGame,
    handleKeyPress,
    pauseGame,
    resumeGame,
    resetGame,
  };
}
