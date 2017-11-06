# prototype code beware! :ghost:

This is the next generation of `npm run deploy` for JSF Architect apps. This version makes dep mgmt easier across lambdas.

- [x] automagic installs dependencies listed in `package-lock.json` in `src/**/*` lambdas before deploy
- [x] copies `./src/shared` into `./src/**/*/node_modules/@architect/shared` for common code across lambdas
- [x] looks for `@plugins` and calls `arc-before-deploy` and `arc-after-deploy` as needed
- [x] progress indication
- [x] report what src deployed to which lambda
- [x] report the deploy url if HTTP routes involved

### install

```bash
npm i arc-deploy-prototype --save
```

### usage

Add the following to `scripts` in `package.json`

```javascript
{
  "deploy": "AWS_REGION=xxx AWS_PROFILE=xxx arc-prototype-deploy"
}
```


### plugins research

currently there is a 'plugin' in the root of this dir named `_any-name-works`. copy that into `./node_modules/any-name-works` and look at `mock/.arc` to see registration step. for usage, this version of deploy does the rest.
