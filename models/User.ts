const mongoose = require('mongoose')

const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String,
})

module.exports = User

const Projeto = mongoose.model('Projeto', {
    nome: String,
    tempoGasto: [{
        data: Date,
        tempo: Number
    }]
})
 
module.exports = Projeto