const Pmongoose = require('./mongoose')

const Projeto = Pmongoose.model('Projeto', new Pmongoose.Schema({
    nome: String,
    tempoGasto: [{
        data: String,
        tempo: Number
    }],
    userId: String, 
  }, {
    collection: 'projetos'
  }));
 
module.exports = Projeto