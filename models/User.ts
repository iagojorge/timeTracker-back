const Umongoose = require('./mongoose')

const User = Umongoose.model('User', new Umongoose.Schema({
    name: String,
    email: String,
    password: String
  }, {
    collection: 'users'
  }));

module.exports = User