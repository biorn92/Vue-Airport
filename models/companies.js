const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CompanySchema = new Schema({
  name: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  flights: [{type: Schema.Types.ObjectId, ref: 'Flight'}]
})
module.exports = mongoose.model('Company', CompanySchema)
