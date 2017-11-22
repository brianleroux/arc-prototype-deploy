/* eslint global-require:"off" */
/**
 * calls any plugins registered in .arc with beforeDeploy
 */
module.exports = function _plugins(params, callback) {
  let {arc, pathToCode, env} = params
  // reads @plugins
  if (!arc.plugins) {
    if (params.tick) params.tick()
    callback()
  }
  else {
    // get the list of plugins
    var fns = arc.plugins.map(pluginName=> {
      try {
        var tmp = require(pluginName)
        var has = tmp.hasOwnProperty('beforeDeploy')
        var valid = typeof tmp.beforeDeploy === 'function'
        if (has && valid) {
          return tmp.beforeDeploy
        }
        else if (has && !valid) {
          throw TypeError(pluginName + '.beforeDeploy not a function')
        }
        else {
          return false
        }
      }
      catch(e) {
        if (e.code === 'MODULE_NOT_FOUND') {
          throw ReferenceError('Arc plugin "' + pluginName + '" not found')
        }
        throw e
      }
    }).filter(Boolean).map(fn=> fn({arc, pathToCode, env}))
    // invoke them all concurrently (could be a problem! we probably want sequentially?)
    Promise.all(fns).then(function() {
      if (params.tick) params.tick()
      callback()
    }).catch(callback)
  }
}
