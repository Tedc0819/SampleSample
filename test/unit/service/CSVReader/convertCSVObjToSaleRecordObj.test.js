class TestSuite extends TestCombo {
  get title() { return 'SaleRecordService.convertCSVObjToSaleRecordObj unit test' }

  get args() {
    return ['csvObj']
  }

  get argTypes() {
    return {
      csvObj: ['correct', 'null'],
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
      csvObj: {
        correct: {
          USER_NAME: 'user name',
          AGE: 17,
          HEIGHT: 168,
          GENDER: 'M',
          SALE_AMOUNT: 167.8,
          LAST_PURCHASE_DATE: new Date
        },
        null: null,
      },
    }

    return argValues[arg][argType]
  }

  async testMethod(test, combination, argValues) {
    const [csvObj] = argValues

    const saleService = new SaleService

    return saleService.convertCSVObjToSaleRecordObj({
      csvObj,
    })
  }

  shouldSuccess(combination) {
    const [csvObj] = combination

    return csvObj.match(/correct/)
  }

  successAssert(test, combination) {
    it('should call readRange with correct arguments', () => {
      const [csvObj] = test.args
      console.log(test.res)

      expect(test.res).toEqual({
        userName: csvObj.USER_NAME,
        age: csvObj.AGE,
        height: csvObj.HEIGHT,
        gender: csvObj.GENDER,
        saleAmount: csvObj.SALE_AMOUNT,
        lastPurchasedAt: csvObj.LAST_PURCHASE_DATE,
      })
    })
  }

  failureAssert(test, combination) {
    it('should return null', () => {
      expect(test.res).toEqual(null)
    })
  }
}

const testSuite = new TestSuite()
testSuite.run()


