/**
 * calls any plugins registered in .arc with beforeDeploy
 */
module.exports = function _plugins(params, stats, callback) {
  let {arc, pathToCode, env} = params
  // reads @plugins 
  if (!arc.plugins) {
    if (params.tick) params.tick()
    callback(null, stats)
  }
  else {
    // get the list of plugins
    var fns = arc.plugins.map(pluginName=> {
      try {
        var tmp = require(pluginName)
        var has = tmp.hasOwnProperty('afterDeploy') 
        var valid = typeof tmp.afterDeploy === 'function'
        if (has && valid) {
          return tmp.afterDeploy
        }
        else if (has && !valid) {
          throw TypeError(pluginName + '.afterDeploy not a function')
        }
        else {
          return false
        }
      }
      catch(e) {
        throw ReferenceError('missing plugin ' + pluginName + ' not found')
      }
    }).filter(Boolean).map(fn=> fn({arc, pathToCode, env}))
    // invoke them all concurrently (could be a problem! we probably want sequentially?)
    Promise.all(fns).then(function() {
      if (params.tick) params.tick()
      callback(null, stats)
    }).catch(function(err) {
      throw err
    })
  }
}
