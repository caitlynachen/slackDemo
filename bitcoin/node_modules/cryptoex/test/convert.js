const _ = require('lodash')
const test = require('tap').test
const Cryptoex = require('../dist/cryptoex')

test('Convert cryptocurrency to foreign exchange currencies', function (t) {
  t.plan(2)

  let cryptoex = new Cryptoex({ fixerAccessKey: '2b7c6e03eba396900f6cac42f65818a7' })

  cryptoex.convert('BTC', 'TWD', 8).then((result) => {
    t.type(result, 'number')
    t.notEqual(result, 0)
  })
})