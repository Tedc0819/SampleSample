class PublicController {
  async healthCheck(req, res) {
    return res.status(200).send("I am healthy")
  }
}

module.exports = PublicController
