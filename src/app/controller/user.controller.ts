/* Imports */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import * as dotenv from "dotenv" 
import { User } from "../models/User";

dotenv.config()
const secret = process.env.SECRET || '';


export const register = async (req: Request, res: Response) => {
    const { name, email, password, confirmPassword } = req.body;

    //validations
    if (!name) {
      return res.status(422).json({ msg: "O nome é obrigatório!", type:3 });
    }
  
    if (!email) {
      return res.status(422).json({ msg: "O E-mail é obrigatório!", type:4 });
    }
  
    if (!password) {
      return res.status(422).json({ msg: "A senha é obrigatório!", type:5 });
    }
  
    if (password !== confirmPassword) {
      return res.status(422).json({ msg: "As senhas não conferem!", type:6 });
    }
  
    const userExists = await User.findOne({ email: email });
  
    if (userExists) {
      return res.status(422).json({ msg: "E-mail já cadastrado!", type:4 });
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
};

export const login = async (req: Request, res: Response) =>{
    const { email, password } = req.body;

    if (!email) {
      return res.status(422).json({ msg: "O E-mail é obrigatório!", type:1 });
    }
  
    if (!password) {
      return res.status(422).json({ msg: "A senha é obrigatório!", type:2 });
    }
  
    const user = await User.findOne({ email: email });
  
    if (!user) {
      return res.status(404).json({ msg: "E-mail não existe!", type:1 });
    }
  
    // check passwrod
    const checkPassword =  await bcrypt.compare(password, user.password!);

    if (!checkPassword) {
      return res.status(422).json({ msg: "Senha inválida!", type:2 });
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
};

export const publica = async (req: Request, res: Response) =>{
    res.status(200).send({ msg: "bem vindo" });
}

export const privada = async (req: Request, res: Response) =>{
    const id = req.params.id;

    const user = await User.findById(id, "-password");
  
    if (!user) {
      return res.status(404).json({ msg: "Usuário não existe!" });
    }
  
    res.status(200).json({ user });
}