import { Method } from './types';

export function raiseParseError(message: string): never {
  throw new Error(`Parse failed: ${message}`);
}

export function assertMethod(method: string): asserts method is Method {
  if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
    raiseParseError(`${method} is not valid method.`);
  }
}

export function assertString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new TypeError(`'${value}' expected to be a string.`);
  }
}
