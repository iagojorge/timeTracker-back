/* Imports */

import { Request, Response, NextFunction } from "express";
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// Config Json response
app.use(express.json());

// Models
const User = require("./models/User");

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

function checkToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado!" });
  }

  try {
    const secret = process.env.SECRET;
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
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha inválida!" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res.status(200).json({ msg: "Login realizado com sucesso", token });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Erro no servidor, tente novamente mais tarde!" });
  }
});

// Rotes


//Credenciais
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPass}@timetracker.tmqoqet.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
    console.log("Conectou ao banco");
  })
  .catch((err: Response) => console.log(err));
