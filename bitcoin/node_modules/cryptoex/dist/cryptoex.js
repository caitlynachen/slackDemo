'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Copyright 2018 James Chien

var ccxt = require('ccxt');
var axios = require('axios');
var NodeCache = require("node-cache");
var _ = require('lodash');
require('babel-polyfill');

/**
 * Class representing cryptocurrency converter.
 */

var Cryptoex = function () {
  /**
   * Create Cryptoex instance
   * @param {object} parameters - The cryptocurrency exchange, Fixer API access key, Cache options
   */
  function Cryptoex() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        provider = _ref.provider,
        fixerAccessKey = _ref.fixerAccessKey,
        _ref$cacheOptions = _ref.cacheOptions,
        cacheOptions = _ref$cacheOptions === undefined ? {
      stdTTL: 0,
      checkperiod: 600,
      errorOnMissing: false,
      useClones: true,
      deleteOnExpire: true
    } : _ref$cacheOptions;

    _classCallCheck(this, Cryptoex);

    this._createCache(cacheOptions);
    this._createProvider(provider);
    this.forexRates = this._createFixer(fixerAccessKey);
  }

  /**
   * Create provider
   * @param {string} provider - The cryptocurrency exchange.
   * @throws {Error} Will throw an error if the provider can't create.
   */


  _createClass(Cryptoex, [{
    key: '_createProvider',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(provider) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, exchange;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(provider && Cryptoex.exchanges.includes(provider))) {
                  _context.next = 5;
                  break;
                }

                this.providerObj = new ccxt[provider]();
                this.providerObj.name = provider;
                _context.next = 41;
                break;

              case 5:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 8;
                _iterator = this.defaultExchanges[Symbol.iterator]();

              case 10:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 25;
                  break;
                }

                exchange = _step.value;
                _context.prev = 12;

                this.providerObj = new ccxt[exchange]();
                this.providerObj.name = exchange;
                _context.next = 17;
                return this.loadMarkets();

              case 17:
                return _context.abrupt('break', 25);

              case 20:
                _context.prev = 20;
                _context.t0 = _context['catch'](12);

              case 22:
                _iteratorNormalCompletion = true;
                _context.next = 10;
                break;

              case 25:
                _context.next = 31;
                break;

              case 27:
                _context.prev = 27;
                _context.t1 = _context['catch'](8);
                _didIteratorError = true;
                _iteratorError = _context.t1;

              case 31:
                _context.prev = 31;
                _context.prev = 32;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 34:
                _context.prev = 34;

                if (!_didIteratorError) {
                  _context.next = 37;
                  break;
                }

                throw _iteratorError;

              case 37:
                return _context.finish(34);

              case 38:
                return _context.finish(31);

              case 39:
                if (this.providerObj) {
                  _context.next = 41;
                  break;
                }

                throw Error('There is a network communication issue.');

              case 41:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[8, 27, 31, 39], [12, 20], [32,, 34, 38]]);
      }));

      function _createProvider(_x2) {
        return _ref2.apply(this, arguments);
      }

      return _createProvider;
    }()

    /**
     * Create Fixer
     * @param {string} fixerAccessKey - The Fixer API access key.
     */

  }, {
    key: '_createFixer',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(fixerAccessKey) {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (fixerAccessKey) {
                  _context3.next = 2;
                  break;
                }

                throw Error('You must provide Fixer API access key (https://fixer.io/).');

              case 2:
                this.fixerObj = axios.create({
                  baseURL: 'http://data.fixer.io/api',
                  timeout: 3000,
                  headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36' }
                });

                return _context3.abrupt('return', new Promise(function () {
                  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve) {
                    var forexRates, fixerPromise;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            forexRates = _this.cacheObj.get('forexRates');

                            if (forexRates) {
                              _this.forexRates = forexRates;
                              resolve(_this.forexRates);
                            } else {
                              fixerPromise = _this.fixerObj.get('/latest?access_key=' + fixerAccessKey + '&format=1');

                              fixerPromise.then(function (response) {
                                _this.forexRates = _this.changeBaseRate(response.data.rates);
                                resolve(_this.forexRates);
                                _this.cacheObj.set('forexRates', _this.forexRates);
                              }.bind(_this)).catch(function (error) {
                                _this.forexRates = _this.cacheObj.get('forexRates');
                                resolve(_this.forexRates || {});
                              }.bind(_this));
                            }

                          case 2:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, _callee2, _this);
                  }));

                  return function (_x4) {
                    return _ref4.apply(this, arguments);
                  };
                }()));

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _createFixer(_x3) {
        return _ref3.apply(this, arguments);
      }

      return _createFixer;
    }()

    /**
     * Create cache
     * @param {object} cacheOptions - The cache options.
     */

  }, {
    key: '_createCache',
    value: function _createCache(cacheOptions) {
      this.cacheObj = new NodeCache(cacheOptions);
    }

    /**
     * Get the cryptocurrency exchanges.
     * @return {object} The cryptocurrency exchanges.
     */

  }, {
    key: 'loadMarkets',


    /**
     * Load cryptocurrency markets data initially.
     * @return {Promise} The promise object.
     */
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return Promise.all([this.providerObj.loadMarkets()]);

              case 2:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function loadMarkets() {
        return _ref5.apply(this, arguments);
      }

      return loadMarkets;
    }()

    /**
     * Change base rate to USD.
     * @return {object} The foreign exchange rates.
     */

  }, {
    key: 'changeBaseRate',
    value: function changeBaseRate(rates) {
      var baseNum = +(1 / rates['USD']).toFixed(6);
      return _.transform(rates, function (result, rate, key) {
        result[key] = key === 'USD' ? 1 : +(baseNum * rate).toFixed(6);
      }, {});
    }

    /**
     * Determine if the object is a Promise
     * @return {boolean} The boolean value.
     */

  }, {
    key: '_isPromise',
    value: function _isPromise(object) {
      return Promise.resolve(object) == object;
    }

    /**
     * Get the foreign exchange rates by cryptocurrency
     * @return {object} The foreign exchange rates.
     */

  }, {
    key: 'getRates',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(cryptocurrency) {
        var forexRates, providerData, toUsdPrice;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                cryptocurrency = cryptocurrency.toUpperCase();

                forexRates = {};

                if (!this._isPromise(this.forexRates)) {
                  _context5.next = 8;
                  break;
                }

                _context5.next = 5;
                return this.forexRates;

              case 5:
                forexRates = _context5.sent;
                _context5.next = 9;
                break;

              case 8:
                forexRates = this.forexRates;

              case 9:
                _context5.next = 11;
                return this.providerObj.fetchTicker(cryptocurrency + '/USD');

              case 11:
                providerData = _context5.sent;
                toUsdPrice = providerData.last;
                return _context5.abrupt('return', _.transform(forexRates, function (result, rate, key) {
                  result[key] = rate * toUsdPrice;
                }, {}));

              case 14:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getRates(_x5) {
        return _ref6.apply(this, arguments);
      }

      return getRates;
    }()

    /**
     * Get the foreign exchange rate by cryptocurrency
     * @return {number} The foreign exchange rate.
     */

  }, {
    key: 'getRate',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(cryptocurrency, forexCurrency) {
        var rates;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                cryptocurrency = cryptocurrency.toUpperCase();
                forexCurrency = forexCurrency.toUpperCase();

                _context6.next = 4;
                return this.getRates(cryptocurrency);

              case 4:
                rates = _context6.sent;
                return _context6.abrupt('return', rates[forexCurrency] || 0);

              case 6:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getRate(_x6, _x7) {
        return _ref7.apply(this, arguments);
      }

      return getRate;
    }()

    /**
     * Convert the cryptocurrency to foreign exchange rate by amount
     * @return {number} The foreign exchange amount.
     */

  }, {
    key: 'convert',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(cryptocurrency, forexCurrency, amount) {
        var rate;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.getRate(cryptocurrency, forexCurrency);

              case 2:
                rate = _context7.sent;
                return _context7.abrupt('return', rate * amount);

              case 4:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function convert(_x8, _x9, _x10) {
        return _ref8.apply(this, arguments);
      }

      return convert;
    }()

    /**
     * Convert the foreign exchange rate to cryptocurrency by amount
     * @return {number} The cryptocurrency amount.
     */

  }, {
    key: 'convertToCrypto',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(forexCurrency, cryptocurrency, amount) {
        var rate;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.getRate(cryptocurrency, forexCurrency);

              case 2:
                rate = _context8.sent;
                return _context8.abrupt('return', +(+(1 / rate).toFixed(8) * amount).toFixed(8));

              case 4:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function convertToCrypto(_x11, _x12, _x13) {
        return _ref9.apply(this, arguments);
      }

      return convertToCrypto;
    }()
  }, {
    key: 'forexCurrencies',


    /**
     * Get the foreign exchange currencies
     * @return {Array} The foreign exchange currencies.
     */
    get: function get() {
      var _this2 = this;

      return new Promise(function () {
        var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(resolve) {
          var forexRates;
          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  forexRates = _this2.cacheObj.get('forexRates');

                  if (forexRates) {
                    _context9.next = 9;
                    break;
                  }

                  if (!_this2._isPromise(_this2.forexRates)) {
                    _context9.next = 8;
                    break;
                  }

                  _context9.next = 5;
                  return _this2.forexRates;

                case 5:
                  forexRates = _context9.sent;
                  _context9.next = 9;
                  break;

                case 8:
                  forexRates = _this2.forexRates;

                case 9:
                  resolve(_.keys(forexRates));

                case 10:
                case 'end':
                  return _context9.stop();
              }
            }
          }, _callee9, _this2);
        }));

        return function (_x14) {
          return _ref10.apply(this, arguments);
        };
      }());
    }

    /**
     * Get the default cryptocurrency exchanges.
     * @return {Array} The cryptocurrency exchanges.
     */

  }, {
    key: 'defaultExchanges',
    get: function get() {
      return ['coinmarketcap', 'yobit', 'livecoin', 'ccex', 'southxchange'];
    }

    /**
     * Get the cryptocurrency exchange.
     * @return {string} The cryptocurrency exchange.
     */

  }, {
    key: 'provider',
    get: function get() {
      return this.providerObj.name;
    }
  }], [{
    key: 'exchanges',
    get: function get() {
      return ccxt.exchanges;
    }
  }]);

  return Cryptoex;
}();

module.exports = Cryptoex;