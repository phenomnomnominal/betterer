import path from 'node:path';
import { promises as fs } from 'node:fs';

export interface FixturePersist {
  increment(): Promise<number>;
  decrement(): Promise<number>;
}

export function persist(fixtureDir: string, name: string, start: number): FixturePersist {
  const persistPath = path.join(fixtureDir, `persist.${name}.json`);

  async function read(): Promise<number> {
    try {
      return JSON.parse(await fs.readFile(persistPath, 'utf-8')) as number;
    } catch {
      return start;
    }
  }

  async function write(result: number): Promise<void> {
    await fs.writeFile(persistPath, JSON.stringify(result), 'utf-8');
  }

  return {
    async increment(): Promise<number> {
      const val = await read();
      const result = val + 1;
      await write(result);
      return result;
    },
    async decrement(): Promise<number> {
      const val = await read();
      const result = val - 1;
      await write(result);
      return result;
    }
  };
}
