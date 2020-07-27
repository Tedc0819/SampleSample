class TestSuite extends TestCombo {
  get title() { return 'SalesController.report unit test' }

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
    const { SalesController }= app.controllers

    test.query = { a: 1 }
    test.targetRes = { b: 2 }
    test.whiteListedParams = { c: 3 }

    test.saleService = SalesController.getSaleService()
    jest.spyOn(SalesController, 'getSaleService')
      .mockReturnValue(test.saleService)

    jest.spyOn(test.saleService, 'listRecords')
      .mockReturnValue(test.targetRes)

    jest.spyOn(helpers, 'whiteList')
      .mockReturnValue(test.whiteListedParams)

    return SalesController.report(
      { query: test.query },
      { status: (s) => {
          return {
            send: (s) => { return s }
          }
        }
      })
  }

  shouldSuccess(combination) {
    return true
  }

  successAssert(test, combination) {
    it('should call saleService with whitelisted params', () => {
      expect(test.saleService.listRecords).toHaveBeenCalledWith(test.whiteListedParams)
    })

    it('should return what saleService.listRecords return', () => {
      expect(test.res).toEqual(test.targetRes)
    })
  }

  failureAssert(test, combination) {
  }
}

const testSuite = new TestSuite()
testSuite.run()


