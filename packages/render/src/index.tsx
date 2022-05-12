/**
 * Renderer used within {@link https://github.com/phenomnomnominal/betterer | **Betterer**}.
 *
 * 🚨 THIS PACKAGE SHOULD ONLY BE USED WITHIN THE BETTERER MONOREPO 🚨
 *
 * @packageDocumentation
 */

import R from 'react';

export const React = R;
export {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  memo
} from 'react';

export { render, Box, Instance, RenderOptions, Text, TextProps, useApp, useInput, useStdin } from 'ink';

import TI from 'ink-text-input';
export type TextInputProps = React.ComponentProps<typeof TI>;
export const TextInput = (props: TextInputProps) => {
  return <TI {...props} />;
};
