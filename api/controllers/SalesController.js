class SalesController {
  async record(req, res) {
    const filePath = req.files.fileX.path

    const saleService = new SaleService

    const result  = await saleService.saveRecordsFromUploadedCSVFile({
      filePath,
    })

    return res.status(200).send(result)
  }
}

module.exports = SalesController
