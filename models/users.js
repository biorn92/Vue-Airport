const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {type: String, required: true},
  surname: {type: String, required: true},
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  books: [{type: Schema.Types.ObjectId, ref: 'Book'}],
  ceckin: {type: Boolean, default: false}
})
module.exports = mongoose.model('User', UserSchema)
