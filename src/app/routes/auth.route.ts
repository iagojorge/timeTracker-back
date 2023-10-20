import { Router } from "express";
import { privada, publica } from "../controller/user.controller";
import { checkToken } from "../service/user.service";

const userRouter = Router();

userRouter.get("/", publica);
userRouter.get("/:id", checkToken, privada);

export default userRouter;