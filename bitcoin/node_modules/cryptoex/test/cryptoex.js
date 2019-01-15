const test = require('tap').test
const Cryptoex = require('../dist/cryptoex')

test('Cryptoex instance', function (t) {
  t.plan(1)

  t.type(new Cryptoex({ fixerAccessKey: '2b7c6e03eba396900f6cac42f65818a7' }), 'object', 'Cryptoex instance create failed')
})
