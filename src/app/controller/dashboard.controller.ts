/* Imports */
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from 'cors';
import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv" 


// Models
import  { Projeto }  from "../models/Projeto";
import { User } from "../models/User";
import { ProjetoDash } from "../interface/Projeto.interface";

