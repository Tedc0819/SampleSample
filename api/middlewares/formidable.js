const formidable = require('formidable')

module.exports = function(req, res, next) {
  const form = formidable({ multiples: true })

  form.parse(req, (err, fields, files) => {
    req.files = files

    if (err) { return next(err) }

    return next()
  })
}
