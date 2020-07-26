const Joi = require('joi')

class SaleService {
  async saveRecordsFromUploadedCSVFile({ filePath }) {
    const reader = new CSVReader

    return reader.iterateCSV({
      filePath,
      chunkSize: 100,
      handler: async ({rows}) => {
        return Promise.map(rows, async (csvObj) => {
          return this.saveCSVToSaleRecord({ csvObj })
        })
      },
    })
  }

  validateSaleRecordObj({ saleRecordObj }) {
    const schema = Joi.object().keys({
      userName: Joi.string(),
      gender: Joi.string().valid('M', 'F'),
      age: Joi.number(),
      height: Joi.number(),
      saleAmount: Joi.number(),
      lastPurchasedAt: Joi.date(),
    })

    return Joi.assert(saleRecordObj, schema)
  }

  async saveCSVToSaleRecord({ csvObj }) {
    const saleRecordObj = this.convertCSVObjToSaleRecordObj({ csvObj })

    this.validateSaleRecordObj({ saleRecordObj })

    const saleRecord = new SaleRecord(saleRecordObj)

    const records = await SaleRecord.find({})

    await saleRecord.save()

    return saleRecord
  }

  convertCSVObjToSaleRecordObj({ csvObj }) {
    if (!csvObj) return null

    const propertyMap = {
      USER_NAME: 'userName',
      AGE: 'age',
      HEIGHT: 'height',
      GENDER: 'gender',
      SALE_AMOUNT: 'saleAmount',
      LAST_PURCHASE_DATE: 'lastPurchasedAt',
    }

    const modifier = {
      USER_NAME: (value) => (value),
      AGE: (value) => (parseInt(value, 10)),
      HEIGHT: (value) => (parseFloat(value)),
      GENDER: (value) => (value.toUpperCase()),
      SALE_AMOUNT: (value) => (parseFloat(value)),
      LAST_PURCHASE_DATE: (value) => (new Date(value)),
    }

    return Object.keys(propertyMap).reduce( (acc, key) => {
      return {
        ...acc,
        [propertyMap[key]]: modifier[key](csvObj[key]),
      }
    }, {})
  }
}

module.exports = SaleService
