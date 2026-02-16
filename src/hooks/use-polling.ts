'use client';

import { useEffect, useRef } from 'react';

/**
 * 조건이 true인 동안 intervalMs 간격으로 callback을 실행하는 폴링 훅
 */
export function usePolling(callback: () => void, intervalMs: number, enabled: boolean) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const id = setInterval(() => savedCallback.current(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, enabled]);
}
