/**
 * {@link https://www.npmjs.com/package/@betterer/results | `@betterer/results` }
 *
 * Results file helpers used within {@link https://github.com/phenomnomnominal/betterer | **Betterer**}.
 *
 * 🚨 THIS PACKAGE SHOULD ONLY BE USED WITHIN THE BETTERER MONOREPO 🚨
 *
 * @packageDocumentation
 */

export { writeResults__ } from './fs';
export { mergeResults__ } from './merge';
export { parseResults__ } from './parse';
export { printResults__ } from './print';
export { BettererResult, BettererResults } from './types';
