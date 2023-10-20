import { Router } from "express";
import { privada, publica } from "../api/user.controller";
import { checkToken } from "../service/user.service";

const userRouter = Router();

userRouter.get("/", publica);
userRouter.get("/:id", checkToken, privada);

export default userRouter;