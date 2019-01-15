const _ = require('lodash')
const test = require('tap').test
const Cryptoex = require('../dist/cryptoex')

test('Get foreign exchange currencies', function (t) {
  t.plan(2)

  let cryptoex = new Cryptoex({ fixerAccessKey: '2b7c6e03eba396900f6cac42f65818a7' })

  cryptoex.forexCurrencies.then((result) => {
    t.type(result, 'Array')
    t.notEqual(result.length, 0)
  })
})
