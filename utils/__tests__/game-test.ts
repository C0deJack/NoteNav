import {
  FLAT_SYMBOL,
  formatNoteAccidentals,
  getClefLabel,
  getDifficultyLabel,
  SHARP_SYMBOL,
} from '../game';

describe('getDifficultyLabel', () => {
  it('returns correct label for easy difficulty', () => {
    expect(getDifficultyLabel('easy')).toBe('Easy');
  });

  it('returns correct label for medium difficulty', () => {
    expect(getDifficultyLabel('medium')).toBe('Medium');
  });

  it('returns correct label for hard difficulty', () => {
    expect(getDifficultyLabel('hard')).toBe('Hard');
  });

  it('returns correct label for expert difficulty', () => {
    expect(getDifficultyLabel('expert')).toBe('Expert');
  });

  it('returns "Unknown" for invalid difficulty values', () => {
    expect(getDifficultyLabel('invalid' as any)).toBe('Unknown');
    expect(getDifficultyLabel('' as any)).toBe('Unknown');
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

describe('getClefLabel', () => {
  it('returns labels for each clef', () => {
    expect(getClefLabel('treble')).toBe('Treble');
    expect(getClefLabel('bass')).toBe('Bass');
  });
});
