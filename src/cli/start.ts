import * as path from 'path';

import { better } from '../better';

export async function start () {
    const cwd = process.cwd();
    const configPath = path.resolve(cwd, process.env['better:tests']!);
    const resultsPath = path.resolve(cwd, process.env['better:results']!);
    return better({ configPath, resultsPath });
}
