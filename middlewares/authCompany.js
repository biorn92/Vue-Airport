var Company = require('../models/companies')
var jwt = require('jwt-simple')
var secret = 'xxx'

var verify = function (req, res, next) {
  if (req.query.token === undefined) return res.status(401).json({message: 'Unothorized'})
  var id = jwt.decode(req.query.token, secret)
  Company.findById(id, function (err, company) {
    if (err) return res.status(500).json({message: err})
    req.company = company
    next()
  })
}

module.exports.verify = verify
module.exports.secret = secret
