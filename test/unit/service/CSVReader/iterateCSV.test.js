class TestSuite extends TestCombo {
  get title() { return 'CSVReader.interateCSV unit test' }

  get args() {
    return ['filePath', 'chunkSize', 'handler']
  }

  get argTypes() {
    return {
      filePath: ['correct', 'emptyString', 'null'],
      chunkSize: ['correct', 'lessThanOne', 'null'],
      handler: ['correct', 'nonFunction', 'null', 'throwError'],
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
      filePath: {
        correct: 'abc',
        emptyString: '',
        null: null,
      },
      chunkSize: {
        correct: 5,
        lessThanOne: 0,
        null: null,
      },
      handler: {
        correct: jest.fn(() => {}),
        nonFunction: 'nonFunction',
        null: null,
        throwError: jest.fn(() => { throw new Error('target error message')})
      }
    }

    return argValues[arg][argType]
  }

  async testMethod(test, combination, argValues) {
    const [filePath, chunkSize, handler] = argValues

    test.reader = new CSVReader

    const sampleRows = (count) => {
      const ints = Object.keys(Array(count).fill(1))

      return ints.map(i => ({}))
    }

    test.rowSamples = [
      sampleRows(chunkSize),
      sampleRows(chunkSize),
      sampleRows(0),
    ]

    jest.spyOn(test.reader, 'readRange')
      .mockReturnValueOnce(test.rowSamples[0])
      .mockReturnValueOnce(test.rowSamples[1])
      .mockReturnValueOnce(test.rowSamples[2])

    return test.reader.iterateCSV({
      filePath,
      chunkSize,
      handler,
    })
  }

  shouldSuccess(combination) {
    const [filePath, chunkSize, handler] = combination

    return filePath.match(/correct/)
      && chunkSize.match(/correct/)
      && handler.match(/correct/)
  }

  successAssert(test, combination) {
    it('should call readRange with correct arguments', () => {
      const [filePath, chunkSize] = test.args

      // according to the spying on readRange
      expect(test.reader.readRange).toHaveBeenCalledTimes(3)

      const expectedCalls = [
        [{ filePath, from: 0, limit: chunkSize }],
        [{ filePath, from: chunkSize, limit: chunkSize }],
        [{ filePath, from: 2 * chunkSize, limit: chunkSize }],
      ]

      test.reader.readRange.mock.calls.forEach( (call, idx) => {
        expect(call).toEqual(expectedCalls[idx])
      })
    })

    it('should call handler with correct arguments', () => {
      const [filePath, chunkSize, handler] = test.args

      expect(handler).toHaveBeenCalledTimes(3)

      handler.mock.calls.forEach( (call, idx) => {
        expect(call).toEqual([{ rows: test.rowSamples[idx] }])
      })
    })
  }

  failureAssert(test, combination) {
    const [filePath, chunkSize, handler] = combination

    if (filePath.match(/emptyString|null/)) {
      it('should throw file path error with correct message', () => {
        expect(test.res).toBeInstanceOf(Error)
        expect(test.res.constructor.name).toEqual('CSVReaderFilePathInvalidError')
        expect(test.res.message).toEqual('file path should be a non-empty string')
      })

      return
    }

    if (chunkSize.match(/lessThanOne|null/)) {
      it('should throw chunk size error with correct message', () => {
        expect(test.res).toBeInstanceOf(Error)
        expect(test.res.constructor.name).toEqual('CSVReaderChunkSizeInvalidError')
        expect(test.res.message).toEqual('chunk size should be greater than 1')
      })

      return
    }

    if (handler.match(/null|nonFunction/)) {
      it('should throw handler error with correct message', () => {
        expect(test.res).toBeInstanceOf(Error)
        expect(test.res.constructor.name).toEqual('CSVReaderHandlerInvalidError')
        expect(test.res.message).toEqual('handler should be a function')
      })

      return
    }

    if (handler.match(/throwError/)) {
      it('should throw error', () => {
        expect(test.res.message).toEqual('target error message')
      })

      return
    }

    it('unhandled failure test', () => {
      throw new Error('unhandled test')
    })
  }
}

const testSuite = new TestSuite()
testSuite.run()


