import { act, renderHook } from '@testing-library/react-native';
import {
  DEFAULT_TIMEOUT_MS,
  useInactivityTimeout,
} from '../useInactivityTimeout';

describe('useInactivityTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls onTimeout after the default timeout period', async () => {
    const onTimeout = jest.fn();

    await renderHook(() => useInactivityTimeout({ onTimeout }));

    expect(onTimeout).not.toHaveBeenCalled();

    await act(() => {
      jest.advanceTimersByTime(DEFAULT_TIMEOUT_MS);
    });

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('calls onTimeout after custom timeout period', async () => {
    const onTimeout = jest.fn();
    const customTimeout = 1000;

    await renderHook(() =>
      useInactivityTimeout({ onTimeout, timeoutMs: customTimeout }),
    );

    expect(onTimeout).not.toHaveBeenCalled();

    await act(() => {
      jest.advanceTimersByTime(customTimeout - 1);
    });

    expect(onTimeout).not.toHaveBeenCalled();

    await act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('does not call onTimeout when disabled', async () => {
    const onTimeout = jest.fn();

    await renderHook(() => useInactivityTimeout({ onTimeout, enabled: false }));

    await act(() => {
      jest.advanceTimersByTime(DEFAULT_TIMEOUT_MS);
    });

    expect(onTimeout).not.toHaveBeenCalled();
  });

  it('resets the timer when resetTimer is called', async () => {
    const onTimeout = jest.fn();
    const timeoutMs = 1000;

    const { result } = await renderHook(() =>
      useInactivityTimeout({ onTimeout, timeoutMs }),
    );

    // Advance halfway through the timeout
    await act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onTimeout).not.toHaveBeenCalled();

    // Reset the timer
    await act(() => {
      result.current.resetTimer();
    });

    // Advance another 500ms (would have triggered if not reset)
    await act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onTimeout).not.toHaveBeenCalled();

    // Advance the full timeout from reset point
    await act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('clears the timer when clearTimer is called', async () => {
    const onTimeout = jest.fn();
    const timeoutMs = 1000;

    const { result } = await renderHook(() =>
      useInactivityTimeout({ onTimeout, timeoutMs }),
    );

    // Clear the timer
    await act(() => {
      result.current.clearTimer();
    });

    // Advance past the timeout
    await act(() => {
      jest.advanceTimersByTime(timeoutMs + 1000);
    });

    expect(onTimeout).not.toHaveBeenCalled();
  });

  it('cleans up timer on unmount', async () => {
    const onTimeout = jest.fn();
    const timeoutMs = 1000;

    const { unmount } = await renderHook(() =>
      useInactivityTimeout({ onTimeout, timeoutMs }),
    );

    await unmount();

    await act(() => {
      jest.advanceTimersByTime(timeoutMs);
    });

    expect(onTimeout).not.toHaveBeenCalled();
  });

  it('starts timer when enabled changes from false to true', async () => {
    const onTimeout = jest.fn();
    const timeoutMs = 1000;

    const { rerender } = await renderHook(
      (props: { enabled: boolean }) =>
        useInactivityTimeout({ onTimeout, timeoutMs, enabled: props.enabled }),
      { initialProps: { enabled: false } },
    );

    await act(() => {
      jest.advanceTimersByTime(timeoutMs);
    });

    expect(onTimeout).not.toHaveBeenCalled();

    await rerender({ enabled: true });

    await act(() => {
      jest.advanceTimersByTime(timeoutMs);
    });

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('clears timer when enabled changes from true to false', async () => {
    const onTimeout = jest.fn();
    const timeoutMs = 1000;

    const { rerender } = await renderHook(
      (props: { enabled: boolean }) =>
        useInactivityTimeout({ onTimeout, timeoutMs, enabled: props.enabled }),
      { initialProps: { enabled: true } },
    );

    await act(() => {
      jest.advanceTimersByTime(500);
    });

    await rerender({ enabled: false });

    await act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onTimeout).not.toHaveBeenCalled();
  });
});
