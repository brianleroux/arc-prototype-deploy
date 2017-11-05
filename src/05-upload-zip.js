var series = require('run-waterfall')
var path = require('path')
var zipit = require('zipit')
var glob = require('glob')
var aws = require('aws-sdk')

/**
 * zips and uploads the function to aws
 */
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
      ;(new aws.Lambda).updateFunctionCode({
        FunctionName: lambda,
        ZipFile: buffer
      },
      function _updatedFun(err) {
        if (err) {
          callback(err)
        }
        else {
          if (params.tick) params.tick()
          callback()
        }
      })
    }
  ], callback)
}
