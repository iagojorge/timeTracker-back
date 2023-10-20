import { Router } from "express";
import DashboardController from "../api/dashboard.controller";

const dashboardRouter = Router();
const dashboardController = new DashboardController();

dashboardRouter.get("/list", dashboardController.getDashboard);

export default dashboardRouter;
