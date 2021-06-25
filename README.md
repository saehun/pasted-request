# Pasted Request
Generate a http request config from a curl command string or a raw http request string.

## Installation
```sh
yarn add pasted-request
npm i pasted-reqeust
``

## Usage
```typescript
import axios from 'axios;
import request from 'pasted-request'

const reqbin = request.curl`
curl -X POST https://reqbin.com/echo/post/json?foo=true \
-H "Accept: application/json" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "Id=78912&Customer=Jason%20Sweet"
`
reqbin.method // 'post'

reqbin.url(); // https://reqbin.com/echo/post/json?foo=true
reqbin.url({ foo: false, bar: 'baz' }); // https://reqbin.com/echo/post/json?foo=false&bar=baz

reqbin.headers(); // { 'accept': 'application/json', 'content-type': 'application/x-www-form-urlencoded' }
reqbin.headers({ cookie: 'foo=bar' }); // { 'accept': 'application/json', 'content-type': 'application/x-www-form-urlencoded': 'cookie': 'foo=bar' }

reqbin.body(); // 'Id=78912&Customer=Jason%20Sweet'
reqbin.body({Id: 1000}); // 'Id=1000&Customer=Jason%20Sweet'


const reqbin2 = request.http`
PATCH /echo/post/json?foo=true HTTP/1.1
Host: reqbin.com
Accept: application/json
Content-Type: application/json
Content-Length: 81

{
  "Id": 78912,
  "Customer": "Jason Sweet"
}
`

// same as above

```

## Caveat
Parser only supports simple GET, DELETE requests and `application/json` or `application/x-www-form-urlencoded` POST, PATCH, PUT request only.

## License
MIT
