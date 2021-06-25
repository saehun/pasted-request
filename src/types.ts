export type Method = 'head' | 'get' | 'post' | 'put' | 'patch' | 'delete';

export type ParseRequest = (raw: string, option?: ParseOption) => HttpRequest;

export type ParseOption = {
  https?: boolean;
};

export type HttpRequest = {
  method: Method;
  url: string;
  headers: Record<string, string>;
  body: string;
};
