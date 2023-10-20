import { Router } from "express";
import { dashboard } from "../controller/dashboard.controller";

const dashboardRouter = Router();

dashboardRouter.get("/list", dashboard);

export default dashboardRouter;