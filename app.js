var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/fakeAirport')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
var users = require('./routes/users')
var flights = require('./routes/flights')
var books = require('./routes/books')
var companies = require('./routes/companies')

app.use('/users', users)
app.use('/flights', flights)
app.use('/books', books)
app.use('/companies', companies)

var port = 3001
app.listen(port, () => { console.log('server start at port:', port) })
module.exports = app
