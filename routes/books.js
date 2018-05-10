var express = require('express')
var router = express.Router()
var Book = require('../models/books')
var Company = require('../models/companies')
var bcryptjs = require('bcryptjs')
var jwt = require('jwt-simple')
var secret = 'xxx'
var auth = require('../middlewares/auth')
var authFlight = require('../middlewares/authFlight')

router.get('/', function (req, res, next) {
  Book.find(function (err, books) {
    if (err) return res.status(500).json({error: err})
    res.json(books)
  })
})

router.get('/:id', auth.verify, function (req, res, next) {
  Book.findOne({_id: req.params.id})
    .populate('flight', 'companyName date departures arrivals price -_id').exec(function (err, book) {
      if (err) return res.status(500).json({error: err})
      if (!book) return res.status(404).json({message: 'Book not found'})
      res.json(book)
    })
})

router.post('/:id', auth.verify, authFlight.getFlightById, function (req, res, next) {
  var book = new Book()
  book.owner = req.user._id
  book.flight = req.flight._id
  book.seat++
  book.save(function (err, bookSaved) {
    if (err) return res.status(500).json({message: err})
    req.flight.books.push(bookSaved._id)
    req.flight.save(function (err, flightSaved) {
      if (err) return res.status(500).json({message: err})
      req.user.books.push(bookSaved._id)
      req.user.save(function (err, userSaved) {
        if (err) return res.status(500).json({message: err})
        res.status(201).json(bookSaved)
      })
    })
  })
})

router.delete('/:id', function (req, res, next) {
  Book.findOne({_id: req.params.id}, function (err, books) {
    if (err) return res.status(500).json({error: err})
    if (!books) return res.status(404).json({message: 'Book non trovato'})
    Book.remove(books, function (err) {
      if (err) return res.status(500).json({error: err})
      res.json({message: 'Book eliminata correttamente'})
    })
  })
})
module.exports = router
