import React, { FC } from 'react';

import { Text } from 'ink';

const LOGO = `
   \\ | /     _         _   _                     
 '-.ooo.-'  | |__  ___| |_| |_ ___ _ __ ___ _ __ 
---ooooo--- | '_ \\/ _ \\ __| __/ _ \\ '__/ _ \\ '__|
 .-'ooo'-.  | |_)|  __/ |_| ||  __/ | |  __/ |   
   / | \\    |_.__/\\___|\\__|\\__\\___|_|  \\___|_|   
 `;

export const BettererLogo: FC = function BettererLogo() {
  return <Text color="yellowBright">{LOGO}</Text>;
};
