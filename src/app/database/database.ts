import { Response } from "express";
import mongoose from "mongoose";

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

function connectDatabase() {
  mongoose
    .connect(
      `mongodb+srv://${dbUser}:${dbPass}@timetracker.tmqoqet.mongodb.net/?retryWrites=true&w=majority`
    )
    .then(() => {
      console.log("Conectou ao banco");
    })
    .catch((err: Response) => console.log(err));
}

export default connectDatabase;