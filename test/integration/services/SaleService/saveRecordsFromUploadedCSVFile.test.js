const path = require('path')

class TestSuite extends TestCombo {
  get title() { return 'SaleService.saveRecordsFromUPloadedCSVFile - integration functional test' }

  get args() {
    return []
  }

  get argTypes() {
    return {
    }
  }

  filter(combination) {
    return true
  }

  extraCombinations() { return [] }

  beforeAll(test, combination) {

  }

  beforeEach(test, combination) {
    return this.runTest(test, combination)
  }

  afterAll(test, combination) {}

  afterEach(test, combination) {
    jest.restoreAllMocks()
  }

  getArgValues(test, combination, arg, argType) {
    const argValues = {
    }

    return argValues[arg][argType]
  }

  async testMethod(test, combination, argValues) {
    const filePath = path.resolve(__dirname, '../../../', 'samples/', 'MOCK_DATA_30.csv')

    const saleService = new SaleService()

    return saleService.saveRecordsFromUploadedCSVFile({
      filePath
    })
  }

  shouldSuccess(combination) {
    return true
  }

  successAssert(test, combination) {
    it('should iterate correct number of record', async () => {
      const count = await SaleRecord.countDocuments({})
      expect(count).toEqual(30)
    }, 60000)
  }

  failureAssert(test, combination) {
  }
}

const testSuite = new TestSuite()
testSuite.run()


