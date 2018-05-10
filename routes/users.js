var express = require('express')
var router = express.Router()
var User = require('../models/users')
var Flight = require('../models/flights')
var bcryptjs = require('bcryptjs')
var jwt = require('jwt-simple')
var secret = 'xxx'
var auth = require('../middlewares/auth')

router.get('/', function (req, res, next) {
  User.find(function (err, users) {
    if (err) return res.status(500).json({error: err})
    res.json(users)
  })
})

router.get('/singleUser/:id', function (req, res, next) {
  User.findOne({_id: req.params.id})
    .populate('books', 'flight -_id')
    .exec(function (err, users) {
      if (err) return res.status(500).json({error: err})
      if (!users) return res.status(404).json({message: 'Utente non trovato'})
      res.json(users)
    })
})

router.get('/:departures/:arrivals', function (req, res, next) {
  Flight.findOne({departures: req.params.departures, arrivals: req.params.arrivals})
    .populate('companyName', 'name -_id')
    .sort({price: 1})
    .exec(function (err, flights) {
      if (err) return res.status(500).json({error: err})
      if (!flights) return res.status(404).json({message: 'Flight non trovato'})
      res.json(flights)
    })
})

router.get('/me', auth.verify, function (req, res, next) {
  res.json(req.user)
})

router.post('/signup', function (req, res, next) {
  var user = new User(req.body)
  user.password = bcryptjs.hashSync(req.body.password, 10)
  user.save((err) => {
    if (err) return res.status(500).json({message: err})
    res.status(201).json({message: 'User created'})
  })
})

router.post('/login', function (req, res, next) {
  if (req.body.email === undefined || req.body.password === undefined) {
    return res.status(400).json({message: 'email and password are required'})
  }
  User.findOne({email: req.body.email}, function (err, user) {
    if (err) return res.status(500).json({message: err})
    if (!user) return res.status(404).json({message: `User not found with email ${req.body.email}`})
    if (bcryptjs.compareSync(req.body.password, user.password)) {
      return res.json({token: jwt.encode(user._id, secret)})
    } else {
      return res.status(401).json({message: 'password incorrect'})
    }
  })
})

router.put('/password', auth.verify, function (req, res, next) {
  var user = req.user
  user.password = bcryptjs.hashSync(req.body.password, 10)
  user.save(function (err) {
    if (err) return res.status(500).json({error: err})
    res.json(user)
  })
})

router.put('/ceckin', auth.verify, function (req, res, next) {
  var user = req.user
  user.ceckin = true
  user.save(function (err) {
    if (err) return res.status(500).json({error: err})
    res.json(user)
  })
})

router.delete('/:id', function (req, res, next) {
  User.findOne({_id: req.params.id}, function (err, users) {
    if (err) return res.status(500).json({error: err})
    if (!users) return res.status(404).json({message: 'User non trovato'})
    User.remove(users, function (err) {
      if (err) return res.status(500).json({error: err})
      res.json({message: 'User eliminato correttamente'})
    })
  })
})

module.exports = router
