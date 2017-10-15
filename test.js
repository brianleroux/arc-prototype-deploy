var test = require('tape')
var deploy = require('.')

test('exists', t=> {
  t.plan(1)
  t.ok(deploy, 'is truthy')
})
