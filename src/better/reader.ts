import { access } from 'fs';
import { promisify } from 'util';

import { BetterResults } from './types';

export async function read (resultsPath: string): Promise<BetterResults> {
    try {
        await promisify(access)(resultsPath);
    } catch {
        return {};
    }

    try {
        return await import(resultsPath);
    } catch {
        throw new Error();
    }
}
