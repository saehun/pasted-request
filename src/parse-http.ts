import { Method, ParseRequest } from './types';
import { assertMethod, raiseParseError } from './utils';

export const parseHttpReqeust: ParseRequest = (raw, { https = true } = {}) => {
  const trimmed = raw.trim();
  return {
    url: parseUrl(trimmed, https),
    body: parseBody(trimmed),
    method: parseMethod(trimmed),
    headers: parseHeaders(trimmed),
  };
};

function parseMethod(raw: string): Method {
  const method = raw.split(' ', 1)[0]?.toLowerCase();
  assertMethod(method);
  return method;
}

function parseUrl(raw: string, https: boolean): string {
  let url = raw.split(' ')[1];
  if (url.startsWith('/')) {
    url = (https ? 'https://' : 'http://') + parseHeaders(raw).host + url;
  }
  return url;
}

function parseBody(raw: string): string {
  const lines = raw.split('\n');
  return lines.slice(lines.indexOf('')).join('').trim();
}

function parseHeaders(raw: string): Record<string, string> {
  const lines = raw.split('\n');
  const endIndex = lines.indexOf('');
  const headerLines = lines.slice(1, endIndex === -1 ? undefined : endIndex);
  return headerLines.reduce((headers, line) => {
    const parsed = /^(.+?):(.+)$/.exec(line);
    if (parsed === null) {
      raiseParseError(`'${line}' is not a valid header`);
    }
    const [, key, value] = parsed;
    return { ...headers, [key.toLowerCase()]: value.trim() };
  }, {});
}
