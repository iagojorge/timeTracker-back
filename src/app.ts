/* Imports */
import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import { Response } from "express";
import { checkToken } from "./app/service/user.service";
import { login, privada, publica, register } from "./app/controller/user.controller";
import {adicionar, listar, excluir, editar} from "./app/controller/projeto.controller"
import { dashboard } from "./app/controller/dashboard.controller";

const app = express();
const dbUser = process.env.DB_USER || '';
const dbPass = process.env.DB_PASS || '';

app.use(cors({ origin: 'https://iago-alura-tracker.vercel.app' }));
app.use(express.json());

app.get("/", publica)
app.get("/user/:id", checkToken, privada)

app.post("/auth/register", register);
app.post("/auth/login", login);

app.post("/projetos", adicionar);
app.get("/projetos/list", listar);
app.delete("/projetos/:id", excluir);
app.put("/projetos/:id", editar);

app.get("/dashboard/list", dashboard);


mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPass}@timetracker.tmqoqet.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
    console.log("Conectou ao banco");
  })
  .catch((err: Response) => console.log(err));
