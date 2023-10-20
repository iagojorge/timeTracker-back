import { Router } from "express";
import authRouter from "./auth.route";
import dashboardRouter from "./dashboard.route";
import projetoRouter from "./projeto.route";
import userRouter from "./user.route";

const router = Router();

router.use("/projetos", projetoRouter);
router.use("/dashboard", dashboardRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);

export default router;
