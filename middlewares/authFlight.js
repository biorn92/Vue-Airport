var Flight = require('../models/flights')

var getFlightById = function (req, res, next) {
  Flight.findById(req.params.id).populate({
    path: 'companyName', select: 'name'
  }).exec(function (err, flight) {
    if (err) return res.status(500).json({message: err})
    if (!flight) return res.status(404).json({message: 'House not found'})
    req.flight = flight
    next()
  })
}

module.exports.getFlightById = getFlightById
