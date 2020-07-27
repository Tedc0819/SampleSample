class TestSuite extends TestCombo {
  get title() { return 'SalesController.record unit test' }

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
    const { SalesController } = app.controllers

    test.path = 'path'
    test.targetRes = { b: 2 }

    test.saleService = SalesController.getSaleService()
    jest.spyOn(SalesController, 'getSaleService')
      .mockReturnValue(test.saleService)

    jest.spyOn(test.saleService, 'saveRecordsFromUploadedCSVFile')
      .mockReturnValue(test.targetRes)

    return SalesController.record(
      { files: { fileX: { path: test.path } } },
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
    it('should call saleService with file path', () => {
      expect(test.saleService.saveRecordsFromUploadedCSVFile).toHaveBeenCalledWith({ filePath: test.path })
    })

    it('should return what saleService.record return', () => {
      expect(test.res).toEqual(test.targetRes)
    })
  }

  failureAssert(test, combination) {
  }
}

const testSuite = new TestSuite()
testSuite.run()


