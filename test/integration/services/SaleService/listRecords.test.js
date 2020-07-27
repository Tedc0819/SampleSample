class TestSuite extends TestCombo {
  get title() { return 'SaleService.listRecords' }

  get args() {
    return ['body']
  }

  get argTypes() {
    return {
      body: ['correct', 'pagination', 'timeRange', 'onlyStartTime', 'onlyEndTime'],
    }
  }

  filter(combination) {
    return true
  }

  extraCombinations() { return [] }

  beforeAll(test, combination) {
  }

  async beforeEach(test, combination) {
    test.dateTimeAddSecond = (datetime, seconds) => { return new Date(datetime.getTime() + (1000 * seconds)) }

    test.startDate = new Date
    test.endDate = test.dateTimeAddSecond(test.startDate, 5)
    test.limit = 3

    test.saleRecords = await Promise.mapSeries([...Array(10).keys()], (i) => {
      return SaleRecord.create({
        userName: "userName",
        age: 17,
        gender: 'M',
        height: 168,
        saleAmount: 100,
        lastPurchasedAt: Date.now(),
      })
    })

    return this.runTest(test, combination);
  }

  afterAll(test, combination) {}

  async afterEach(test, combination) {
    jest.restoreAllMocks()
  }

  getArgValues(test, combination, arg, argType) {
    const argValues = {
      body: {
        correct: {
          lastPurchasedAtStart: test.startDate,
          lastPurchasedAtEnd: test.endDate,
          idFrom: null,
          limit: null,
        },
        pagination: {
          lastPurchasedAtStart: test.startDate,
          lastPurchasedAtEnd: test.endDate,
          idFrom: test.saleRecords[2]._id,
          limit: 3,
        },
        timeRange: {
          lastPurchasedAtStart: test.saleRecords[1].lastPurchasedAt,
          lastPurchasedAtEnd: test.endDate,
          fields: test.fields,
          idFrom: null,
          limit: null,
        },
        onlyStartTime: {
          lastPurchasedAtStart: test.saleRecords[1].lastPurchasedAt,
          fields: test.fields,
          idFrom: null,
          limit: null,
        },
        onlyEndTime: {
          lastPurchasedAtEnd: test.saleRecords[2].lastPurchasedAt,
          fields: test.fields,
          idFrom: null,
          limit: null,
        },
      },
    }

    return argValues[arg][argType]
  }

  async testMethod(test, combination, argValues) {
    const [body] = argValues

    const saleService = new SaleService

    return saleService.listRecords(body)
  }

  shouldSuccess(combination) {
    return true
  }

  successAssert(test, combination) {
    const [body] = combination

    it ('should return structure with data and meta', () => {
      expect(test.res).toHaveProperty('data')
      expect(test.res).toHaveProperty('meta')
    })

    if (body === 'correct') {
      it ('should return correct saleRecords', () => {
        test.res.data.forEach((item, idx) => {
          expect(item._id).toEqual(test.saleRecords[idx]._id)
        })
      })

      return
    }

    if (body === 'pagination') {
      it ('should return correct saleRecords', () => {
        expect(test.res.data.length).toBeGreaterThan(0)
        test.res.data.forEach((item, idx) => {
          expect(item._id).toEqual(test.saleRecords[idx + test.res.data.length]._id)
        })
      })

      return
    }

    if (body === 'timeRange') {
      it ('should return correct saleRecords with target fields only', () => {
        expect(test.res.data.length).toBeGreaterThan(0)
        test.res.data.forEach((item, idx) => {
          expect(item._id).toEqual(test.saleRecords[idx + 1]._id)
        })
      })

      return
    }

    if (body === 'onlyStartTime') {
      it ('should return correct saleRecords with target fields only', () => {
        expect(test.res.data.length).toEqual(test.saleRecords.length -1)

        test.res.data.forEach((item, idx) => {
          expect(item._id).toEqual(test.saleRecords[idx + 1]._id)
        })
      })

      return
    }

    if (body === 'onlyEndTime') {
      it ('should return correct saleRecords with target fields only', () => {
        expect(test.res.data.length).toEqual(3)

        test.res.data.forEach((item, idx) => {
          expect(item._id).toEqual(test.saleRecords[idx]._id)
        })
      })

      return
    }


  }


  failureAssert(test, combination) {

  }
}

const testSuite = new TestSuite()
testSuite.run()
