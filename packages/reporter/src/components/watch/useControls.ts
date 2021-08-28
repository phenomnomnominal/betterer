import { useCallback, useState } from 'react';

import { BettererContext } from '@betterer/betterer';
import { useInput, useStdin } from 'ink';

import { ConfigEditField } from '../config';

export function useControls(context: BettererContext): ConfigEditField {
  const quit = useCallback(async () => {
    await context.stop();
  }, [context]);

  const { isRawModeSupported } = useStdin();

  const [editing, setEditing] = useState<ConfigEditField>(null);

  const canEdit = isRawModeSupported;
  const useEdit = canEdit ? useInput : () => void 0;

  useEdit((input, key) => {
    if (key.return) {
      setEditing(null);
      return;
    }

    if (key.escape) {
      void quit();
      return;
    }

    if (editing != null) {
      return;
    }

    // Don't exit on 'q' if the user is editing filters or ignores:
    if (input === 'q') {
      void quit();
    }

    if (input === 'f') {
      setEditing('filters');
    }
    if (input === 'i') {
      setEditing('ignores');
    }
  });

  return editing;
}
