"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.privada = exports.publica = exports.login = exports.register = void 0;
/* Imports */
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const User_1 = require("../models/User");
dotenv.config();
const secret = process.env.SECRET || '';
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, confirmPassword } = req.body;
    //validations
    if (!name) {
        return res.status(422).json({ msg: "O nome é obrigatório!", type: 3 });
    }
    if (!email) {
        return res.status(422).json({ msg: "O E-mail é obrigatório!", type: 4 });
    }
    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatório!", type: 5 });
    }
    if (password !== confirmPassword) {
        return res.status(422).json({ msg: "As senhas não conferem!", type: 6 });
    }
    const userExists = yield User_1.User.findOne({ email: email });
    if (userExists) {
        return res.status(422).json({ msg: "E-mail já cadastrado!", type: 4 });
    }
    // create passowrd
    const salt = yield bcrypt_1.default.genSalt(12);
    const passwordHash = yield bcrypt_1.default.hash(password, salt);
    // create user
    const user = new User_1.User({
        name,
        email,
        password: passwordHash,
    });
    try {
        yield user.save();
        res.status(201).json({ msg: "Usuário criado com sucesso!" });
    }
    catch (error) {
        res
            .status(500)
            .json({ msg: "Erro no servidor, tente novamente mais tarde!" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email) {
        return res.status(422).json({ msg: "O E-mail é obrigatório!", type: 1 });
    }
    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatório!", type: 2 });
    }
    const user = yield User_1.User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ msg: "E-mail não existe!", type: 1 });
    }
    // check passwrod
    const checkPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!checkPassword) {
        return res.status(422).json({ msg: "Senha inválida!", type: 2 });
    }
    try {
        const name = user.name;
        const id = user.id;
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
        }, secret);
        res.status(200).json({ msg: "Login realizado com sucesso", token, name, id });
    }
    catch (error) {
        res
            .status(500)
            .json({ msg: "Erro no servidor, tente novamente mais tarde!" });
    }
});
exports.login = login;
const publica = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send({ msg: "bem vindo" });
});
exports.publica = publica;
const privada = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield User_1.User.findById(id, "-password");
    if (!user) {
        return res.status(404).json({ msg: "Usuário não existe!" });
    }
    res.status(200).json({ user });
});
exports.privada = privada;
