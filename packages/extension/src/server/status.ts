import type { BettererStatus } from '../status.js';

import { NotificationType } from 'vscode-languageserver/node';

import { EXTENSION_NAME } from '../constants.js';

export const BettererStatusNotification = new NotificationType<BettererStatus>(`${EXTENSION_NAME}/status`);
