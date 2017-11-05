var chalk = require('chalk')
var pad = require('lodash.padend')
var _getName = require('./_get-function-name')
var _getUrl = require('./_get-url')

/**
 * generates the completion report
 */
module.exports = function done(params, bar) {
  var {results, pathToCode, env, arc} = params
  var h1 = `Success!`
  var h1a = ` Deployed ${results.length} Lambdas`
  var title = chalk.green(h1) + chalk.green.dim(h1a)
  console.log(title)
  var hr = ''
  for (var i = 0; i < (h1.length + h1a.length); i++) hr += '-'
  console.log(chalk.cyan.dim(hr))
  var longest = 0
  results.forEach(r=> {
    var cur = r.length
    if (cur > longest) longest = cur
  })
  results.forEach(srcPath=> {
    var left = chalk.cyan.dim(pad(srcPath + ' ', longest + 3, '.'))
    var right =  chalk.cyan(_getName({arc, env, pathToCode:srcPath}))
    console.log(left + ' ' + right)
  })
  var isHTTP = results.find(r=> r.includes('src/html') || r.includes('src/json'))
  if (isHTTP) {
    _getUrl({
      env,
      arc,
    }, 
    function _gotUrl(err, url) {
      if (err) {
        console.log(err)
      }
      else {
        var pretty = chalk.cyan.underline(url)
        console.log('\n' + pretty)
        console.log('\n')
      }
    })
  }
}
