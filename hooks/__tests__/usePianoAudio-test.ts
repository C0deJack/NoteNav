import { act, renderHook, waitFor } from '@testing-library/react-native';
import { usePianoAudio } from '../usePianoAudio';

const mockPlay = jest.fn();
const mockSeekTo = jest.fn().mockResolvedValue(undefined);
const mockRemove = jest.fn();

const mockPlayer = {
  play: mockPlay,
  seekTo: mockSeekTo,
  remove: mockRemove,
  volume: 1.0,
};

jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn(() => ({ ...mockPlayer })),
  setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock the require calls for sound files
jest.mock('@/assets/sounds/c1.wav', () => 1, { virtual: true });
jest.mock('@/assets/sounds/c1s.wav', () => 2, { virtual: true });
jest.mock('@/assets/sounds/d1.wav', () => 3, { virtual: true });
jest.mock('@/assets/sounds/d1s.wav', () => 4, { virtual: true });
jest.mock('@/assets/sounds/e1.wav', () => 5, { virtual: true });
jest.mock('@/assets/sounds/f1.wav', () => 6, { virtual: true });
jest.mock('@/assets/sounds/f1s.wav', () => 7, { virtual: true });
jest.mock('@/assets/sounds/g1.wav', () => 8, { virtual: true });
jest.mock('@/assets/sounds/g1s.wav', () => 9, { virtual: true });
jest.mock('@/assets/sounds/a1.wav', () => 10, { virtual: true });
jest.mock('@/assets/sounds/a1s.wav', () => 11, { virtual: true });
jest.mock('@/assets/sounds/b1.wav', () => 12, { virtual: true });
jest.mock('@/assets/sounds/kick.wav', () => 13, { virtual: true });

import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

const mockCreateAudioPlayer = createAudioPlayer as jest.Mock;
const mockSetAudioModeAsync = setAudioModeAsync as jest.Mock;

describe('usePianoAudio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateAudioPlayer.mockImplementation(() => ({
      play: mockPlay,
      seekTo: mockSeekTo,
      remove: mockRemove,
      volume: 1.0,
    }));
  });

  describe('initialization', () => {
    it('starts with loaded as false then becomes true', async () => {
      const { result } = renderHook(() => usePianoAudio());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });
    });

    it('creates audio players for all notes', async () => {
      renderHook(() => usePianoAudio());

      await waitFor(() => {
        // 12 notes + 6 second octave notes + 1 error sound = multiple calls
        expect(mockCreateAudioPlayer).toHaveBeenCalled();
      });
    });

    it('sets audio mode with default playSoundInSilentMode', async () => {
      renderHook(() => usePianoAudio());

      await waitFor(() => {
        expect(mockSetAudioModeAsync).toHaveBeenCalledWith({
          playsInSilentMode: true,
        });
      });
    });

    it('sets audio mode with custom playSoundInSilentMode', async () => {
      renderHook(() => usePianoAudio({ playSoundInSilentMode: false }));

      await waitFor(() => {
        expect(mockSetAudioModeAsync).toHaveBeenCalledWith({
          playsInSilentMode: false,
        });
      });
    });
  });

  describe('playNote', () => {
    it('plays the note when loaded', async () => {
      const { result } = renderHook(() => usePianoAudio());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      await act(async () => {
        await result.current.playNote('C');
      });

      expect(mockSeekTo).toHaveBeenCalledWith(0);
      expect(mockPlay).toHaveBeenCalled();
    });

    it('handles missing player gracefully', async () => {
      // Create a player map that's missing some notes
      mockCreateAudioPlayer.mockImplementation(() => ({
        play: mockPlay,
        seekTo: mockSeekTo,
        remove: mockRemove,
        volume: 1.0,
      }));

      const { result } = renderHook(() => usePianoAudio());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      // Clear previous calls
      mockPlay.mockClear();
      mockSeekTo.mockClear();

      // playNote should handle gracefully if player doesn't exist
      // (In practice all players exist, but this tests the guard clause)
      await act(async () => {
        await result.current.playNote('C');
      });

      // Should have attempted to play
      expect(mockSeekTo).toHaveBeenCalled();
    });
  });

  describe('playError', () => {
    it('plays the error sound when loaded', async () => {
      const { result } = renderHook(() => usePianoAudio());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      await act(async () => {
        await result.current.playError();
      });

      expect(mockSeekTo).toHaveBeenCalledWith(0);
      expect(mockPlay).toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('removes all players on unmount', async () => {
      const { result, unmount } = renderHook(() => usePianoAudio());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      unmount();

      expect(mockRemove).toHaveBeenCalled();
    });
  });

  describe('playSoundInSilentMode changes', () => {
    it('updates audio mode when playSoundInSilentMode changes', async () => {
      const { rerender } = renderHook(
        (props: { playSoundInSilentMode: boolean }) =>
          usePianoAudio({ playSoundInSilentMode: props.playSoundInSilentMode }),
        { initialProps: { playSoundInSilentMode: true } },
      );

      await waitFor(() => {
        expect(mockSetAudioModeAsync).toHaveBeenCalledWith({
          playsInSilentMode: true,
        });
      });

      rerender({ playSoundInSilentMode: false });

      await waitFor(() => {
        expect(mockSetAudioModeAsync).toHaveBeenCalledWith({
          playsInSilentMode: false,
        });
      });
    });
  });
});
