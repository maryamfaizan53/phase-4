/**
 * useTaskPolling Hook
 *
 * Custom hook for polling tasks after chat actions.
 * Polls at specified interval for a maximum number of iterations.
 */

import { useEffect, useRef } from 'react';

export function useTaskPolling(
  shouldPoll,
  onPoll,
  interval = 2000,
  maxIterations = 3
) {
  const intervalRef = useRef(null);
  const iterationCountRef = useRef(0);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Start polling if shouldPoll is true
    if (shouldPoll && onPoll) {
      // Reset iteration count
      iterationCountRef.current = 0;

      // Start interval
      intervalRef.current = setInterval(() => {
        iterationCountRef.current += 1;

        // Call the poll callback
        onPoll();

        // Stop after max iterations
        if (iterationCountRef.current >= maxIterations) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, interval);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [shouldPoll, onPoll, interval, maxIterations]);

  // No return value needed - hook just manages side effects
}
