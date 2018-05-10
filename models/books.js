const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookSchema = new Schema({
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  flight: {type: Schema.Types.ObjectId, ref: 'Flight'},
  seat: {type: Number, default: 0, max: 30}
})
module.exports = mongoose.model('Book', BookSchema)
