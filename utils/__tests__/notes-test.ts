import { getOctave, getPitchClass, getStaffNoteName } from '../notes';

describe('getPitchClass', () => {
  it('strips the octave from natural notes', () => {
    expect(getPitchClass('C4')).toBe('C');
    expect(getPitchClass('B4')).toBe('B');
    expect(getPitchClass('F5')).toBe('F');
  });

  it('strips the octave from sharp notes', () => {
    expect(getPitchClass('C#4')).toBe('C#');
    expect(getPitchClass('D#5')).toBe('D#');
  });
});

describe('getOctave', () => {
  it('returns the octave number', () => {
    expect(getOctave('C4')).toBe(4);
    expect(getOctave('A#4')).toBe(4);
    expect(getOctave('C5')).toBe(5);
    expect(getOctave('D#5')).toBe(5);
  });
});

describe('getStaffNoteName', () => {
  it('uses the note itself for naturals and sharps', () => {
    expect(getStaffNoteName('E', 'E4')).toBe('E4');
    expect(getStaffNoteName('C#', 'C#5')).toBe('C#5');
  });

  it('moves flats to their own letter in the same octave', () => {
    expect(getStaffNoteName('D♭', 'C#4')).toBe('D4');
    expect(getStaffNoteName('E♭', 'D#5')).toBe('E5');
  });
});
