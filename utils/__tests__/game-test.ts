import {
  FLAT_SYMBOL,
  SHARP_SYMBOL,
  formatNoteAccidentals,
  getBaseNoteName,
  getDifficultyLabel,
} from '../game';

describe('getDifficultyLabel', () => {
  it('returns correct label for Easy difficulty (3)', () => {
    expect(getDifficultyLabel(3)).toBe('Easy');
  });

  it('returns correct label for Medium difficulty (10)', () => {
    expect(getDifficultyLabel(10)).toBe('Medium');
  });

  it('returns correct label for Hard difficulty (25)', () => {
    expect(getDifficultyLabel(25)).toBe('Hard');
  });

  it('returns correct label for Expert difficulty (100)', () => {
    expect(getDifficultyLabel(100)).toBe('Expert');
  });

  it('returns "Unknown" for invalid difficulty values', () => {
    expect(getDifficultyLabel(0 as any)).toBe('Unknown');
    expect(getDifficultyLabel(5 as any)).toBe('Unknown');
    expect(getDifficultyLabel(50 as any)).toBe('Unknown');
  });
});

describe('getBaseNoteName', () => {
  it('returns natural notes unchanged', () => {
    expect(getBaseNoteName('C')).toBe('C');
    expect(getBaseNoteName('D')).toBe('D');
    expect(getBaseNoteName('E')).toBe('E');
    expect(getBaseNoteName('F')).toBe('F');
    expect(getBaseNoteName('G')).toBe('G');
    expect(getBaseNoteName('A')).toBe('A');
    expect(getBaseNoteName('B')).toBe('B');
  });

  it('returns sharp notes unchanged', () => {
    expect(getBaseNoteName('C#')).toBe('C#');
    expect(getBaseNoteName('D#')).toBe('D#');
    expect(getBaseNoteName('F#')).toBe('F#');
    expect(getBaseNoteName('G#')).toBe('G#');
    expect(getBaseNoteName('A#')).toBe('A#');
  });

  it('strips octave suffix from second octave natural notes', () => {
    expect(getBaseNoteName('C2')).toBe('C');
    expect(getBaseNoteName('D2')).toBe('D');
    expect(getBaseNoteName('E2')).toBe('E');
    expect(getBaseNoteName('F2')).toBe('F');
  });

  it('strips octave suffix from second octave sharp notes', () => {
    expect(getBaseNoteName('C#2')).toBe('C#');
    expect(getBaseNoteName('D#2')).toBe('D#');
  });

  it('handles empty string', () => {
    expect(getBaseNoteName('')).toBe('');
  });
});

describe('SHARP_SYMBOL and FLAT_SYMBOL constants', () => {
  it('SHARP_SYMBOL is the correct unicode character', () => {
    expect(SHARP_SYMBOL).toBe('\u266F');
    expect(SHARP_SYMBOL).toBe('♯');
  });

  it('FLAT_SYMBOL is the correct unicode character', () => {
    expect(FLAT_SYMBOL).toBe('\u266D');
    expect(FLAT_SYMBOL).toBe('♭');
  });
});

describe('formatNoteAccidentals', () => {
  it('converts # to sharp symbol', () => {
    expect(formatNoteAccidentals('C#')).toBe('C♯');
    expect(formatNoteAccidentals('D#')).toBe('D♯');
    expect(formatNoteAccidentals('F#')).toBe('F♯');
    expect(formatNoteAccidentals('G#')).toBe('G♯');
    expect(formatNoteAccidentals('A#')).toBe('A♯');
  });

  it('converts b to flat symbol', () => {
    expect(formatNoteAccidentals('Db')).toBe('D♭');
    expect(formatNoteAccidentals('Eb')).toBe('E♭');
    expect(formatNoteAccidentals('Gb')).toBe('G♭');
    expect(formatNoteAccidentals('Ab')).toBe('A♭');
    expect(formatNoteAccidentals('Bb')).toBe('B♭');
  });

  it('leaves natural notes unchanged', () => {
    expect(formatNoteAccidentals('C')).toBe('C');
    expect(formatNoteAccidentals('D')).toBe('D');
    expect(formatNoteAccidentals('E')).toBe('E');
    expect(formatNoteAccidentals('F')).toBe('F');
    expect(formatNoteAccidentals('G')).toBe('G');
    expect(formatNoteAccidentals('A')).toBe('A');
    expect(formatNoteAccidentals('B')).toBe('B');
  });

  it('handles notes that already have the symbol', () => {
    expect(formatNoteAccidentals('C♯')).toBe('C♯');
    expect(formatNoteAccidentals('D♭')).toBe('D♭');
  });

  it('handles empty string', () => {
    expect(formatNoteAccidentals('')).toBe('');
  });

  it('only replaces first occurrence of # or b', () => {
    // Edge case: multiple # or b characters
    expect(formatNoteAccidentals('##')).toBe('♯#');
    expect(formatNoteAccidentals('bb')).toBe('♭b');
  });
});
