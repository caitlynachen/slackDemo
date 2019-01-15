// Copyright 2018 James Chien

const ccxt = require ('ccxt')
const axios = require('axios')
const NodeCache = require( "node-cache" )
const _ = require('lodash')
require('babel-polyfill')

/**
 * Class representing cryptocurrency converter.
 */
class Cryptoex {
  /**
   * Create Cryptoex instance
   * @param {object} parameters - The cryptocurrency exchange, Fixer API access key, Cache options
   */
  constructor({
                provider,
                fixerAccessKey,
                cacheOptions = {
                  stdTTL: 0, 
                  checkperiod: 600, 
                  errorOnMissing: false, 
                  useClones: true, 
                  deleteOnExpire: true 
                }
              } = {}) {      
    this._createCache(cacheOptions)
    this._createProvider(provider)
    this.forexRates = this._createFixer(fixerAccessKey)
  }

  /**
   * Create provider
   * @param {string} provider - The cryptocurrency exchange.
   * @throws {Error} Will throw an error if the provider can't create.
   */
  async _createProvider(provider) {
    if (provider && Cryptoex.exchanges.includes(provider)) {
      this.providerObj = new ccxt[provider]()
      this.providerObj.name = provider
    } else {
      for (let exchange of this.defaultExchanges) {
        try {
          this.providerObj = new ccxt[exchange]()
          this.providerObj.name = exchange
          await this.loadMarkets()
          break
        } catch (error) {
          // console.log(error)
        }
      }

      if (!this.providerObj) {
        throw Error('There is a network communication issue.')
      }
    }
  }

  /**
   * Create Fixer
   * @param {string} fixerAccessKey - The Fixer API access key.
   */
  async _createFixer(fixerAccessKey) {
    if (!fixerAccessKey) {
      throw Error('You must provide Fixer API access key (https://fixer.io/).')
    }
    this.fixerObj = axios.create({
      baseURL: 'http://data.fixer.io/api',
      timeout: 3000,
      headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'}
    })

    return new Promise(async (resolve) => {
      let forexRates = this.cacheObj.get('forexRates')
      if (forexRates) {
        this.forexRates = forexRates
        resolve(this.forexRates)
      } else {
        let fixerPromise = this.fixerObj.get(`/latest?access_key=${fixerAccessKey}&format=1`)
        fixerPromise.then(((response) => {
          this.forexRates = this.changeBaseRate(response.data.rates)
          resolve(this.forexRates)
          this.cacheObj.set('forexRates', this.forexRates)
        }).bind(this)).catch(((error) => {
          this.forexRates = this.cacheObj.get('forexRates')
          resolve(this.forexRates || {})
        }).bind(this))
      }
    })
  }

  /**
   * Create cache
   * @param {object} cacheOptions - The cache options.
   */
  _createCache(cacheOptions) {
    this.cacheObj = new NodeCache(cacheOptions)
  }

  /**
   * Get the cryptocurrency exchanges.
   * @return {object} The cryptocurrency exchanges.
   */
  static get exchanges() {
    return ccxt.exchanges
  }

  /**
   * Get the foreign exchange currencies
   * @return {Array} The foreign exchange currencies.
   */
  get forexCurrencies() {
    return new Promise(async (resolve) => {
      let forexRates = this.cacheObj.get('forexRates')
      if (!forexRates) {
        if (this._isPromise(this.forexRates)) {
          forexRates = await this.forexRates
        } else {
          forexRates = this.forexRates
        }
      }
      resolve(_.keys(forexRates))
    })
  }

  /**
   * Get the default cryptocurrency exchanges.
   * @return {Array} The cryptocurrency exchanges.
   */
  get defaultExchanges() {
    return [
      'coinmarketcap',
      'yobit',
      'livecoin',
      'ccex',
      'southxchange'
    ]
  }

  /**
   * Get the cryptocurrency exchange.
   * @return {string} The cryptocurrency exchange.
   */
  get provider() {
    return this.providerObj.name
  }

  /**
   * Load cryptocurrency markets data initially.
   * @return {Promise} The promise object.
   */
  async loadMarkets() {
    await Promise.all([this.providerObj.loadMarkets()])
  }

  /**
   * Change base rate to USD.
   * @return {object} The foreign exchange rates.
   */
  changeBaseRate(rates) {
    let baseNum = +(1 / rates['USD']).toFixed(6)
    return _.transform(rates, (result, rate, key) => {
      result[key] = (key === 'USD' ? 1 : +(baseNum * rate).toFixed(6))
    }, {})
  }

  /**
   * Determine if the object is a Promise
   * @return {boolean} The boolean value.
   */
  _isPromise(object) {
    return Promise.resolve(object) == object
  }

  /**
   * Get the foreign exchange rates by cryptocurrency
   * @return {object} The foreign exchange rates.
   */
  async getRates(cryptocurrency) {
    cryptocurrency = cryptocurrency.toUpperCase()

    let forexRates = {}
    if (this._isPromise(this.forexRates)) {
      forexRates = await this.forexRates
    } else {
      forexRates = this.forexRates
    }

    let providerData = await this.providerObj.fetchTicker(`${cryptocurrency}/USD`)
    let toUsdPrice = providerData.last

    return _.transform(forexRates, (result, rate, key) => {
      result[key] = rate * toUsdPrice
    }, {})
  }

  /**
   * Get the foreign exchange rate by cryptocurrency
   * @return {number} The foreign exchange rate.
   */
  async getRate(cryptocurrency, forexCurrency) {
    cryptocurrency = cryptocurrency.toUpperCase()
    forexCurrency = forexCurrency.toUpperCase()

    let rates = await this.getRates(cryptocurrency)
    return rates[forexCurrency] || 0
  }

  /**
   * Convert the cryptocurrency to foreign exchange rate by amount
   * @return {number} The foreign exchange amount.
   */
  async convert(cryptocurrency, forexCurrency, amount) {
    let rate = await this.getRate(cryptocurrency, forexCurrency)
    return rate * amount
  }

  /**
   * Convert the foreign exchange rate to cryptocurrency by amount
   * @return {number} The cryptocurrency amount.
   */
  async convertToCrypto(forexCurrency, cryptocurrency, amount) {
    let rate = await this.getRate(cryptocurrency, forexCurrency)
    return +(+(1 / rate).toFixed(8) * amount).toFixed(8)
  }
}

module.exports = Cryptoex
