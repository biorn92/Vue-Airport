const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FlightSchema = new Schema({
  date: {type: Date, required: true},
  departures: {type: String, required: true},
  arrivals: {type: String, required: true},
  price: {type: Number, required: true},
  companyName: {type: Schema.Types.ObjectId, ref: 'Company'},
  books: [{type: Schema.Types.ObjectId, ref: 'Book'}]
})
module.exports = mongoose.model('Flight', FlightSchema)
