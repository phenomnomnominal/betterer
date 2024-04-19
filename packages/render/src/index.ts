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

/**
 * @internal This could change at any point! Please don't use!
 *
 * Re-exported from `ink`
 */
export type { Instance, RenderOptions, TextProps } from 'ink';

/**
 * @internal This could change at any point! Please don't use!
 *
 * Re-exported from `react`
 */
export type { FC, PropsWithChildren } from 'react';

/**
 * @internal This could change at any point! Please don't use!
 *
 * Re-exported from `ink`
 */
export { render, Box, Text, useApp, useInput, useStdin } from 'ink';

/**
 * @internal This could change at any point! Please don't use!
 *
 * Re-exported from `react`
 */
export { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState, memo } from 'react';

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
export const TextInput: React.FC<TextInputProps> = TI;

/**
 * @internal This could change at any point! Please don't use!
 */
export type Process = typeof import('process');
/**
 * @internal This could change at any point! Please don't use!
 */
export type StdErr = Process['stderr'];
/**
 * @internal This could change at any point! Please don't use!
 */
export type StdIn = Process['stdin'];
/**
 * @internal This could change at any point! Please don't use!
 */
export type StdOut = Process['stdout'];

/**
 * @internal This could change at any point! Please don't use!
 *
 * Wrapped to get process.stderr so it can be stubbed for testing.
 */
export function getStdErr(): StdErr {
  return process.stderr;
}

/**
 * @internal This could change at any point! Please don't use!
 *
 * Wrapped to get process.stdin so it can be stubbed for testing.
 */
export function getStdIn(): StdIn {
  return process.stdin;
}

/**
 * @internal This could change at any point! Please don't use!
 *
 * Wrapped to get process.stdout so it can be stubbed for testing.
 */
export function getStdOut(): StdOut {
  return process.stdout;
}

import type { RenderOptions } from 'ink';

/**
 * @internal This could change at any point! Please don't use!
 */
export function getRenderOptions(env = '', options: RenderOptions = {}): RenderOptions {
  return {
    debug: env === 'test',
    stderr: getStdErr(),
    stdin: getStdIn(),
    stdout: getStdOut(),
    ...options
  };
}
