const { TestCombo } = require('test-combo')
const App = require(`${process.cwd()}/MyApp.js`)
const app = new App

global.TestCombo = TestCombo

beforeAll(async () => {
  process.env.MONGODB_DATABASE = `api_${Date.now()}`

  await app.prepare()
  await app.connectDependencies()
})

beforeEach(() => {
  return Promise.all([
    SaleRecord.remove({})
  ])
})

afterAll(async () => {
  await app.disconnectDependencies()
})
