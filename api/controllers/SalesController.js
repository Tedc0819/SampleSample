class SalesController {
  getSaleService() {
    const saleService = new SaleService()

    return saleService
  }

  async record(req, res) {
    try {
      const filePath = req.files.fileX.path

      const saleService = this.getSaleService()

      const result = await saleService.saveRecordsFromUploadedCSVFile({
        filePath
      })

      return res.status(200).send(result)
    } catch(e) {
      return res.status(400).send({ message: e.message })
    }
  }

  async report(req, res) {
    try {
      const whiteList = [
        "lastPurchasedAtStart",
        "lastPurchasedAtEnd",
        "idFrom",
        "limit"
      ]

      const whitelistedParams = helpers.whitelist({
        obj: req.query,
        filter: whiteList
      })

      if (whitelistedParams.limit) {
        whitelistedParams.limit = parseInt(whitelistedParams.limit, 10)
      }

      const saleService = this.getSaleService()

      const result = await saleService.listRecords(whitelistedParams)

      return res.status(200).send(result)
    } catch(e) {
      return res.status(400).send({ message: e.message })
    }
  }
}

module.exports = SalesController
