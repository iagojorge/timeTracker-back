const Pmongoose = require('./mongoose')

const Projeto = Pmongoose.model('Projeto', new Pmongoose.Schema({
    nome: String,
    tempoGasto: [{
        data: Date,
        tempo: Number
    }]
  }, {
    collection: 'projetos'
  }));
 
module.exports = Projeto