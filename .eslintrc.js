const sp = require('synchronized-promise')
const App = require('./app.js')

const app = new App()

const prepareSync = sp(app.prepare.bind(app))
prepareSync()

const globals = {
}

const targets = ['services', 'models']
targets.forEach((key) => {

  let reducer = (accum, current) => {
    accum[current] = true
    return accum
  }

  Object.assign(globals, Object.keys(app[key]).reduce(reducer, {}))

})

module.exports = {
  "extends": ['airbnb-base', 'prettier'],
  "plugins": ['prettier'],
  "rules": {
    "semi": 0,
    "class-methods-use-this": 0,
    "no-unused-vars": ["error", { "args": "none" }],
    "max-len": ["error", { "code": 120, "ignoreComments": true }],
    'no-underscore-dangle': ['error', { allow: ['_id'], "allowAfterThis": true }],
    'prettier/prettier': ['error', { "semi": false }],
  },
  globals
}
