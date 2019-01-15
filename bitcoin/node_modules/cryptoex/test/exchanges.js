const _ = require('lodash')
const test = require('tap').test
const Cryptoex = require('../dist/cryptoex')

test('Get cryptocurrency exchanges', function (t) {
  t.plan(2)

  let exchanges = Cryptoex.exchanges

  t.type(exchanges, 'object')
  t.notEqual(_.keys(exchanges).length, 0)
})