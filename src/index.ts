import { parseCurlCommand } from './parse-curl';
import { parseHttpReqeust } from './parse-http';
import { requestWith } from './request-with';

export const request = {
  http: requestWith(parseHttpReqeust),
  curl: requestWith(parseCurlCommand),
} as const;

export default request;
