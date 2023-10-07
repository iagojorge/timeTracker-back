
const Projeto = mongoose.model('Projeto', {
    nome: String,
    tempo: Number,
    tempoTotal: Number,
    tempoDia: Number,
})

module.exports = Projeto