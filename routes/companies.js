var express = require('express')
var router = express.Router()
var Company = require('../models/companies')
var bcryptjs = require('bcryptjs')
var jwt = require('jwt-simple')
var secret = 'xxx'
var authCompany = require('../middlewares/authCompany')


router.get('/', function (req, res, next) {
  Company.find(function (err, companies) {
    if (err) return res.status(500).json({error: err})
    res.json(companies)
  })
})

router.get('/singleCompany/:id', authCompany.verify, function (req, res, next) {
  Company.findOne({_id: req.params.id})
    .populate('flights', 'books')
    .exec(function (err, company) {
      if (err) return res.status(500).json({error: err})
      if (!company) return res.status(404).json({message: 'Utente non trovato'})
      res.json(company)
    })
})

router.post('/signupCompany', function (req, res, next) {
  var company = new Company(req.body)
  company.password = bcryptjs.hashSync(req.body.password, 10)
  company.save((err) => {
    if (err) return res.status(500).json({message: err})
    res.status(201).json({message: 'Company created'})
  })
})
router.get('/meCompany', authCompany.verify, function (req, res, next) {
  res.json(req.company)
})

router.post('/loginCompany', function (req, res, next) {
  if (req.body.name === undefined || req.body.password === undefined) {
    return res.status(400).json({message: 'name and password are required'})
  }
  Company.findOne({name: req.body.name}, function (err, company) {
    if (err) return res.status(500).json({message: err})
    if (!company) return res.status(404).json({message: `Company not found with name ${req.body.name}`})
    if (bcryptjs.compareSync(req.body.password, company.password)) {
      return res.json({token: jwt.encode(company._id, secret)})
    } else {
      return res.status(401).json({message: 'password incorrect'})
    }
  })
})

router.delete('/:id', function (req, res, next) {
  Company.findOne({_id: req.params.id}, function (err, companies) {
    if (err) return res.status(500).json({error: err})
    if (!companies) return res.status(404).json({message: 'Company non trovata'})
    Company.remove(companies, function (err) {
      if (err) return res.status(500).json({error: err})
      res.json({message: 'Company eliminata correttamente'})
    })
  })
})
module.exports = router
