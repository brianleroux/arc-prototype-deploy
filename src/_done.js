var chalk = require('chalk')
var path = require('path')

module.exports = function _done(params, err) {
  if (params.tick) params.tick()
  let {pathToCode, callback, lambda} = params
  let pathToPkg = path.join(pathToCode, 'package.json')
  let pathToLock = path.join(pathToCode, 'package-lock.json') 
  if (err && err.message === 'cancel_missing_package') {
    console.log(chalk.yellow.dim('skip ' + pathToPkg + ' not found'))
  }
  else if (err && err.message === 'cancel_missing_lock') {
    console.log(chalk.yellow.dim('skip ' + pathToLock + ' not found'))
  }
  else if (err) {
    console.log(`${chalk.dim('deploy')} ${chalk.red.bold(lambda)} ${chalk.dim('failed')}`)
    console.log(chalk.dim(err))
  }
  else {
    // console.log(`${chalk.dim('deploy')} ${chalk.green.bold(lambda)} ${chalk.dim('success')}`)
  }
  callback()
}
