/**
 * Renderer used within {@link https://github.com/phenomnomnominal/betterer | **Betterer**}.
 *
 * Problems happen when there are multiple versions of `react` available within a codebase,
 * as different instances of the `ink` renderer may find different versions of `react-dom`.
 *
 * This package is an attempt to ensure that `ink` always finds the same verson of
 * `react` and `react-dom`
 *
 * 🚨 THIS PACKAGE SHOULD ONLY BE USED WITHIN THE BETTERER MONOREPO 🚨
 *
 * @packageDocumentation
 */

import R from 'react';

/**
 * @internal This could change at any point! Please don't use!
 *
 * Re-exported from `react`
 */
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

/**
 * @internal This could change at any point! Please don't use!
 *
 * Re-exported TextInputProps from `ink-text-input`
 */
export type TextInputProps = React.ComponentProps<typeof TI>;

/**
 * @internal This could change at any point! Please don't use!
 *
 * Re-exported TextInput component from `ink-text-input`
 */
export const TextInput = (props: TextInputProps) => {
  return <TI {...props} />;
};
