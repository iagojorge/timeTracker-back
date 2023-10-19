"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projeto = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.Projeto = mongoose_1.default.model('Projeto', new mongoose_1.default.Schema({
    nome: String,
    tempoGasto: [{
            data: String,
            tempo: Number
        }],
    userId: String,
}, {
    collection: 'projetos'
}));
