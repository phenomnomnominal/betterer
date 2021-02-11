import React, { FC, useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

export type EditConfigProps = {
  name: string;
  onChange: (newValue: string) => Error | null;
  value: string;
};

export const EditConfig: FC<EditConfigProps> = function EditConfig({ children, name, onChange, value }) {
  const [error, setError] = useState<Error | null>(null);
  function handleChange(newValue: string) {
    const error = onChange(newValue);
    setError(error);
  }

  return (
    <Box flexDirection="column">
      <Text color="grey">{children} Press "enter" to confirm.</Text>
      <Box>
        <Text color={error ? 'redBright' : 'yellowBright'}>{name}: </Text>
        <TextInput value={value} onChange={handleChange}></TextInput>
      </Box>
      <Box>{error && <Text>{error.message}</Text>}</Box>
    </Box>
  );
};
