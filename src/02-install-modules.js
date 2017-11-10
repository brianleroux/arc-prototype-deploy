var path = require('path')
var Installer = require('cipm')

/**
 * cipm install modules using package-lock.json
 */
module.exports = function _modules(params, callback) {
  let {pathToCode} = params
  let lock = path.join(process.cwd(), pathToCode)
  let installer = new Installer({prefix: lock})
  installer.run().then(function(deets) {
    if (params.tick) params.tick()
    callback() 
  }).catch(function fail(err) {
    // log any cipm failures but continue anyhow
    console.log(chalk.red(err))
    callback()
  })
}
