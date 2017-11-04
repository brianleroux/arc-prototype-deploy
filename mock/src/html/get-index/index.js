var arc = require('@architect/functions')
var hi = require('@architect/shared/hi')

function route(req, res) {
  res({html:hi()})
}

exports.handler = arc.html.get(route)
