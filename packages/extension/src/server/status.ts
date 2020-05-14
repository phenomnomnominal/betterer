import { NotificationType } from 'vscode-languageserver';

import { EXTENSION_NAME } from '../constants';
import { BettererStatus } from '../status';

export const BettererStatusNotification = new NotificationType<BettererStatus, void>(`${EXTENSION_NAME}/status`);
