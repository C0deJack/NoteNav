import { act, renderHook } from '@testing-library/react-native';
import { DIFFICULTY_NOTE_POOLS } from '@/constants/PianoConfig';
import type { NoteName } from '@/types/piano';
import { getPitchClass } from '@/utils/notes';
import { usePianoGame } from '../usePianoGame';

/** A note with a different pitch class from the one given */
const wrongNoteFor = (note: NoteName): NoteName =>
  getPitchClass(note) === 'C' ? 'D4' : 'C4';

describe('usePianoGame', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initial state', () => {
    it('starts with idle status', async () => {
      const { result } = await renderHook(() => usePianoGame());

      expect(result.current.state.status).toBe('idle');
      expect(result.current.state.notes).toHaveLength(0);
      expect(result.current.state.currentNoteIndex).toBe(0);
    });

    it('has default difficulty level and note count', async () => {
      const { result } = await renderHook(() => usePianoGame());

      expect(result.current.state.difficultyLevel).toBe('easy');
      expect(result.current.state.noteCount).toBe(10);
    });
  });

  describe('startGame', () => {
    it('changes status to playing', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.startGame('easy', 10);
      });

      expect(result.current.state.status).toBe('playing');
    });

    it('generates notes based on note count', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.startGame('easy', 3);
      });

      expect(result.current.state.notes).toHaveLength(3);
      expect(result.current.state.noteCount).toBe(3);
    });

    it('sets difficulty level', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.startGame('hard', 10);
      });

      expect(result.current.state.difficultyLevel).toBe('hard');
    });

    it('sets start time', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.startGame('easy', 10);
      });

      expect(result.current.state.startTime).not.toBeNull();
    });

    it('resets counters', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.startGame('easy', 10);
      });

      expect(result.current.state.correctCount).toBe(0);
      expect(result.current.state.incorrectCount).toBe(0);
      expect(result.current.state.currentNoteIndex).toBe(0);
    });
  });

  describe('handleKeyPress', () => {
    it('returns true for correct note', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.startGame('easy', 3);
      });

      const currentNote = result.current.state.notes[0].name;
      const baseNote = currentNote;
      let isCorrect: boolean;

      await act(() => {
        isCorrect = result.current.handleKeyPress(baseNote);
      });

      expect(isCorrect!).toBe(true);
    });

    it('returns false for incorrect note', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.startGame('easy', 3);
      });

      const currentNote = result.current.state.notes[0].name;
      const wrongNote = wrongNoteFor(currentNote);
      let isCorrect: boolean;

      await act(() => {
        isCorrect = result.current.handleKeyPress(wrongNote);
      });

      expect(isCorrect!).toBe(false);
    });

    it('advances to next note on correct press', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.startGame('easy', 3);
      });

      const currentNote = result.current.state.notes[0].name;
      const baseNote = currentNote;

      await act(() => {
        result.current.handleKeyPress(baseNote);
      });

      expect(result.current.state.currentNoteIndex).toBe(1);
      expect(result.current.state.correctCount).toBe(1);
    });

    it('increments incorrect count on wrong press', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.startGame('easy', 3);
      });

      const currentNote = result.current.state.notes[0].name;
      const wrongNote = wrongNoteFor(currentNote);

      await act(() => {
        result.current.handleKeyPress(wrongNote);
      });

      expect(result.current.state.currentNoteIndex).toBe(0); // Stays on same note
      expect(result.current.state.incorrectCount).toBe(1);
    });

    it('finishes game when all notes completed', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.startGame('easy', 3);
      });

      // Complete all 3 notes
      for (let i = 0; i < 3; i++) {
        const currentNote = result.current.state.notes[i].name;
        const baseNote = currentNote;

        await act(() => {
          result.current.handleKeyPress(baseNote);
        });
      }

      expect(result.current.state.status).toBe('finished');
    });

    it('does not respond when game is not playing', async () => {
      const { result } = await renderHook(() => usePianoGame());

      let isCorrect: boolean;

      await act(() => {
        isCorrect = result.current.handleKeyPress('C4');
      });

      expect(isCorrect!).toBe(false);
    });

    it('sets key feedback on press', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.startGame('easy', 3);
      });

      const currentNote = result.current.state.notes[0].name;
      const baseNote = currentNote;

      await act(() => {
        result.current.handleKeyPress(baseNote);
      });

      expect(result.current.keyFeedback[baseNote]).toBe('correct');
    });

    it('clears key feedback after timeout', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.startGame('easy', 3);
      });

      const currentNote = result.current.state.notes[0].name;
      const baseNote = currentNote;

      await act(() => {
        result.current.handleKeyPress(baseNote);
      });

      await act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.keyFeedback[baseNote]).toBe('none');
    });
  });

  describe('pauseGame', () => {
    it('changes status to paused', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.startGame('easy', 10);
      });

      await act(() => {
        result.current.pauseGame();
      });

      expect(result.current.state.status).toBe('paused');
    });

    it('does nothing when not playing', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.pauseGame();
      });

      expect(result.current.state.status).toBe('idle');
    });
  });

  describe('resumeGame', () => {
    it('changes status back to playing', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.startGame('easy', 10);
      });

      await act(() => {
        result.current.pauseGame();
      });

      await act(() => {
        result.current.resumeGame();
      });

      expect(result.current.state.status).toBe('playing');
    });

    it('does nothing when not paused', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.startGame('easy', 10);
      });

      await act(() => {
        result.current.resumeGame();
      });

      expect(result.current.state.status).toBe('playing');
    });
  });

  describe('resetGame', () => {
    it('resets to initial state', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.startGame('hard', 25);
      });

      await act(() => {
        result.current.resetGame();
      });

      expect(result.current.state.status).toBe('idle');
      expect(result.current.state.notes).toHaveLength(0);
      expect(result.current.state.currentNoteIndex).toBe(0);
    });
  });

  describe('accuracy calculation', () => {
    it('calculates accuracy correctly on game finish', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.startGame('easy', 3);
      });

      // Get first note wrong once
      const firstNote = result.current.state.notes[0].name;
      const wrongNote = wrongNoteFor(firstNote);

      await act(() => {
        result.current.handleKeyPress(wrongNote);
      });

      // Now complete all 3 notes
      for (let i = 0; i < 3; i++) {
        const currentNote = result.current.state.notes[i].name;
        const baseNote = currentNote;

        await act(() => {
          result.current.handleKeyPress(baseNote);
        });
      }

      expect(result.current.state.status).toBe('finished');
      // 3 correct, 1 incorrect = 3/4 accuracy
      expect(result.current.state.accuracy).toBeCloseTo(3 / 4);
    });
  });
});

describe('octave equivalence', () => {
  it('accepts the same note in another octave', async () => {
    const { result } = await renderHook(() => usePianoGame());

    await act(() => {
      result.current.startGame('medium', 100);
    });

    // Find a note that exists in both octaves on the keyboard (C to F)
    const index = result.current.state.notes.findIndex((n) =>
      ['C', 'D', 'E', 'F'].includes(getPitchClass(n.name)),
    );
    for (let i = 0; i < index; i++) {
      const name = result.current.state.notes[i].name;
      await act(() => {
        result.current.handleKeyPress(name);
      });
    }

    const target = result.current.state.notes[index].name;
    const otherOctave = (
      target.endsWith('4') ? target.replace('4', '5') : target.replace('5', '4')
    ) as NoteName;
    let isCorrect: boolean;

    await act(() => {
      isCorrect = result.current.handleKeyPress(otherOctave);
    });

    expect(isCorrect!).toBe(true);
  });
});

describe('clef', () => {
  it('defaults to treble', async () => {
    const { result } = await renderHook(() => usePianoGame());

    await act(() => {
      result.current.startGame('expert', 100);
    });

    expect(result.current.state.clef).toBe('treble');
  });

  it('only generates bass notes in a bass game', async () => {
    const { result } = await renderHook(() => usePianoGame());

    await act(() => {
      result.current.startGame('expert', 100, 'bass');
    });

    expect(result.current.state.clef).toBe('bass');
    for (const note of result.current.state.notes) {
      expect(DIFFICULTY_NOTE_POOLS.bass.expert).toContain(note.name);
    }
  });

  it('accepts a key an octave below the bass note shown', async () => {
    const { result } = await renderHook(() => usePianoGame());

    await act(() => {
      result.current.startGame('easy', 3, 'bass');
    });

    const target = result.current.state.notes[0].name;
    const octaveBelow = target.replace(/\d$/, (o) =>
      String(Number(o) - 1),
    ) as NoteName;
    let isCorrect: boolean;

    await act(() => {
      isCorrect = result.current.handleKeyPress(octaveBelow);
    });

    expect(isCorrect!).toBe(true);
  });
});
