const _ = require('lodash')
const test = require('tap').test
const Cryptoex = require('../dist/cryptoex')

test('Get cryptocurrency exchange', function (t) {
  t.plan(1)

  let cryptoex = new Cryptoex({ fixerAccessKey: '2b7c6e03eba396900f6cac42f65818a7' })
  let provider = cryptoex.provider

  t.type(provider, 'string')
})
