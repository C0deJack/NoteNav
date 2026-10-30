import { renderHook } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useHaptics } from '../useHaptics';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Heavy: 'heavy' },
  NotificationFeedbackType: { Error: 'error' },
}));

const mockImpact = Haptics.impactAsync as jest.Mock;
const mockNotification = Haptics.notificationAsync as jest.Mock;

describe('useHaptics', () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    Platform.OS = originalOS;
  });

  it('gives a tap for a correct note', async () => {
    const { result } = await renderHook(() =>
      useHaptics({ onCorrect: true, onIncorrect: true }),
    );

    result.current.correct();

    expect(mockImpact).toHaveBeenCalledWith('heavy');
    expect(mockNotification).not.toHaveBeenCalled();
  });

  it('gives an error buzz for an incorrect note', async () => {
    const { result } = await renderHook(() =>
      useHaptics({ onCorrect: true, onIncorrect: true }),
    );

    result.current.incorrect();

    expect(mockNotification).toHaveBeenCalledWith('error');
    expect(mockImpact).not.toHaveBeenCalled();
  });

  it('turning off correct haptics leaves incorrect ones on', async () => {
    const { result } = await renderHook(() =>
      useHaptics({ onCorrect: false, onIncorrect: true }),
    );

    result.current.correct();
    result.current.incorrect();

    expect(mockImpact).not.toHaveBeenCalled();
    expect(mockNotification).toHaveBeenCalledTimes(1);
  });

  it('turning off incorrect haptics leaves correct ones on', async () => {
    const { result } = await renderHook(() =>
      useHaptics({ onCorrect: true, onIncorrect: false }),
    );

    result.current.correct();
    result.current.incorrect();

    expect(mockImpact).toHaveBeenCalledTimes(1);
    expect(mockNotification).not.toHaveBeenCalled();
  });

  it('does nothing on web', async () => {
    Platform.OS = 'web';
    const { result } = await renderHook(() =>
      useHaptics({ onCorrect: true, onIncorrect: true }),
    );

    result.current.correct();
    result.current.incorrect();

    expect(mockImpact).not.toHaveBeenCalled();
    expect(mockNotification).not.toHaveBeenCalled();
  });

  it('ignores haptic failures', async () => {
    mockImpact.mockRejectedValueOnce(new Error('no haptic engine'));
    const { result } = await renderHook(() =>
      useHaptics({ onCorrect: true, onIncorrect: true }),
    );

    expect(() => result.current.correct()).not.toThrow();
    await Promise.resolve();
  });
});
