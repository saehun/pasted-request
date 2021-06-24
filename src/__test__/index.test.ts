import { request } from '../index';
import { parseHttpReqeust } from '../parse-http';

describe('request', () => {
  it('can parse curl', () => {
    const { url, body, headers, method } = request.curl<{ foo: boolean; bar: string }, any, { Id: string }>`
curl -X POST https://reqbin.com/echo/post/json?foo=true \
-H "Accept: application/json" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "Id=78912&Customer=Jason%20Sweet"
`;
    expect(method).toEqual('post');
    expect(url()).toEqual('https://reqbin.com/echo/post/json?foo=true');
    expect(url({ foo: false, bar: '1234' })).toEqual('https://reqbin.com/echo/post/json?foo=false&bar=1234');
    expect(headers()).toEqual({
      accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded',
    });
    expect(body()).toEqual('Id=78912&Customer=Jason%20Sweet');
    expect(body({ Id: '0000' })).toEqual('Customer=Jason%20Sweet&Id=0000');
  });

  it('can parse curl copied from Google Chrome', () => {
    const { body, headers, method, url } = request.curl`
curl 'https://apius.reqbin.com/api/v1/requests' \
  -H 'authority: apius.reqbin.com' \
  -H 'pragma: no-cache' \
  -H 'cache-control: no-cache, no-store, must-revalidate' \
  -H 'sec-ch-ua: " Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36' \
  -H 'content-type: application/json' \
  -H 'accept: */*' \
  -H 'expires: 0' \
  -H 'origin: https://reqbin.com' \
  -H 'sec-fetch-site: same-site' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-dest: empty' \
  -H 'referer: https://reqbin.com/' \
  -H 'accept-language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7' \
  --data-raw '{"id":"","name":"","errors":"","json":"{\"method\":\"POST\",\"url\":\"https://reqbin.com/echo/post/json\",\"apiNode\":\"US\",\"contentType\":\"JSON\",\"content\":\"{\\n  \\\"Id\\\": 78912,\\n  \\\"Customer\\\": \\\"Jason Sweet\\\",\\n  \\\"Quantity\\\": 1,\\n  \\\"Price\\\": 18.00\\n}\",\"headers\":\"Accept: application/json\",\"errors\":\"\",\"curlCmd\":\"\",\"auth\":{\"auth\":\"noAuth\",\"bearerToken\":\"\",\"basicUsername\":\"{username}\",\"basicPassword\":\"\",\"customHeader\":\"\",\"encrypted\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyYW5kb20iOiJna3lobHNxeDkwcWkiLCJkYXRlIjoiMDU6MDM6MTUgTWF5IDIwIDIwMjEiLCJiZWFyZXJUb2tlbiI6IiIsImJhc2ljVXNlcm5hbWUiOiJrcEBwa2EubmFtZSIsImJhc2ljUGFzc3dvcmQiOiIiLCJjdXN0b21IZWFkZXIiOiIifQ.VOo39kySH2M7DWkfHB9i5KRFzRNkoXv8jQ9VXtk7jrg\"},\"compare\":false,\"idnUrl\":\"https://reqbin.com/echo/post/json\"}","deviceId":"a00f3265-8f9d-439c-8f17-04c2e9462b36R","sessionId":1624563483955}' \
  --compressed
 `;

    expect(method).toEqual('post');
    expect(headers()).toEqual({
      authority: 'apius.reqbin.com',
      pragma: 'no-cache',
      'cache-control': 'no-cache, no-store, must-revalidate',
      'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
      'sec-ch-ua-mobile': '?0',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36',
      'content-type': 'application/json',
      accept: '*/*',
      expires: '0',
      origin: 'https://reqbin.com',
      'sec-fetch-site': 'same-site',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      referer: 'https://reqbin.com/',
      'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    });
    expect(body()).toEqual(
      `{"id":"","name":"","errors":"","json":"{"method":"POST","url":"https://reqbin.com/echo/post/json","apiNode":"US","contentType":"JSON","content":"{\\n \\"Id\\": 78912,\\n \\"Customer\\": \\"Jason Sweet\\",\\n \\"Quantity\\": 1,\\n \\"Price\\": 18.00\\n}","headers":"Accept: application/json","errors":"","curlCmd":"","auth":{"auth":"noAuth","bearerToken":"","basicUsername":"{username}","basicPassword":"","customHeader":"","encrypted":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyYW5kb20iOiJna3lobHNxeDkwcWkiLCJkYXRlIjoiMDU6MDM6MTUgTWF5IDIwIDIwMjEiLCJiZWFyZXJUb2tlbiI6IiIsImJhc2ljVXNlcm5hbWUiOiJrcEBwa2EubmFtZSIsImJhc2ljUGFzc3dvcmQiOiIiLCJjdXN0b21IZWFkZXIiOiIifQ.VOo39kySH2M7DWkfHB9i5KRFzRNkoXv8jQ9VXtk7jrg"},"compare":false,"idnUrl":"https://reqbin.com/echo/post/json"}","deviceId":"a00f3265-8f9d-439c-8f17-04c2e9462b36R","sessionId":1624563483955}`
    );
    expect(url()).toEqual('https://apius.reqbin.com/api/v1/requests');
  });

  it('can parse raw http request', () => {
    const { url, body, headers, method } = request.http`
PATCH /echo/post/json?foo=true HTTP/1.1
Host: reqbin.com
Accept: application/json
Content-Type: application/json
Content-Length: 81

{
  "Id": 78912,
  "Customer": "Jason Sweet",
  "Quantity": 1,
  "Price": 18.00
}
`;

    expect(method).toEqual('patch');
    expect(url()).toEqual('https://reqbin.com/echo/post/json?foo=true');
    expect(url({ foo: 'bar' })).toEqual('https://reqbin.com/echo/post/json?foo=bar');
    expect(headers()).toEqual({
      host: 'reqbin.com',
      accept: 'application/json',
      'content-type': 'application/json',
      'content-length': '81',
    });

    expect(headers({ host: undefined })).toEqual({
      accept: 'application/json',
      'content-type': 'application/json',
      'content-length': '81',
    });
    expect(body({})).toEqual(JSON.stringify({ Id: 78912, Customer: 'Jason Sweet', Quantity: 1, Price: 18.0 }));
    expect(body({ Customer: 'Karl Saehun Chung' })).toEqual(
      JSON.stringify({ Id: 78912, Customer: 'Karl Saehun Chung', Quantity: 1, Price: 18.0 })
    );
    expect(
      parseHttpReqeust(
        `
PATCH /echo/post/json?foo=true HTTP/1.1
Host: reqbin.com
Accept: application/json
Content-Type: application/json
Content-Length: 81
    `,
        { https: false }
      ).url
    ).toEqual('http://reqbin.com/echo/post/json?foo=true');

    expect(
      request.http`
PATCH /echo/post/json?foo=true HTTP/1.1
Host: reqbin.com
Accept: application/json
Content-Type: application/json
Content-Length: 81

asdf
    `.body({})
    ).toEqual('asdf');
  });

  it('can raise ParseError', () => {
    expect(
      () =>
        request.http`
GET /echo/post/json?foo=true HTTP/1.1
Host: google.com
xxxxxxxxxxxx

`
    ).toThrowError();
  });

  it('can parse http request with full url', () => {
    const raw = `
GET http://google.com/echo/post/json?foo=true HTTP/1.1
accept: */*
accept-encoding: gzip, deflate, br
accept-language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7
cache-control: no-cache, no-store, must-revalidate
    `;
    const { url } = request.http`${raw}`;
    expect(url()).toEqual('http://google.com/echo/post/json?foo=true');
  });

  it('should be called in form of tagged template or throw', () => {
    expect(() => request.http([''] as any, '')).toThrowError();
    expect(
      () => request.http`
GET http://google.com/echo/post/json?foo=true HTTP/1.1
accept: */*
accept-encoding: ${(() => 'gzip, deflate, br') as any}

 `
    ).toThrowError();
  });

  it('can validate method', () => {
    expect(
      () =>
        request.http`
ADD http://google.com/echo/post/json?foo=true HTTP/1.1
accept: */*
accept-encoding: gzip, deflate, br
accept-language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7
cache-control: no-cache, no-store, must-revalidate
`
    ).toThrowError();
  });
});
