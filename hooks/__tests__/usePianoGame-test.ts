import { act, renderHook } from '@testing-library/react-native';
import { NOTE_TO_BASE, usePianoGame } from '../usePianoGame';

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
      const baseNote = NOTE_TO_BASE[currentNote];
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
      const baseNote = NOTE_TO_BASE[currentNote];
      // Pick a different note
      const wrongNote = baseNote === 'C' ? 'D' : 'C';
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
      const baseNote = NOTE_TO_BASE[currentNote];

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
      const baseNote = NOTE_TO_BASE[currentNote];
      const wrongNote = baseNote === 'C' ? 'D' : 'C';

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
        const baseNote = NOTE_TO_BASE[currentNote];

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
        isCorrect = result.current.handleKeyPress('C');
      });

      expect(isCorrect!).toBe(false);
    });

    it('sets key feedback on press', async () => {
      const { result } = await renderHook(() => usePianoGame());

      await act(() => {
        result.current.startGame('easy', 3);
      });

      const currentNote = result.current.state.notes[0].name;
      const baseNote = NOTE_TO_BASE[currentNote];

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
      const baseNote = NOTE_TO_BASE[currentNote];

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
      const wrongNote = NOTE_TO_BASE[firstNote] === 'C' ? 'D' : 'C';

      await act(() => {
        result.current.handleKeyPress(wrongNote);
      });

      // Now complete all 3 notes
      for (let i = 0; i < 3; i++) {
        const currentNote = result.current.state.notes[i].name;
        const baseNote = NOTE_TO_BASE[currentNote];

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

describe('NOTE_TO_BASE', () => {
  it('maps first octave notes to themselves', () => {
    expect(NOTE_TO_BASE.C).toBe('C');
    expect(NOTE_TO_BASE['C#']).toBe('C#');
    expect(NOTE_TO_BASE.D).toBe('D');
    expect(NOTE_TO_BASE.B).toBe('B');
  });

  it('maps second octave notes to first octave', () => {
    expect(NOTE_TO_BASE.C2).toBe('C');
    expect(NOTE_TO_BASE['C#2']).toBe('C#');
    expect(NOTE_TO_BASE.D2).toBe('D');
    expect(NOTE_TO_BASE.F2).toBe('F');
  });
});
