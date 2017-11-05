# Managing Dependencies

## Shared Local Code

Sharing local code between functions creating a special folder in `./src/shared` which gets copied into `./node_modules/@architect/shared` before each deployment. This is great for shared code like a layout or common utility functions. 

Example of using `./src/shared` from `./src/html/get-index`:

```javascript
// src/shared/hi
module.exports = function sayHi() {
  return  'hi'
}
```

```javascript
// src/html/get-index
var hi = require('@architect/shared/hi')

function route(req, res) {
  res({
    html: hi() // outputs 'hi'
  })
}

exports.handler = arc.html.get(route)
```

## Per Function Deps

Each lambda function under `./src` has a `package.json` and, on Node 8 or higher, `package-lock.json`. You can navigate in your terminal to the individual functions directory and use `npm install --save --production` to install any module you need from the registry. `npm run deploy` will automatically syncs node_modules to `package-lock.json` every deploy.
