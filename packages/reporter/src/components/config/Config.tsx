import { BettererContext, BettererConfig, BettererOptionsFilters, BettererOptionsIgnores } from '@betterer/betterer';
import React, { FC, useState } from 'react';
import { Box, Text } from 'ink';

import { EditConfig } from './EditConfig';

export type ConfigEditField = 'filters' | 'ignores' | null;
export type ConfigProps = {
  context: BettererContext;
  editField: ConfigEditField;
};

export const Config: FC<ConfigProps> = function Config({ context, editField }) {
  const [filters, setFilters] = useState<string>(serialiseFilters(context.config));
  const [ignores, setIgnores] = useState<string>(serialiseIgnores(context.config));

  function updateFilters(newFilters: string): Error | null {
    setFilters(newFilters);
    try {
      const validated = deserialiseFilters(newFilters);
      context.options({ filters: validated });
      return null;
    } catch (error) {
      return error as Error;
    }
  }

  function updateIgnores(newIgnores: string): null {
    setIgnores(newIgnores);
    const validated = deserialiseIgnores(newIgnores);
    context.options({ ignores: validated });
    return null;
  }

  return (
    <Box flexDirection="column" marginBottom={1}>
      {editField == null && (
        <>
          <Box>
            <Text color="yellowBright">Filters</Text>
            <Text> (press "f" to edit)</Text>
            <Text color="yellowBright">: </Text>
            {filters.length ? <Text>{filters}</Text> : <Text color="gray">No current filter patterns</Text>}
          </Box>
          <Box>
            <Text color="yellowBright">Ignores</Text>
            <Text> (press "i" to edit)</Text>
            <Text color="yellowBright">: </Text>
            {ignores.length ? <Text>{ignores}</Text> : <Text color="gray">No current ignore patterns</Text>}
          </Box>
        </>
      )}
      {editField == 'filters' && (
        <EditConfig name="Filters" value={filters} onChange={updateFilters}>
          Use RegExp patterns e.g. /my test/. Use "," to separate multiple filters.
        </EditConfig>
      )}
      {editField == 'ignores' && (
        <EditConfig name="Ignores" value={ignores} onChange={updateIgnores}>
          Use glob patterns starting from CWD e.g. **/*.ts. Use "," to separate multiple ignores.
        </EditConfig>
      )}
    </Box>
  );
};

function serialiseFilters(config: BettererConfig): string {
  return config.filters.map((filter) => `/${filter.source}/`).join(', ');
}

function serialiseIgnores(config: BettererConfig): string {
  return config.ignores.join(', ');
}

function deserialiseFilters(filters: string): BettererOptionsFilters {
  return filters.split(',').map((filter) => new RegExp(filter.replace(/^\//, '').replace(/\/$/, ''), 'i'));
}

function deserialiseIgnores(ignores: string): BettererOptionsIgnores {
  return ignores.split(',').map((ignore) => ignore.trim());
}
