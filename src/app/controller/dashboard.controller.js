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
exports.dashboard = void 0;
const Projeto_1 = require("../models/Projeto");
const dashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ erro: 'É necessário fornecer um userId na solicitação.' });
        }
        const dataFormatada = new Date().toLocaleDateString('pt-BR');
        const datahoje = new Date();
        //PEGA TODO O TEMPO APONTADO HOJE E TODO TEMPO APOSTANDO HOJE POR PROJETO
        const projetosDia = yield Projeto_1.Projeto.find({
            $and: [
                { "tempoGasto.data": dataFormatada },
                { userId: userId }
            ]
        });
        let tempoHoje = 0;
        projetosDia.forEach(projeto => {
            projeto.tempoGasto.forEach(tempoGasto => {
                if (tempoGasto.data == dataFormatada && tempoGasto.tempo) {
                    tempoHoje += tempoGasto.tempo;
                }
            });
        });
        //PEGA TODO O TEMPO APONTADO NO MÊS
        const projetosMês = yield Projeto_1.Projeto.find({
            $and: [
                { "tempoGasto.data": { $regex: `${dataFormatada.slice(3, 10)}.*` } },
                { userId: userId }
            ]
        });
        let tempoMes = 0;
        projetosMês.forEach(projeto => {
            projeto.tempoGasto.forEach(tempoGasto => {
                if (tempoGasto.tempo) {
                    tempoMes += tempoGasto.tempo;
                }
            });
        });
        //PEGA TODO O TEMPO APONSTADO NA SEMANA
        let tempoSemana = 0;
        const semanaTempo = [];
        const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        let tempo = 0;
        for (const dia of diasDaSemana) {
            datahoje.setDate(datahoje.getDate() - 1);
            const dataFind = new Date(datahoje).toLocaleDateString('pt-BR');
            const projetosDia = yield Projeto_1.Projeto.find({
                $and: [
                    { "tempoGasto.data": dataFind },
                    { userId: userId }
                ]
            });
            projetosDia.forEach(projeto => {
                projeto.tempoGasto.forEach(tempoGasto => {
                    if (tempoGasto.data == dataFind && tempoGasto.tempo) {
                        tempo += tempoGasto.tempo;
                    }
                });
            });
            semanaTempo.push({
                nome: diasDaSemana[datahoje.getDay()],
                tempo: tempo
            });
            tempoSemana += tempo;
            tempo = 0;
        }
        const response = {
            semanaTempo,
            tempoSemana: new Date(tempoSemana * 1000).toISOString().substr(11, 8),
            tempoMes: new Date(tempoMes * 1000).toISOString().substr(11, 8),
            tempoHoje: new Date(tempoHoje * 1000).toISOString().substr(11, 8),
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro ao listar os documentos' });
    }
});
exports.dashboard = dashboard;
