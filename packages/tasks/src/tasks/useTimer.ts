import { useCallback, useEffect, useRef, useState } from '@betterer/render';
import { getPreciseTimeΔ } from '@betterer/time';

const DEFAULT_TASK_TIME_INTERVAL = 100;

export type BettererTimerClear = () => void;

export function useTimer(enable = true): [number, BettererTimerClear] {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState(getPreciseTimeΔ());

  const updateTime = useCallback(() => {
    setTime(getPreciseTimeΔ());
  }, []);

  const clearTime = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  }, []);

  useEffect(() => {
    if (!enable) {
      return;
    }
    timer.current = setInterval(updateTime, DEFAULT_TASK_TIME_INTERVAL);
    updateTime();
    return clearTime;
  }, [updateTime, clearTime]);

  return [time, clearTime];
}
