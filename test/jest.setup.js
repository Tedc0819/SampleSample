const { TestCombo } = require('test-combo')
const App = require(`${process.cwd()}/App.js`)
global.TestCombo = TestCombo

beforeAll(async () => {
  const app = new App
  return app.prepare()
})
