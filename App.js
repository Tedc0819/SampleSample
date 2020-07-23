const { App: SuperApp } = require("@shopline/sl-express")

class App extends SuperApp {
  async prepare() {
    this.fixErrorToJSON()
    await super.prepare()

    return this
  }

  fixErrorToJSON() {
    // native error.toJSON will become {}
    // eslint-disable-next-line no-extend-native
    Error.prototype.toJSON = function() {
      return {
        name: this.name,
        message: this.message,
        stack: this.stack
      }
    }
  }
}

module.exports = App
