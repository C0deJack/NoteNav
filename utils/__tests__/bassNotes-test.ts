import type { AudioPlayer } from 'expo-audio';

import { createBassNotePlayback, getPlaybackRate } from '../bassNotes';

function makePlayer() {
  return {
    pause: jest.fn(),
    setPlaybackRate: jest.fn(),
    volume: 1.0,
    duration: 0.5,
  } as unknown as AudioPlayer & {
    pause: jest.Mock;
    setPlaybackRate: jest.Mock;
  };
}

describe('getPlaybackRate', () => {
  it('slows octave 3 to half speed and octave 2 to quarter', () => {
    expect(getPlaybackRate('C3')).toBe(0.5);
    expect(getPlaybackRate('B3')).toBe(0.5);
    expect(getPlaybackRate('G2')).toBe(0.25);
  });

  it('leaves treble notes at normal speed', () => {
    expect(getPlaybackRate('C4')).toBe(1);
    expect(getPlaybackRate('F5')).toBe(1);
  });
});

describe('createBassNotePlayback', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('setUp', () => {
    it('pitch-shifts bass notes', () => {
      const player = makePlayer();
      createBassNotePlayback().setUp(player, 'G2');

      expect(player.setPlaybackRate).toHaveBeenCalledWith(0.25);
      expect(player.shouldCorrectPitch).toBe(false);
    });

    it('leaves treble notes alone', () => {
      const player = makePlayer();
      createBassNotePlayback().setUp(player, 'C4');

      expect(player.setPlaybackRate).not.toHaveBeenCalled();
      expect(player.shouldCorrectPitch).toBeUndefined();
    });
  });

  describe('scheduleStop', () => {
    it('stops a bass note after the sample length, fading it out', () => {
      const player = makePlayer();
      createBassNotePlayback().scheduleStop(player, 'C3');

      jest.advanceTimersByTime(399);
      expect(player.volume).toBe(1);
      expect(player.pause).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(player.volume).toBeLessThan(1);

      jest.advanceTimersByTime(100);
      expect(player.volume).toBe(0);
      expect(player.pause).toHaveBeenCalledTimes(1);
    });

    it('lets treble notes play out', () => {
      const player = makePlayer();
      createBassNotePlayback().scheduleStop(player, 'C4');

      jest.advanceTimersByTime(5000);
      expect(player.pause).not.toHaveBeenCalled();
    });

    it('restarts the cap when a bass note is replayed', () => {
      const player = makePlayer();
      const bass = createBassNotePlayback();
      bass.scheduleStop(player, 'C3');

      jest.advanceTimersByTime(450);
      bass.cancelStop('C3');
      player.volume = 1.0;
      bass.scheduleStop(player, 'C3');

      jest.advanceTimersByTime(450);
      expect(player.pause).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(player.pause).toHaveBeenCalledTimes(1);
    });

    it('does nothing after dispose', () => {
      const player = makePlayer();
      const bass = createBassNotePlayback();
      bass.scheduleStop(player, 'C3');
      bass.dispose();

      jest.advanceTimersByTime(5000);
      expect(player.pause).not.toHaveBeenCalled();
    });
  });
});
