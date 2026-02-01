import { useCallback, useEffect, useRef } from 'react';

const DEFAULT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

interface UseInactivityTimeoutOptions {
  timeoutMs?: number;
  onTimeout: () => void;
  enabled?: boolean;
}

export function useInactivityTimeout({
  timeoutMs = DEFAULT_TIMEOUT_MS,
  onTimeout,
  enabled = true,
}: UseInactivityTimeoutOptions) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onTimeoutRef = useRef(onTimeout);

  // Keep onTimeout ref updated to avoid stale closures
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    clearTimer();
    if (enabled) {
      timeoutRef.current = setTimeout(() => {
        onTimeoutRef.current();
      }, timeoutMs);
    }
  }, [clearTimer, enabled, timeoutMs]);

  // Set up initial timer and cleanup
  useEffect(() => {
    if (enabled) {
      resetTimer();
    }
    return clearTimer;
  }, [enabled, resetTimer, clearTimer]);

  return {
    resetTimer,
    clearTimer,
  };
}

export { DEFAULT_TIMEOUT_MS };
