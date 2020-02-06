import { ExtensionContext } from 'vscode';

const NO_BETTERER_STATE_KEY = 'noBettererMessageShown';

type Workspaces = Record<string, boolean>;
type NoBettererState = {
  workspaces: Workspaces;
};

export function getNoBettererState(context: ExtensionContext): Workspaces {
  return getState<NoBettererState>(context, NO_BETTERER_STATE_KEY, { workspaces: {} }).workspaces;
}

export function updateNoBettererState(context: ExtensionContext, value: NoBettererState): void {
  updateState<NoBettererState>(context, NO_BETTERER_STATE_KEY, value);
}

function getState<T>(context: ExtensionContext, key: string, def: T): T {
  return context.globalState.get<T>(key, def);
}

function updateState<T>(context: ExtensionContext, key: string, value: T): void {
  context.globalState.update(key, value);
}
