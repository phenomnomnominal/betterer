import { useState } from 'react';

import { BettererTaskLog, BettererTaskLogs } from './types';

export function useTaskLogs(): [BettererTaskLogs, (log: BettererTaskLog) => void] {
  const [logs, setLogs] = useState<BettererTaskLogs>([]);

  return [
    logs,
    function (log: BettererTaskLog) {
      setLogs([...logs, log]);
    }
  ];
}
