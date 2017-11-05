var series = require('run-waterfall')
var path = require('path')
var zipit = require('zipit')
var glob = require('glob')
var chalk = require('chalk')
var aws = require('aws-sdk')

module.exports = function uploadZip(params, callback) {
  let {pathToCode, lambda} = params
  series([
    // get a handle on the files to zip
    function _read(callback) {
      glob(path.join(process.cwd(), pathToCode, '/*'), callback)
    },
    function _zip(files, callback) {
      zipit({ // FIXME need to investigate faster zip options
        input: files,
      }, callback)
    },
    // upload the function
    function _upload(buffer, callback) {
      console.log(`${chalk.dim('deploy')} ${chalk.yellow(lambda)} ${chalk.dim('start')}`)
      ;(new aws.Lambda).updateFunctionCode({
        FunctionName: lambda,
        ZipFile: buffer
      }, callback)
    }
  ], callback)
}
