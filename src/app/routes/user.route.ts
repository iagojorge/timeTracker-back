import { Router } from "express";
import { login, register } from "../controller/user.controller";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

export default authRouter;