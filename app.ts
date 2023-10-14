/* Imports */
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from 'cors';
import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv"


// Models
import  { Projeto }  from "./src/app/models/Projeto";
import { User } from "./src/app/models/User";
import { ProjetoDash } from "./src/app/interface/Projeto.interface";


const app = express();

// Config Json response
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json());

//Credenciais
dotenv.config()
const dbUser = process.env.DB_USER || '';
const dbPass = process.env.DB_PASS || '';
const secret = process.env.SECRET || '';


// rota publica
app.get("/", (req: Request, res: Response) => {
  res.status(200).send({ msg: "bem vindo a nossa API" });
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

// valida o token do usuario
function checkToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado!" });
  }

  try {
    jwt.verify(token, secret);

    next();
  } catch (error) {
    res.status(400).json({ msg: "Token inválido!" });
  }
}

// Register User
app.post("/auth/register", async (req: Request, res: Response) => {
  const { name, email, password, confirmPassword } = req.body;

  //validations
  if (!name) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }

  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatório!" });
  }

  if (password !== confirmPassword) {
    return res.status(422).json({ msg: "As senhas não conferem!" });
  }

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({ msg: "E-mail já cadastrado!" });
  }

  // create passowrd
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // create user
  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();
    res.status(201).json({ msg: "Usuário criado com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Erro no servidor, tente novamente mais tarde!" });
  }
});

// Login User
app.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatório!" });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "Usuário não existe!" });
  }

  // check passwrod
  const checkPassword =  bcrypt.compare(password, user.password!);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha inválida!" });
  }

  try {

    const name = user.name

    const id = user.id

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res.status(200).json({ msg: "Login realizado com sucesso", token, name, id });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Erro no servidor, tente novamente mais tarde!" });
  }
});

// Adicioanr Projeto
app.post("/projetos", async(req: Request, res: Response) => {
  const { nome, userId } = req.body;

    //validations
    if (!nome) {
      return res.status(422).json({ msg: "O nome é obrigatório!" });
    }

   // create projeto
   const projeto = new Projeto({
    nome, 
    userId
  });

  try {
    await projeto.save();
    res.status(201).json({ msg: "Projeto criado com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Erro no servidor, tente novamente mais tarde!" });
  }
})

// Listar Projeto
app.get("/projetos/list", async(req: Request, res: Response) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ erro: 'É necessário fornecer um userId na solicitação.' });
    }

    const projetos = await Projeto.find({ userId: userId });

    if (projetos.length === 0) {
      return res.status(404).json({ erro: 'Nenhum projeto encontrado para o userId especificado.' });
    }

    res.json(projetos);
  } catch (error) {
    res.status(500).json({ erro: 'Ocorreu um erro ao listar os documentos' });
  }
});

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

// Excluir Projeto
app.delete("/projetos/:id", async(req: Request, res: Response) => {
  try {
    const id = req.params.id

    const projeto = await Projeto.findById(id)

    if(!projeto){
      return res.status(404).json({msg: "Projeto não encontrado!"})
    }

    const deletedProjeto = await Projeto.findByIdAndDelete(id)

    res.status(200).json({deletedProjeto, msg: "Projeto deletado com sucesso!"})
    
  } catch (error) {
    
  }
})

// Editar Projeto
app.put("/projetos/:id", async(req: Request, res: Response) => {
  const id = req.params.id
  const { nome } = req.body;

  const projeto = {
    nome: req.body.nome,
    tempoGasto: req.body.tempoGasto
  }

  const updatedProjeto = await Projeto.findByIdAndUpdate(id, projeto)
  
  if(!updatedProjeto){
    return res.status(404).json({msg: "Projeto não encontrado!"})
  }

  res.status(200).json({projeto, msg:"Projeto atualizado com sucesso"})
})

// Rotes


mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPass}@timetracker.tmqoqet.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
    console.log("Conectou ao banco");
  })
  .catch((err: Response) => console.log(err));
