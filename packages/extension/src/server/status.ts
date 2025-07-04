import type { BettererStatus } from '../status';

import { NotificationType } from 'vscode-languageserver/node';

import { EXTENSION_NAME } from '../constants';

export const BettererStatusNotification = new NotificationType<BettererStatus>(`${EXTENSION_NAME}/status`);
