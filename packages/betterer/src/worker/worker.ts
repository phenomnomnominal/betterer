import type { TransferListItem } from 'node:worker_threads';
import type { TransferHandler } from 'comlink';

import type { BettererWorkerAPI } from './types.js';

import { BettererError, isBettererError } from '@betterer/errors';
import assert from 'node:assert';
import path from 'node:path';
import { Worker, parentPort } from 'node:worker_threads';
import callsite from 'callsite';
import { expose, releaseProxy, transferHandlers, wrap } from 'comlink';

export function importWorker<T>(requirePath: string): BettererWorkerAPI<T> {
  const [, call] = callsite();
  const sourcePath = call.getFileName();
  const idPath = path.resolve(path.dirname(sourcePath), requirePath);
  const worker = new Worker(idPath);
  const api = wrap(nodeEndpoint(worker));

  return {
    api,
    async destroy() {
      api[releaseProxy]();
      await worker.terminate();
    }
  } as BettererWorkerAPI<T>;
}

export function exposeWorker(api: unknown): void {
  assert(parentPort);
  expose(api, nodeEndpoint(parentPort));
}

export interface EventSource {
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
}

export interface Endpoint extends EventSource {
  start?: () => void;
  postMessage(message: unknown, transfer?: Array<Transferable>): void;
}

export interface NodeEndpoint {
  start?: () => void;
  postMessage(message: unknown, transfer?: Array<Transferable> | ReadonlyArray<TransferListItem>): void;
  on(type: string, listener: EventListenerOrEventListenerObject): void;
  off(type: string, listener: EventListenerOrEventListenerObject): void;
}

export default function nodeEndpoint(nep: NodeEndpoint): Endpoint {
  const listeners = new WeakMap<EventListenerOrEventListenerObject, EventListenerOrEventListenerObject>();
  return {
    postMessage: nep.postMessage.bind(nep),
    addEventListener: (_, eh) => {
      const l = (data: unknown) => {
        if ('handleEvent' in eh) {
          eh.handleEvent({ data } as MessageEvent);
        } else {
          eh({ data } as MessageEvent);
        }
      };
      nep.on('message', l);
      listeners.set(eh, l);
    },
    removeEventListener: (_, eh) => {
      const l = listeners.get(eh);
      if (!l) {
        return;
      }
      nep.off('message', l);
      listeners.delete(eh);
    },
    start: nep.start && nep.start.bind(nep)
  };
}

interface ThrownValue {
  value: unknown;
}

type ThrownErrorSerialized = {
  isError: true;
  value: {
    name: string;
    message: string;
    stack?: string;
  };
};

type ThrownBettererErrorSerialized = {
  isError: true;
  value: {
    isBettererError: true;
    name: string;
    message: string;
    stack?: string;
    details: Array<string | ThrownErrorSerialized | ThrownBettererErrorSerialized>;
  };
};

type ThrownValueSerialized =
  | ThrownErrorSerialized
  | ThrownBettererErrorSerialized
  | {
      isError: false;
      value: unknown;
    };

function isErrorSerialised(error: unknown): error is ThrownErrorSerialized {
  return (error as ThrownErrorSerialized)?.isError;
}

function isBettererErrorSerialised(error: unknown): error is ThrownBettererErrorSerialized {
  return (error as ThrownBettererErrorSerialized)?.value?.isBettererError;
}

const throwHandler = transferHandlers.get('throw') as TransferHandler<ThrownValue, ThrownValueSerialized>;
assert(throwHandler);

function serializeBettererError(error: BettererError): ThrownBettererErrorSerialized {
  return {
    isError: true,
    value: {
      isBettererError: true,
      name: error.name,
      message: error.message,
      stack: error.stack,
      details: error.details.map((detail) => {
        if (isBettererError(detail)) {
          return serializeBettererError(detail);
        } else if (detail instanceof Error) {
          assert(throwHandler);
          const [serialisedError] = throwHandler.serialize({ value: detail });
          return serialisedError as ThrownErrorSerialized;
        } else {
          return detail;
        }
      })
    }
  };
}

function deserializeBettererError(serialised: ThrownBettererErrorSerialized): BettererError {
  const { value } = serialised;
  const error = new BettererError(
    value.message,
    ...value.details.map((detail) => {
      if (isBettererErrorSerialised(detail)) {
        return deserializeBettererError(detail);
      } else if (isErrorSerialised(detail)) {
        return { ...new Error(detail.value.message), ...detail.value };
      } else {
        return detail;
      }
    })
  );
  error.stack = serialised.value.stack;
  return error;
}

const originalSerialise = throwHandler.serialize;
throwHandler.serialize = (thrown: ThrownValue) => {
  const { value } = thrown;
  if (isBettererError(value)) {
    const serialised = serializeBettererError(value);
    return [serialised, []];
  }
  return originalSerialise(thrown);
};

const originalDeserialise = throwHandler.deserialize;
throwHandler.deserialize = (serialized) => {
  if (isBettererErrorSerialised(serialized)) {
    throw deserializeBettererError(serialized);
  }
  throw originalDeserialise(serialized);
};

transferHandlers.set('throw', throwHandler);
