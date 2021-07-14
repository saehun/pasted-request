import { ParseRequest } from './types';
import { assertString } from './utils';
import * as queryString from 'query-string';
import { mergeDeepRight } from './merge';

export function requestWith(parse: ParseRequest) {
  return function <
    Query extends Record<string, string | boolean | number> = any,
    Headers extends Record<string, string> = any,
    Body extends Record<string, any> = any
  >(tokens: TemplateStringsArray, ...args: string[]) {
    args.forEach(assertString);
    if (tokens.length - 1 !== args.length) {
      throw new SyntaxError(`Function should be called in form of tagged template.`);
    }

    let raw = '';
    for (let i = 0; i < tokens.length; i++) {
      raw += tokens[i] + (args[i] ?? '');
    }

    const parsed = parse(raw);

    return {
      method: parsed.method,
      url,
      headers,
      body,
    };

    function url(args?: Query): string {
      if (args === undefined) {
        return parsed.url;
      }
      const urlObject = new URL(parsed.url);
      for (const key in args) {
        urlObject.searchParams.set(key, String(args[key]));
      }
      return urlObject.toString();
    }

    function headers(args?: Headers): Record<string, string> {
      if (args !== undefined) {
        for (const key in args) {
          parsed.headers[key] = args[key];
        }
      }

      return parsed.headers;
    }

    function body(args?: Body): string {
      if (args === undefined || parsed.body === '') {
        return parsed.body;
      }

      try {
        // content-type: application/json
        const bodyObj = JSON.parse(parsed.body);
        return mergeDeepRight(bodyObj, args);
      } catch {
        try {
          // content-type: application/x-www-form-urlencoded
          const formData = queryString.parse(parsed.body);
          for (const key in args) {
            formData[key] = args[key];
          }
          return queryString.stringify(formData);
        } catch {
          return parsed.body;
        }
      }
    }
  };
}
