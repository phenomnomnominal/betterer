import { NotificationType } from 'vscode-languageserver/node';

import { EXTENSION_NAME } from '../constants';
import { BettererStatus } from '../status';

export const BettererStatusNotification = new NotificationType<BettererStatus>(`${EXTENSION_NAME}/status`);
