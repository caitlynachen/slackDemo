const _ = require('lodash')
const test = require('tap').test
const Cryptoex = require('../dist/cryptoex')

test('Get rates', function (t) {
  t.plan(2)

  let cryptoex = new Cryptoex({ fixerAccessKey: '2b7c6e03eba396900f6cac42f65818a7' })

  cryptoex.getRates('BTC').then((result) => {
    t.type(result, 'object')
    t.notEqual(_.keys(result).length, 0)
  })
})