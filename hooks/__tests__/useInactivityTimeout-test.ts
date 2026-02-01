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

  it('calls onTimeout after the default timeout period', () => {
    const onTimeout = jest.fn();

    renderHook(() => useInactivityTimeout({ onTimeout }));

    expect(onTimeout).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(DEFAULT_TIMEOUT_MS);
    });

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('calls onTimeout after custom timeout period', () => {
    const onTimeout = jest.fn();
    const customTimeout = 1000;

    renderHook(() =>
      useInactivityTimeout({ onTimeout, timeoutMs: customTimeout }),
    );

    expect(onTimeout).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(customTimeout - 1);
    });

    expect(onTimeout).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('does not call onTimeout when disabled', () => {
    const onTimeout = jest.fn();

    renderHook(() => useInactivityTimeout({ onTimeout, enabled: false }));

    act(() => {
      jest.advanceTimersByTime(DEFAULT_TIMEOUT_MS);
    });

    expect(onTimeout).not.toHaveBeenCalled();
  });

  it('resets the timer when resetTimer is called', () => {
    const onTimeout = jest.fn();
    const timeoutMs = 1000;

    const { result } = renderHook(() =>
      useInactivityTimeout({ onTimeout, timeoutMs }),
    );

    // Advance halfway through the timeout
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onTimeout).not.toHaveBeenCalled();

    // Reset the timer
    act(() => {
      result.current.resetTimer();
    });

    // Advance another 500ms (would have triggered if not reset)
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onTimeout).not.toHaveBeenCalled();

    // Advance the full timeout from reset point
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('clears the timer when clearTimer is called', () => {
    const onTimeout = jest.fn();
    const timeoutMs = 1000;

    const { result } = renderHook(() =>
      useInactivityTimeout({ onTimeout, timeoutMs }),
    );

    // Clear the timer
    act(() => {
      result.current.clearTimer();
    });

    // Advance past the timeout
    act(() => {
      jest.advanceTimersByTime(timeoutMs + 1000);
    });

    expect(onTimeout).not.toHaveBeenCalled();
  });

  it('cleans up timer on unmount', () => {
    const onTimeout = jest.fn();
    const timeoutMs = 1000;

    const { unmount } = renderHook(() =>
      useInactivityTimeout({ onTimeout, timeoutMs }),
    );

    unmount();

    act(() => {
      jest.advanceTimersByTime(timeoutMs);
    });

    expect(onTimeout).not.toHaveBeenCalled();
  });

  it('starts timer when enabled changes from false to true', () => {
    const onTimeout = jest.fn();
    const timeoutMs = 1000;

    const { rerender } = renderHook(
      (props: { enabled: boolean }) =>
        useInactivityTimeout({ onTimeout, timeoutMs, enabled: props.enabled }),
      { initialProps: { enabled: false } },
    );

    act(() => {
      jest.advanceTimersByTime(timeoutMs);
    });

    expect(onTimeout).not.toHaveBeenCalled();

    rerender({ enabled: true });

    act(() => {
      jest.advanceTimersByTime(timeoutMs);
    });

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('clears timer when enabled changes from true to false', () => {
    const onTimeout = jest.fn();
    const timeoutMs = 1000;

    const { rerender } = renderHook(
      (props: { enabled: boolean }) =>
        useInactivityTimeout({ onTimeout, timeoutMs, enabled: props.enabled }),
      { initialProps: { enabled: true } },
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    rerender({ enabled: false });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onTimeout).not.toHaveBeenCalled();
  });
});
