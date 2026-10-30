import { ALL_NOTES } from '@/types/piano';
import { DIFFICULTY_NOTE_POOLS, getKeyboardKeys, NOTES } from '../PianoConfig';

const index = (note: (typeof ALL_NOTES)[number]) => ALL_NOTES.indexOf(note);

describe('DIFFICULTY_NOTE_POOLS', () => {
  it('keeps treble notes between C4 and F5', () => {
    for (const pool of Object.values(DIFFICULTY_NOTE_POOLS.treble)) {
      for (const note of pool) {
        expect(index(note)).toBeGreaterThanOrEqual(index('C4'));
        expect(index(note)).toBeLessThanOrEqual(index('F5'));
      }
    }
  });

  it('keeps bass notes between G2 and C4', () => {
    for (const pool of Object.values(DIFFICULTY_NOTE_POOLS.bass)) {
      for (const note of pool) {
        expect(index(note)).toBeGreaterThanOrEqual(index('G2'));
        expect(index(note)).toBeLessThanOrEqual(index('C4'));
      }
    }
  });

  it('only uses sharps on hard and expert', () => {
    for (const clef of ['treble', 'bass'] as const) {
      const pools = DIFFICULTY_NOTE_POOLS[clef];
      expect(pools.easy.some((n) => n.includes('#'))).toBe(false);
      expect(pools.medium.some((n) => n.includes('#'))).toBe(false);
      expect(pools.hard.some((n) => n.includes('#'))).toBe(true);
      expect(pools.expert.some((n) => n.includes('#'))).toBe(true);
    }
  });

  it('keeps the existing treble pools', () => {
    expect(DIFFICULTY_NOTE_POOLS.treble.easy).toEqual([
      'C4',
      'D4',
      'E4',
      'F4',
      'G4',
    ]);
    expect(DIFFICULTY_NOTE_POOLS.treble.expert).toHaveLength(18);
  });

  it('uses the mirrored bass ranges', () => {
    expect(DIFFICULTY_NOTE_POOLS.bass.easy).toEqual([
      'F3',
      'G3',
      'A3',
      'B3',
      'C4',
    ]);
    expect(DIFFICULTY_NOTE_POOLS.bass.medium[0]).toBe('G2');
  });
});

describe('NOTES', () => {
  it('has a sample for every note', () => {
    for (const note of ALL_NOTES) {
      expect(NOTES[note].soundFile).toMatch(/\.wav$/);
      expect(NOTES[note].isBlack).toBe(note.includes('#'));
    }
  });
});

describe('getKeyboardKeys', () => {
  const whites = (keys: string[]) => keys.filter((k) => !k.includes('#'));

  it('shows C4 to B4 for treble', () => {
    const keys = getKeyboardKeys('treble', false);
    expect(keys[0]).toBe('C4');
    expect(keys.at(-1)).toBe('B4');
    expect(whites(keys)).toHaveLength(7);
  });

  it('extends treble up to F5', () => {
    const keys = getKeyboardKeys('treble', true);
    expect(keys[0]).toBe('C4');
    expect(keys.at(-1)).toBe('F5');
    expect(whites(keys)).toHaveLength(11);
  });

  it('shows middle C and below for bass', () => {
    const keys = getKeyboardKeys('bass', false);
    expect(keys[0]).toBe('C3');
    expect(keys.at(-1)).toBe('C4');
    expect(whites(keys)).toHaveLength(8);
  });

  it('extends bass down to G2', () => {
    const keys = getKeyboardKeys('bass', true);
    expect(keys[0]).toBe('G2');
    expect(keys.at(-1)).toBe('C4');
    expect(whites(keys)).toHaveLength(11);
  });

  it('includes a key for every note in each pool', () => {
    for (const clef of ['treble', 'bass'] as const) {
      const keys = getKeyboardKeys(clef, true);
      for (const pool of Object.values(DIFFICULTY_NOTE_POOLS[clef])) {
        for (const note of pool) {
          expect(keys).toContain(note);
        }
      }
    }
  });
});
