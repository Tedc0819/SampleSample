module.exports = {
  preMiddlewares: ['* requestLog requestParseURLEncoded requestParseBody'],
  routes: [
    "GET /health PublicController.healthCheck",
    "POST /sales/record formidable SalesController.record",
  ],
  postMiddlewares: []
}
