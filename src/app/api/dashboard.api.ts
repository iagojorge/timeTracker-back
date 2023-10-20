import { Request, Response } from "express";
import { DashboardResponse } from "./dto/response/dashboard.response";
import BaseApi from "../service/base.api";
import DashboardService from "../service/dashboard.service";

class DashboardApi extends BaseApi {
  private dashboardService: DashboardService;

  constructor() {
    super();
    this.dashboardService = new DashboardService();
  }

  getDashboard = async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        return this.sendBadRequest(res, ErrorMessage.MISSING_USER_ID);
      }

      const { formattedDate, todayDate } =
        DateUtils.getFormattedAndCurrentDate();
      const { weekTimeArray, weekTime, monthTime, todayTime } =
        await this.dashboardService.getDashboardData(
          userId,
          formattedDate,
          todayDate
        );

      const response: DashboardResponse = {
        weekTimeArray,
        weekTime,
        monthTime,
        todayTime,
      };

      res.json(response);
    } catch (error) {
      this.sendInternalServerError(res, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
  };
}

export default DashboardApi;
