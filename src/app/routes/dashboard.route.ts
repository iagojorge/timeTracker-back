import { Router } from "express";
import DashboardApi from "../api/dashboard.api";

const dashboardRouter = Router();
const dashboardApi = new DashboardApi();

dashboardRouter.get("/list", dashboardApi.getDashboard);

export default dashboardRouter;
