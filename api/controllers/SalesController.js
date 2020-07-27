class SalesController {
  getSaleService() {
    const saleService = new SaleService()

    return saleService
  }

  async record(req, res) {
    const filePath = req.files.fileX.path

    const saleService = this.getSaleService()

    const result = await saleService.saveRecordsFromUploadedCSVFile({
      filePath
    })

    return res.status(200).send(result)
  }

  async report(req, res) {
    const whiteList = [
      "lastPurchasedAtStart",
      "lastPurchasedAtEnd",
      "idFrom",
      "limit"
    ]

    const whitelistedParams = helpers.whiteList({
      obj: req.query,
      filter: whiteList
    })

    if (whitelistedParams.limit) {
      whitelistedParams.limit = parseInt(whitelistedParams.limit, 10)
    }

    const saleService = this.getSaleService()

    const result = await saleService.listRecords(whitelistedParams)

    return res.status(200).send(result)
  }
}

module.exports = SalesController
