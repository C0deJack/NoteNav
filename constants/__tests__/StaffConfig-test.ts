import { getStaffPosition, STAFF_LABELS } from '../StaffConfig';

describe('getStaffPosition', () => {
  it('matches the treble staff layout', () => {
    expect(getStaffPosition('C4', 'treble')).toBe(-6); // Ledger line below
    expect(getStaffPosition('E4', 'treble')).toBe(-4); // Bottom line
    expect(getStaffPosition('B4', 'treble')).toBe(0); // Middle line
    expect(getStaffPosition('F5', 'treble')).toBe(4); // Top line
  });

  it('matches the bass staff layout', () => {
    expect(getStaffPosition('G2', 'bass')).toBe(-4); // Bottom line
    expect(getStaffPosition('D3', 'bass')).toBe(0); // Middle line
    expect(getStaffPosition('F3', 'bass')).toBe(2); // F clef line
    expect(getStaffPosition('A3', 'bass')).toBe(4); // Top line
    expect(getStaffPosition('C4', 'bass')).toBe(6); // Ledger line above
  });

  it('puts sharps on their natural', () => {
    expect(getStaffPosition('C#4', 'treble')).toBe(
      getStaffPosition('C4', 'treble'),
    );
    expect(getStaffPosition('F#3', 'bass')).toBe(
      getStaffPosition('F3', 'bass'),
    );
  });
});

describe('STAFF_LABELS', () => {
  it.each(['treble', 'bass'] as const)(
    'labels %s positions with the letter of the note there',
    (clef) => {
      const notes =
        clef === 'treble'
          ? ([
              'C4',
              'D4',
              'E4',
              'F4',
              'G4',
              'A4',
              'B4',
              'C5',
              'D5',
              'E5',
              'F5',
            ] as const)
          : ([
              'G2',
              'A2',
              'B2',
              'C3',
              'D3',
              'E3',
              'F3',
              'G3',
              'A3',
              'B3',
              'C4',
            ] as const);
      for (const note of notes) {
        expect(STAFF_LABELS[clef][getStaffPosition(note, clef)]).toBe(
          note.charAt(0),
        );
      }
    },
  );
});
