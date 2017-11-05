var fs = require('fs')
var path = require('path')
var cpr = require('cpr')

// copy ./shared into ./node_modules/@architect/shared/
module.exports = function _shared(params, callback) {
  var {pathToCode} = params
  var src = path.join(process.cwd(), 'src', 'shared')
  var exists = fs.existsSync(src) // FIXME perf
  if (exists) {
    var dest = path.join(process.cwd(), pathToCode, 'node_modules', '@architect', 'shared')
    var noop = err=> (callback())
    cpr(src, dest, {deleteFirst: true}, noop)  
  }
  else {
    callback() // quietly continue if ./shared doesn't exist
  }
}
