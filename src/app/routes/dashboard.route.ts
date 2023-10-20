import { Router } from "express";
import DashboardController from "../controller/dashboard.controller";

const dashboardRouter = Router();
const dashboardController = new DashboardController();

dashboardRouter.get("/list", dashboardController.getDashboard);

export default dashboardRouter;
