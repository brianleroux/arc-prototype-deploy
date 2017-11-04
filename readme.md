# prototype code beware! :ghost:

This is the next generation of `npm run deploy` for JSF Architect apps. This version makes dep mgmt easier across lambdas.

- [DONE] automagic installs dependencies listed in `package-lock.json` in `src/**/*` lambdas before deploy
- [DONE] copies `./src/shared` into `./src/**/*/node_modules/@architect/shared` for common code across lambdas
- [SOON] looks for `@plugins` and calls `arc-before-deploy` and `arc-after-deploy` as needed

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
