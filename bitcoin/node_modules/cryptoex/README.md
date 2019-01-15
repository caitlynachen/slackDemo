# node-cryptoex

[![Build Status](https://travis-ci.org/ja3eschien/node-cryptoex.svg?branch=master)](https://travis-ci.org/ja3eschien/node-cryptoex)

# Simple cryptocurrency converter

Cryptocurrency exchange rate library with support for 100+ exchanges and 15+ reliable banks and financial data sources.

## Foreign exchange rates source

https://fixer.io/ ☞ Fixer is a simple and lightweight API for current and historical foreign exchange (forex) rates.
You need to register for **access key** before using node-cryptoex module.

## Installing

Using npm:

```bash
$ npm install cryptoex
```

Using yarn:

```bash
$ yarn add cryptoex
```

# example

## cryptocurrency.js

```js
const Cryptoex = require('cryptoex');

let cryptoex = new Cryptoex({ fixerAccessKey: 'YOUR FIXER ACCESS KEY' });

// The rates for BTC
cryptoex.getRates('BTC').then((rates) => {
  // { USD: 7469.72, CNY: 50029.92870456, TWD: 228042.90260672002...}
});

// The rate for BTC to TWD
cryptoex.getRate('BTC', 'TWD').then((rate) => {
  // 228065.45655225002
});

// Convert BTC to TWD by amount
cryptoex.convert('BTC', 'TWD', 8).then((amount) => {
  // 1824394.099112
});

// Convert TWD to BTC by amount
cryptoex.convertToCrypto('TWD', 'BTC', 8).then((amount) => {
  // 0.00003512
});
```

# license

MIT