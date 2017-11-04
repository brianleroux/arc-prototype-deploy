var cpr = require('cpr')
var fs = require('fs')
var path = require('path')
var parse = require('@architect/parser')
var assert = require('@smallwins/validate/assert')
var zipit = require('zipit')
var glob = require('glob')
var chalk = require('chalk')
var aws = require('aws-sdk')
var waterfall = require('run-waterfall')
var Installer = require('cipm')
var lambda = new aws.Lambda

module.exports = function deploy(params, callback) {

  assert(params, {
    env: String,
    pathToArc: String,
    pathToCode: String,
  })

  var {env, pathToArc, pathToCode} = params
  var appName = parse(fs.readFileSync(pathToArc).toString()).app[0]
  var pathToPkg = path.join(pathToCode, 'package.json') // FIXME need to check for package-lock.json now too

  var pkgExists = fs.existsSync(pathToPkg) // FIXME perf (lets do this async)
  if (!pkgExists) {
    console.log(chalk.yellow.dim('skip ' + pathToPkg + ' not found'))
    callback()
  }
  else {
    var packageName = JSON.parse(fs.readFileSync(`./${pathToPkg}`).toString()).name // FIXME perf (can we read once and pass it in here?)
    var FunctionName = `${appName}-${env}${packageName.replace(appName, '')}`

    waterfall([
      
      // auto install everything in package-lock.json using cipm
      function _modules(callback) {
        var lock = path.join(process.cwd(), pathToCode)
        var installer = new Installer({prefix: lock})
        installer.run().then(function(deets) {
          callback() 
        }).catch(callback)
      },

      // copy ./shared into ./node_modules/@architect/shared/
      function _shared(callback) {
        var src = path.join(process.cwd(), 'src', 'shared')
        var exists = fs.existsSync(src) // FIXME perf
        if (exists) {
          var dest = path.join(process.cwd(), pathToCode, 'node_modules', '@architect', 'shared')
          var noop = err=> (console.log(err), callback())
          cpr(src, dest, {deleteFirst: true}, noop)  
        }
        else {
          callback() // quietly continue if ./shared doesn't exist
        }
      },

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
        console.log(`${chalk.dim('deploy')} ${chalk.yellow(FunctionName)} ${chalk.dim('start')}`)
        lambda.updateFunctionCode({
          FunctionName,
          ZipFile: buffer
        }, callback)
      }
    ],
    // report the result
    function _done(err) {
      if (err) {
        console.log(`${chalk.dim('deploy')} ${chalk.red.bold(FunctionName)} ${chalk.dim('failed')}`)
        console.log(chalk.dim(err))
      }
      else {
        console.log(`${chalk.dim('deploy')} ${chalk.green.bold(FunctionName)} ${chalk.dim('success')}`)
      }
      callback()
    })
  }
}
