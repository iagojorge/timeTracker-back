import { Router } from "express";
import { default as authRouter, default as userRouter } from "./auth.route";
import dashboardRouter from "./dashboard.route";
import projetoRouter from "./projeto.route";

const router = Router();

router.use("/projetos", projetoRouter);
router.use("/dashboard", dashboardRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);

export default router;
