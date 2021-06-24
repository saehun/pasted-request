import { ParseRequest } from './types';
import * as yargs from 'yargs';
import { assertMethod } from './utils';

/**
 * from https://github.com/NickCarneiro/curlconverter/blob/master/util.js
 */
export const parseCurlCommand: ParseRequest = raw => {
  // Remove newlines (and from continuations)
  raw = raw.trim();
  raw = raw.replace(/\\\r|\\\n/g, '');

  // Remove extra whitespace
  raw = raw.replace(/\s+/g, ' ');

  // yargs parses -XPOST as separate arguments. just prescreen for it.
  raw = raw.replace(/ -XPOST/, ' -X POST');
  raw = raw.replace(/ -XGET/, ' -X GET');
  raw = raw.replace(/ -XPUT/, ' -X PUT');
  raw = raw.replace(/ -XPATCH/, ' -X PATCH');
  raw = raw.replace(/ -XDELETE/, ' -X DELETE');
  // Safari adds `-Xnull` if is unable to determine the request type, it can be ignored
  raw = raw.replace(/ -Xnull/, ' ');
  raw = raw.trim();

  // Parse with some understanding of the meanings of flags.  In particular,
  // boolean flags can be trouble if the URL to fetch follows immediately
  // after, since it will be taken as an argument to the flag rather than
  // interpreted as a positional argument.  Someone should add all the flags
  // likely to cause trouble here.
  const parsedArguments: any = yargs
    .boolean(['I', 'head', 'compressed', 'L', 'k', 'silent', 's'])
    .alias('H', 'header')
    .alias('A', 'user-agent')
    .parse(raw);

  let url = parsedArguments._[1];

  // if url argument wasn't where we expected it, try to find it in the other arguments
  if (!url) {
    for (const argName in parsedArguments) {
      if (typeof parsedArguments[argName] === 'string') {
        if (parsedArguments[argName].indexOf('http') === 0 || parsedArguments[argName].indexOf('www.') === 0) {
          url = parsedArguments[argName];
        }
      }
    }
  }

  const headers: Record<string, string> = {};

  if (parsedArguments.header) {
    if (!Array.isArray(parsedArguments.header)) {
      parsedArguments.header = [parsedArguments.header];
    }

    parsedArguments.header.forEach((header: string) => {
      const parsed = /^(.+?):(.+)$/.exec(header);
      if (parsed === null) {
        return headers;
      }
      const [, key, value] = parsed;
      headers[key.toLowerCase()] = value.trim();
    });
  }

  if (parsedArguments['user-agent']) {
    headers['user-agent'] = parsedArguments['user-agent'];
  }

  let method;
  if (parsedArguments.X === 'POST') {
    method = 'post';
  } else if (parsedArguments.X === 'PUT' || parsedArguments.T) {
    method = 'put';
  } else if (parsedArguments.X === 'PATCH') {
    method = 'patch';
  } else if (parsedArguments.X === 'DELETE') {
    method = 'delete';
  } else if (
    (parsedArguments.d ||
      parsedArguments.data ||
      parsedArguments['data-ascii'] ||
      parsedArguments['data-binary'] ||
      parsedArguments['data-raw'] ||
      parsedArguments.F ||
      parsedArguments.form) &&
    !(parsedArguments.G || parsedArguments.get)
  ) {
    method = 'post';
  } else {
    method = 'get';
  }

  // if GET request with data, convert data to query string
  // NB: the -G flag does not change the http verb. It just moves the data into the url.
  if (parsedArguments.G || parsedArguments.get) {
    const option = 'd' in parsedArguments ? 'd' : 'data' in parsedArguments ? 'data' : null;
    if (option) {
      let urlQueryString = '';

      if (url.indexOf('?') < 0) {
        url += '?';
      } else {
        urlQueryString += '&';
      }

      if (typeof parsedArguments[option] === 'object') {
        urlQueryString += parsedArguments[option].join('&');
      } else {
        urlQueryString += parsedArguments[option];
      }
      url += urlQueryString;
      delete parsedArguments[option];
    }
  }

  url = url.replace(/^'/, '').replace(/'$/, '');

  let body = '';

  if (parsedArguments.data) {
    body = parsedArguments.data;
  } else if (parsedArguments['data-binary']) {
    body = parsedArguments['data-binary'];
  } else if (parsedArguments.d) {
    body = parsedArguments.d;
  } else if (parsedArguments['data-ascii']) {
    body = parsedArguments['data-ascii'];
  } else if (parsedArguments['data-raw']) {
    body = parsedArguments['data-raw'];
  }

  assertMethod(method);

  return {
    method,
    url,
    headers,
    body,
  };
};
