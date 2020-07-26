const path = require('path')

class TestSuite extends TestCombo {
  get title() { return 'CSVReader - integration functional test' }

  get args() {
    return ['chunkSize']
  }

  get argTypes() {
    return {
      chunkSize: ['lessThanOne', 'one', 'withRemaining'],
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
      chunkSize: {
        lessThanOne: 0,
        one: 1,
        withRemaining: 51,
      }
    }

    return argValues[arg][argType]
  }

  async testMethod(test, combination, argValues) {
    const [chunkSize] = argValues
    const reader = new CSVReader
    const filePath = path.resolve(__dirname, '../../../', 'samples/', 'small.csv')

    // counted in the file
    test.expectNumberOfRow = 272
    test.totalNumberOfRow = 0
    test.rowsSample = null

    return reader.iterateCSV({
      filePath,
      chunkSize,
      handler: ({ rows }) => {
        test.totalNumberOfRow += rows.length
        test.rowsSample = test.rowsSample || rows
      }
    })
  }

  shouldSuccess(combination) {
    const [chunkSize] = combination

    return chunkSize.match(/one|withRemaining/)
  }

  successAssert(test, combination) {
    it('should iterate correct number of record', () => {
      expect(test.totalNumberOfRow).toEqual(test.expectNumberOfRow)
    })

    it('should iterate with array of rows', () => {
      const [chunkSize] = test.args

      expect(test.rowsSample).toHaveLength(chunkSize)
    })

    it('should return row as object', () => {
      const expectedProperty = ["Index", "Eruption length (mins)","Eruption wait (mins)"]
      expect(test.rowsSample.length).toBeGreaterThan(0)

      test.rowsSample.forEach( (r) => {
        expectedProperty.forEach( (p) => {
          expect(r).toHaveProperty(p)
        })
      })
    })
  }

  failureAssert(test, combination) {
    it('should throw error', () => {
      expect(test.res).toBeInstanceOf(Error)
    })

  }
}

const testSuite = new TestSuite()
testSuite.run()


