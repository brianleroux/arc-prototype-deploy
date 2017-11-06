#!/usr/bin/env node
var fs = require('fs')
var path = require('path')
var glob = require('glob')
var chalk = require('chalk')
var parallel = require('run-parallel')
var parse = require('@architect/parser')
var deploy = require('.')
var _progress = require('./src/_progress')
var _report = require('./src/_report')
var steps = 7 // magic number of steps in src
var start = Date.now()

var pathToArc = path.join(process.cwd(), '.arc')

if (!fs.existsSync(pathToArc)) {
  console.log(chalk.red('missing .arc file'))
  process.exit(1)
}

// deploy to staging by default
var env = (process.env.ARC_DEPLOY === 'production')? 'production' : 'staging'
let arc = parse(fs.readFileSync(pathToArc).toString())

// deploy everything in ./src by default
var isMany = process.argv.length === 2
if (isMany) {
  var pattern = 'src/@(html|json|events|scheduled|tables|slack)/*'
  glob(pattern, function _glob(err, results) {
    if (err) {
      console.log(chalk.red('failed to glob'), err)
      process.exit(1)
    }
    else {
      var done = _report.bind({}, {results, pathToCode, env, arc, start})
      var total = results.length * steps
      var progress = _progress({name: chalk.green.dim(`Deploying ${results.length} lambdas`), total}, done)
      var tick = x=> progress.tick()
      parallel(results.map(pathToCode=> {
        return function _deploy(callback) {
          deploy({
            env,
            arc,
            pathToCode,
            tick,
          }, callback)
        }
      }))
    }
  })
}
else {
  var pathToCode = process.argv[2]
  var noop = x=>!x
  var total = steps
  var done = _report.bind({}, {results:[pathToCode], pathToCode, env, arc, start})
  var progress = _progress({name: chalk.green.dim(`Deploying ${pathToCode}`), total}, done)
  var tick = x=> progress.tick()
  deploy({
    env,
    arc,
    pathToCode,
    tick
  }, noop)
}
