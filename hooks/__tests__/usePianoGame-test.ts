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
    it('starts with idle status', () => {
      const { result } = renderHook(() => usePianoGame());

      expect(result.current.state.status).toBe('idle');
      expect(result.current.state.notes).toHaveLength(0);
      expect(result.current.state.currentNoteIndex).toBe(0);
    });

    it('has default difficulty of 10', () => {
      const { result } = renderHook(() => usePianoGame());

      expect(result.current.state.difficulty).toBe(10);
    });
  });

  describe('setDifficulty', () => {
    it('updates difficulty', () => {
      const { result } = renderHook(() => usePianoGame());

      act(() => {
        result.current.setDifficulty(25);
      });

      expect(result.current.state.difficulty).toBe(25);
    });
  });

  describe('startGame', () => {
    it('changes status to playing', () => {
      const { result } = renderHook(() => usePianoGame());

      act(() => {
        result.current.startGame();
      });

      expect(result.current.state.status).toBe('playing');
    });

    it('generates notes based on difficulty', () => {
      const { result } = renderHook(() => usePianoGame());

      act(() => {
        result.current.startGame(3);
      });

      expect(result.current.state.notes).toHaveLength(3);
      expect(result.current.state.difficulty).toBe(3);
    });

    it('sets start time', () => {
      const { result } = renderHook(() => usePianoGame());

      act(() => {
        result.current.startGame();
      });

      expect(result.current.state.startTime).not.toBeNull();
    });

    it('resets counters', () => {
      const { result } = renderHook(() => usePianoGame());

      act(() => {
        result.current.startGame();
      });

      expect(result.current.state.correctCount).toBe(0);
      expect(result.current.state.incorrectCount).toBe(0);
      expect(result.current.state.currentNoteIndex).toBe(0);
    });
  });

  describe('handleKeyPress', () => {
    it('returns true for correct note', () => {
      const { result } = renderHook(() => usePianoGame());

      act(() => {
        result.current.startGame(3);
      });

      const currentNote = result.current.state.notes[0].name;
      const baseNote = NOTE_TO_BASE[currentNote];
      let isCorrect: boolean;

      act(() => {
        isCorrect = result.current.handleKeyPress(baseNote);
      });

      expect(isCorrect!).toBe(true);
    });

    it('returns false for incorrect note', () => {
      const { result } = renderHook(() => usePianoGame());

      act(() => {
        result.current.startGame(3);
      });

      const currentNote = result.current.state.notes[0].name;
      const baseNote = NOTE_TO_BASE[currentNote];
      // Pick a different note
      const wrongNote = baseNote === 'C' ? 'D' : 'C';
      let isCorrect: boolean;

      act(() => {
        isCorrect = result.current.handleKeyPress(wrongNote);
      });

      expect(isCorrect!).toBe(false);
    });

    it('advances to next note on correct press', () => {
      const { result } = renderHook(() => usePianoGame());

      act(() => {
        result.current.startGame(3);
      });

      const currentNote = result.current.state.notes[0].name;
      const baseNote = NOTE_TO_BASE[currentNote];

      act(() => {
        result.current.handleKeyPress(baseNote);
      });

      expect(result.current.state.currentNoteIndex).toBe(1);
      expect(result.current.state.correctCount).toBe(1);
    });

    it('increments incorrect count on wrong press', () => {
      const { result } = renderHook(() => usePianoGame());

      act(() => {
        result.current.startGame(3);
      });

      const currentNote = result.current.state.notes[0].name;
      const baseNote = NOTE_TO_BASE[currentNote];
      const wrongNote = baseNote === 'C' ? 'D' : 'C';

      act(() => {
        result.current.handleKeyPress(wrongNote);
      });

      expect(result.current.state.currentNoteIndex).toBe(0); // Stays on same note
      expect(result.current.state.incorrectCount).toBe(1);
    });

    it('finishes game when all notes completed', () => {
      const { result } = renderHook(() => usePianoGame());

      act(() => {
        result.current.startGame(3);
      });

      // Complete all 3 notes
      for (let i = 0; i < 3; i++) {
        const currentNote = result.current.state.notes[i].name;
        const baseNote = NOTE_TO_BASE[currentNote];

        act(() => {
          result.current.handleKeyPress(baseNote);
        });
      }

      expect(result.current.state.status).toBe('finished');
    });

    it('does not respond when game is not playing', () => {
      const { result } = renderHook(() => usePianoGame());

      let isCorrect: boolean;

      act(() => {
        isCorrect = result.current.handleKeyPress('C');
      });

      expect(isCorrect!).toBe(false);
    });

    it('sets key feedback on press', () => {
      const { result } = renderHook(() => usePianoGame());

      act(() => {
        result.current.startGame(3);
      });

      const currentNote = result.current.state.notes[0].name;
      const baseNote = NOTE_TO_BASE[currentNote];

      act(() => {
        result.current.handleKeyPress(baseNote);
      });

      expect(result.current.keyFeedback[baseNote]).toBe('correct');
    });

    it('clears key feedback after timeout', () => {
      const { result } = renderHook(() => usePianoGame());

      act(() => {
        result.current.startGame(3);
      });

      const currentNote = result.current.state.notes[0].name;
      const baseNote = NOTE_TO_BASE[currentNote];

      act(() => {
        result.current.handleKeyPress(baseNote);
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.keyFeedback[baseNote]).toBe('none');
    });
  });

  describe('pauseGame', () => {
    it('changes status to paused', () => {
      const { result } = renderHook(() => usePianoGame());

      act(() => {
        result.current.startGame();
      });

      act(() => {
        result.current.pauseGame();
      });

      expect(result.current.state.status).toBe('paused');
    });

    it('does nothing when not playing', () => {
      const { result } = renderHook(() => usePianoGame());

      act(() => {
        result.current.pauseGame();
      });

      expect(result.current.state.status).toBe('idle');
    });
  });

  describe('resumeGame', () => {
    it('changes status back to playing', () => {
      const { result } = renderHook(() => usePianoGame());

      act(() => {
        result.current.startGame();
      });

      act(() => {
        result.current.pauseGame();
      });

      act(() => {
        result.current.resumeGame();
      });

      expect(result.current.state.status).toBe('playing');
    });

    it('does nothing when not paused', () => {
      const { result } = renderHook(() => usePianoGame());

      act(() => {
        result.current.startGame();
      });

      act(() => {
        result.current.resumeGame();
      });

      expect(result.current.state.status).toBe('playing');
    });
  });

  describe('resetGame', () => {
    it('resets to initial state', () => {
      const { result } = renderHook(() => usePianoGame());

      act(() => {
        result.current.startGame(25);
      });

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.state.status).toBe('idle');
      expect(result.current.state.notes).toHaveLength(0);
      expect(result.current.state.currentNoteIndex).toBe(0);
    });
  });

  describe('accuracy calculation', () => {
    it('calculates accuracy correctly on game finish', () => {
      const { result } = renderHook(() => usePianoGame());

      act(() => {
        result.current.startGame(3);
      });

      // Get first note wrong once
      const firstNote = result.current.state.notes[0].name;
      const wrongNote = NOTE_TO_BASE[firstNote] === 'C' ? 'D' : 'C';

      act(() => {
        result.current.handleKeyPress(wrongNote);
      });

      // Now complete all 3 notes
      for (let i = 0; i < 3; i++) {
        const currentNote = result.current.state.notes[i].name;
        const baseNote = NOTE_TO_BASE[currentNote];

        act(() => {
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
