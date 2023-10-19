"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.excluir = exports.listar = exports.editar = exports.adicionar = void 0;
const Projeto_1 = require("../models/Projeto");
const adicionar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, userId } = req.body;
    //validations
    if (!nome) {
        return res.status(422).json({ msg: "O nome é obrigatório!" });
    }
    // create projeto
    const projeto = new Projeto_1.Projeto({
        nome,
        userId
    });
    try {
        yield projeto.save();
        res.status(201).json({ msg: "Projeto criado com sucesso!" });
    }
    catch (error) {
        res
            .status(500)
            .json({ msg: "Erro no servidor, tente novamente mais tarde!" });
    }
});
exports.adicionar = adicionar;
const editar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const projetoTempo = yield Projeto_1.Projeto.findById(id);
    if (req.body.tempoGasto) {
        projetoTempo === null || projetoTempo === void 0 ? void 0 : projetoTempo.tempoGasto.push(req.body.tempoGasto);
    }
    const projeto = {
        nome: req.body.nome,
        tempoGasto: projetoTempo === null || projetoTempo === void 0 ? void 0 : projetoTempo.tempoGasto
    };
    const updatedProjeto = yield Projeto_1.Projeto.findByIdAndUpdate(id, projeto);
    if (!updatedProjeto) {
        return res.status(404).json({ msg: "Projeto não encontrado!" });
    }
    res.status(200).json({ projeto, msg: "Projeto atualizado com sucesso" });
});
exports.editar = editar;
const listar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        const filtro = req.query.filtro;
        let projetos = [];
        if (!userId) {
            return res.status(400).json({ erro: 'É necessário fornecer um userId na solicitação.' });
        }
        if (filtro) {
            const filtroString = typeof filtro === 'string' ? filtro : filtro.toString();
            projetos = yield Projeto_1.Projeto.find({ userId: userId, nome: { $regex: new RegExp(filtroString, 'i') } });
        }
        else {
            projetos = yield Projeto_1.Projeto.find({ userId: userId });
        }
        let tempoProjeto = 0;
        let tempoHojeP = 0;
        const dataFormatada = new Date().toLocaleDateString('pt-BR');
        const projetoTempo = [];
        projetos.forEach(projeto => {
            projeto.tempoGasto.forEach(tempoGasto => {
                if (tempoGasto.tempo) {
                    if (tempoGasto.data == dataFormatada) {
                        tempoHojeP += tempoGasto.tempo;
                    }
                    tempoProjeto += tempoGasto.tempo;
                }
            });
            if (projeto.nome) {
                projetoTempo.push({ nome: projeto.nome, tempo: tempoProjeto, tempoHoje: tempoHojeP, _id: projeto._id });
            }
            tempoProjeto = 0;
            tempoHojeP = 0;
        });
        const dto = {
            projetoTempo: projetoTempo,
            projetos: projetos
        };
        res.json(dto);
    }
    catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro ao listar os documentos' });
    }
});
exports.listar = listar;
const excluir = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const projeto = yield Projeto_1.Projeto.findById(id);
        if (!projeto) {
            return res.status(404).json({ msg: "Projeto não encontrado!" });
        }
        const deletedProjeto = yield Projeto_1.Projeto.findByIdAndDelete(id);
        res.status(200).json({ deletedProjeto, msg: "Projeto deletado com sucesso!" });
    }
    catch (error) {
    }
});
exports.excluir = excluir;
