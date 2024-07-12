import type { BettererContext } from '@betterer/betterer';

import type { ConfigEditField } from '../config/index.js';

import { useEffect, useState, useStdin } from '@betterer/render';

// Stolen mostly from ink's `useInput` hook.
export function useControls(context: BettererContext): ConfigEditField {
  const { stdin } = useStdin();
  const [editing, setEditing] = useState<ConfigEditField>(null);

  useEffect(() => {
    function maybeExit() {
      // Return early when editing so 'q' doesn't quit:
      if (editing != null) {
        return;
      }

      void context.stop();
    }

    function handleData(data: string) {
      const input = String(data);
      const isReturn = input === '\r';
      const isEscape = input === '\u001B';

      if (isReturn || (isEscape && editing)) {
        setEditing(null);
        return;
      }

      if (isEscape) {
        void context.stop();
        return;
      }

      if (input === 'q') {
        return maybeExit();
      }

      if (input === 'f') {
        return setEditing('filters');
      }

      if (input === 'i') {
        return setEditing('ignores');
      }
    }

    stdin?.on('data', handleData);
    return () => {
      stdin?.off('data', handleData);
    };
  }, [editing]);
  return editing;
}
