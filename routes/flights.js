var express = require('express')
var router = express.Router()
var Flight = require('../models/flights')
var Company = require('../models/companies')
var authCompany = require('../middlewares/authCompany')
var authFlight = require('../middlewares/authFlight')

router.get('/', function (req, res, next) {
  Flight.find(function (err, flights) {
    if (err) return res.status(500).json({error: err})
    res.json(flights)
  })
})

router.get('/:id', authFlight.getFlightById, function (req, res, next) {
  res.json(req.flight)
})

router.post('/', authCompany.verify, function (req, res, next) {
  var flights = new Flight()
  flights.date = req.body.date
  flights.departures = req.body.departures
  flights.arrivals = req.body.arrivals
  flights.price = req.body.price
  flights.companyName = req.company._id
  flights.save(function (err, flySaved) {
    if (err) return res.status(500).json({message: err})
    req.company.flights.push(flySaved._id)
    req.company.save(function (err, companySaved) {
      if (err) return res.status(500).json({message: err})
      res.status(201).json(flySaved)
    })
  })
})

router.delete('/:id', authCompany.verify, function (req, res, next) {
  Flight.findOne({_id: req.params.id}, function (err, flights) {
    if (err) return res.status(500).json({error: err})
    if (!flights) return res.status(404).json({message: 'Flight non trovato'})
    Company.findByIdAndUpdate(req.company._id,
      { $pull: { 'flights': {$in: [req.params.flight]} } }, function (err, companies) {
        if (err) {
          console.log(err)
          return res.send(err)
        }
      })
    Flight.remove(flights, function (err) {
      if (err) return res.status(500).json({error: err})
      res.json({message: 'Flight eliminata correttamente'})
    })
  })
})

module.exports = router
