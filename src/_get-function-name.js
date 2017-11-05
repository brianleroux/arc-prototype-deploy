var fs = require('fs')
var path = require('path')

module.exports = function getFunctionName(params, callback) {
  let arc = params.arc 
  let env = params.env
  let appName = arc.app[0]
  let pathToCode = params.pathToCode
  let pathToPkg = path.join(pathToCode, 'package.json')
  let packageName = JSON.parse(fs.readFileSync(`./${pathToPkg}`).toString()).name 
  return `${appName}-${env}${packageName.replace(appName, '')}`
}
