"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Imports */
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const user_service_1 = require("./src/app/service/user.service");
const user_controller_1 = require("./src/app/controller/user.controller");
const projeto_controller_1 = require("./src/app/controller/projeto.controller");
const dashboard_controller_1 = require("./src/app/controller/dashboard.controller");
const app = (0, express_1.default)();
const dbUser = process.env.DB_USER || '';
const dbPass = process.env.DB_PASS || '';
app.use((0, cors_1.default)({ origin: 'http://localhost:8080' }));
app.use(express_1.default.json());
app.get("/", user_controller_1.publica);
app.get("/user/:id", user_service_1.checkToken, user_controller_1.privada);
app.post("/auth/register", user_controller_1.register);
app.post("/auth/login", user_controller_1.login);
app.post("/projetos", projeto_controller_1.adicionar);
app.get("/projetos/list", projeto_controller_1.listar);
app.delete("/projetos/:id", projeto_controller_1.excluir);
app.put("/projetos/:id", projeto_controller_1.editar);
app.get("/dashboard/list", dashboard_controller_1.dashboard);
mongoose_1.default
    .connect(`mongodb+srv://${dbUser}:${dbPass}@timetracker.tmqoqet.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
    app.listen(3000);
    console.log("Conectou ao banco");
})
    .catch((err) => console.log(err));
