/* Imports */
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv" 

dotenv.config()
const secret = process.env.SECRET || '';

export function checkToken(req: Request, res: Response, next: NextFunction) {
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