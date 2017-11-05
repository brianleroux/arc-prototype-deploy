// deps
var fs = require('fs')
var assert = require('@smallwins/validate/assert')
var waterfall = require('run-waterfall')

// local deps
var _getName = require('./_get-function-name')
var validate = require('./_validate')
var beforeDeploy = require('./00-before-deploy')
var installModules = require('./01-install-modules')
var copyShared = require('./02-copy-shared')
var uploadZip = require('./04-upload-zip')
var done = require('./_done')
var progress = require('./_progress')

module.exports = function deploy(params, callback) {

  // module contract
  assert(params, {
    env: String,
    arc: Object,
    pathToCode: String,
    tick: Function,
  })

  // local state
  // - env; one of staging or production
  // - pathToArc; absolute path to the .arc file currently executing
  // - pathToCode; absolute path to the lambda function being deployed
  // - arc; the parsed .arc file contents
  // - lambda; the name of the lambda being deployed
  // - progressBar; the progress bar
  let {
    env, 
    arc,
    pathToCode,
    tick,
  } = params
  let lambda = _getName({env, pathToCode, arc})

  // binds local state above to the functions below 
  const _validate = validate.bind({}, {pathToCode, tick})
  const _plugins = beforeDeploy.bind({}, {env, pathToCode, arc, tick})
  const _modules = installModules.bind({}, {pathToCode, tick})
  const _shared = copyShared.bind({}, {pathToCode, tick})
  const _upload = uploadZip.bind({}, {pathToCode, lambda, tick})
  const _done = done.bind({}, {pathToCode, lambda, callback, tick})

  // executes the functions above 
  // in series sharing no state between them
  waterfall([
    _validate, 
    _plugins, 
    _modules, 
    _shared, 
    _upload
  ], _done)
}
