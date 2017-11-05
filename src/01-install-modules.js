var path = require('path')
var Installer = require('cipm')

module.exports = function _modules(params, callback) {
  let {pathToCode} = params
  let lock = path.join(process.cwd(), pathToCode)
  let installer = new Installer({prefix: lock})
  installer.run().then(function(deets) {
    callback() 
  }).catch(callback)
}
