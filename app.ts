/* Imports */
import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import { Request, Response } from "express";
import { checkToken } from "./src/app/service/user.service";


// Models
import  { Projeto }  from "./src/app/models/Projeto";
import { User } from "./src/app/models/User";
import { ProjetoDash } from "./src/app/interface/Projeto.interface";
import { login, register } from "./src/app/controller/user.controller";
import {adicionar, listar, excluir, editar} from "./src/app/controller/projeto.controller"

const app = express();
const dbUser = process.env.DB_USER || '';
const dbPass = process.env.DB_PASS || '';

// rota publica
app.get("/", (req: Request, res: Response) => {
  res.status(200).send({ msg: "bem vindo" });
});

// rota privada
app.get("/user/:id", checkToken, async (req: Request, res: Response) => {
  const id = req.params.id;

  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "Usuário não existe!" });
  }

  res.status(200).json({ user });
});

// Config Json response
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json());

app.post("/auth/register", register);
app.post("/auth/login", login);

app.post("/projetos", adicionar);
app.get("/projetos/list", listar);
app.delete("/projetos/:id", excluir);
app.put("/projetos/:id", editar);

// Dados da dashboard
app.get("/dashboard/list",async (req: Request, res: Response) => {
  try {

    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ erro: 'É necessário fornecer um userId na solicitação.' });
    }

    const dataFormatada = new Date().toLocaleDateString('pt-BR')
    const datahoje = new Date()


    //PEGA TODO O TEMPO APONTADO HOJE E TODO TEMPO APOSTANDO HOJE POR PROJETO
    const projetosDia = await Projeto.find({ 
      $and: [
        { "tempoGasto.data": dataFormatada },
        { userId: userId }
      ]
    })

      let tempoHoje:number = 0

      projetosDia.forEach(projeto => {
        projeto.tempoGasto.forEach(tempoGasto =>{
          if(tempoGasto.data == dataFormatada && tempoGasto.tempo){
            tempoHoje += tempoGasto.tempo
          }
        })
      })

    //PEGA TODO O TEMPO APONTADO NO MÊS
    const projetosMês = await Projeto.find({
      $and: [
        { "tempoGasto.data": { $regex: `${dataFormatada.slice(3, 10)}.*` }},
        { userId: userId }
      ]
    })

    let tempoMes:number = 0

    projetosMês.forEach(projeto => {
     projeto.tempoGasto.forEach(tempoGasto =>{
      if(tempoGasto.tempo){
        tempoMes += tempoGasto.tempo
      }
     })
    })


    //PEGA TODO O TEMPO APONSTADO NA SEMANA
    let tempoSemana:number = 0
    const semanaTempo = []
    const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    let tempoHojeSemana:number = 0

    for (const dia of diasDaSemana){
      datahoje.setDate(datahoje.getDate() - 1);
      const dataFind = new Date(datahoje).toLocaleDateString('pt-BR')
      const projetosDia = await Projeto.find({
        $and: [
          { "tempoGasto.data": dataFind },
          { userId: userId }
        ]
      })

      projetosDia.forEach(projeto => {
        projeto.tempoGasto.forEach(tempoGasto => {
          if(tempoGasto.data == dataFind && tempoGasto.tempo){
            tempoHojeSemana += tempoGasto.tempo
          }
        });
      })

      semanaTempo.push({
        nome: diasDaSemana[datahoje.getDay()],
        tempoHojeSemana: tempoHojeSemana
      })
   
      tempoSemana += tempoHojeSemana
      tempoHojeSemana = 0
    }
    
    ///PEGA O TEMPOTOTAL DE CADA PROJETO
    const projetosTotal = await Projeto.find({ userId: userId })
    let tempoProjeto:number = 0
    const projetoTempo: ProjetoDash[] = []

    projetosTotal.forEach(projeto => {
      projeto.tempoGasto.forEach(tempoGasto => {
        if(tempoGasto.tempo){
          tempoProjeto += tempoGasto.tempo
        }
      })
      if(projeto.nome){
        projetoTempo.push({ nome: projeto.nome, tempo: tempoProjeto})
      }
      tempoProjeto = 0
    })
    
    const response = {
      projetoTempo,
      semanaTempo,
      tempoSemana: new Date(tempoSemana * 1000).toISOString().substr(11, 8),
      tempoMes: new Date(tempoMes * 1000).toISOString().substr(11, 8),
      tempoHoje: new Date(tempoHoje * 1000).toISOString().substr(11, 8),
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ erro: 'Ocorreu um erro ao listar os documentos' });
  }
})


mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPass}@timetracker.tmqoqet.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
    console.log("Conectou ao banco");
  })
  .catch((err: Response) => console.log(err));
