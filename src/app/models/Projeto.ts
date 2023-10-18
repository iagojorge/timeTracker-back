import mongoose from "mongoose";

export const Projeto = mongoose.model('Projeto', new mongoose.Schema({
    nome: String,
    tempoGasto: [{
        data: String,
        tempo: Number
    }],
    userId: String, 
  }, {
    collection: 'projetos'
  }));
  
 
