import cors from 'cors';
import express from "express";
import connectDatabase from "./app/database/database";
import router from './app/routes/routes';

const app = express();

connectDatabase();
app.listen(3000);
app.use(cors({ origin: 'https://iago-alura-tracker.vercel.app' }));
app.use(express.json());
app.use(router);