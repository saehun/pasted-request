import { Method, ParseRequest } from './types';
const words = require('shellwords');

/**
 * Attempt to parse the given curl string.
 * From https://github.com/tj/parse-curl.js by TJ Holowaychuk. applying some changes
 */
export const parseCurlCommand: ParseRequest = (raw: string) => {
  const args = rewrite(words.split(raw));
  const out: {
    method: Method;
    headers: Record<string, string>;
    body: string;
    url: string;
  } = { method: 'get', headers: {}, url: '', body: '' };
  let state = '';

  args.forEach(function (arg) {
    switch (true) {
      case isURL(arg):
        out.url = arg;
        break;

      case arg == '-A' || arg == '--user-agent':
        state = 'user-agent';
        break;

      case arg == '-H' || arg == '--header':
        state = 'header';
        break;

      case arg == '-d' || arg == '--data' || arg == '--data-ascii' || arg == '--data-raw':
        state = 'data';
        break;

      case arg == '-u' || arg == '--user':
        state = 'user';
        break;

      case arg == '-I' || arg == '--head':
        out.method = 'head';
        break;

      case arg == '-X' || arg == '--request':
        state = 'method';
        break;

      case arg == '-b' || arg == '--cookie':
        state = 'cookie';
        break;

      case arg == '--compressed':
        out.headers['Accept-Encoding'] = out.headers['Accept-Encoding'] || 'deflate, gzip';
        break;

      case !!arg:
        switch (state) {
          case 'header': {
            const field = parseField(arg);
            out.headers[field[0]] = field[1];
            state = '';
            break;
          }
          case 'User-Agent':
            out.headers['User-Agent'] = arg;
            state = '';
            break;
          case 'data':
            if (out.method == 'get' || out.method == 'head') out.method = 'post';
            out.headers['Content-Type'] = out.headers['Content-Type'] || 'application/x-www-form-urlencoded';
            out.body = arg;
            state = '';
            break;
          case 'user':
            out.headers['Authorization'] = 'Basic ' + btoa(arg);
            state = '';
            break;
          case 'method':
            out.method = arg.toLowerCase() as Method;
            state = '';
            break;
          case 'Cookie':
            out.headers['Cookie'] = arg;
            state = '';
            break;
        }
        break;
    }
  });

  return out;
};

/**
 * Rewrite args for special cases such as -XPUT.
 */
function rewrite(args: string[]) {
  return args.reduce((acc: string[], n: string) => {
    if (0 == n.indexOf('-X')) {
      acc.push('-X');
      acc.push(n.slice(2));
    } else {
      acc.push(n);
    }

    return acc;
  }, []);
}

/**
 * Parse header field.
 */
function parseField(s: string) {
  return s.split(/: (.+)/);
}

/**
 * Check if `s` looks like a url.
 */
function isURL(s: string) {
  return /^https?:\/\//.test(s);
}
