import { DayTimeResponse } from "../api/dto/response/dashboard/day.time.response";
import { TimeSpent } from "../../shared/types/time.spent";
import { IProject, Project } from "../models/Project";

class DashboardService {
  getDashboardData = async (
    userId: string,
    formattedDate: string,
    todayDate: Date
  ) => {
    const todayTime = await this.getTodayTime(userId, formattedDate);
    const monthTime = await this.getMonthTime(userId, formattedDate);
    const weekTimeArray = await this.getWeekTimeArray(userId, todayDate);
    const weekTime = weekTimeArray.reduce((total, day) => total + day.time, 0);

    return {
      weekTimeArray,
      weekTime: DateUtils.convertTimestampToTimeString(weekTime),
      monthTime: DateUtils.convertTimestampToTimeString(monthTime),
      todayTime: DateUtils.convertTimestampToTimeString(todayTime),
    };
  };

  private _calculateTotalTime = (projects: any, date: any) => {
    let totalTime: number = 0;
    projects.forEach((project: IProject) => {
      project.timeSpent.forEach((timeSpent: TimeSpent) => {
        if (timeSpent.date === date && timeSpent.time) {
          totalTime += timeSpent.time;
        }
      });
    });
    return totalTime;
  };

  getTodayTime = async (userId: string, formattedDate: string) => {
    const projectsToday = await Project.find({
      $and: [{ "timeSpent.date": formattedDate }, { userId: userId }],
    });
    return this._calculateTotalTime(projectsToday, formattedDate);
  };

  getMonthTime = async (userId: string, formattedDate: string) => {
    const projectsMonth = await Project.find({
      $and: [
        { "timeSpent.date": { $regex: `${formattedDate.slice(3, 10)}.*` } },
        { userId: userId },
      ],
    });
    return this._calculateTotalTime(projectsMonth, formattedDate);
  };

  getWeekTimeArray = async (userId: string, todayDate: Date) => {
    const weekTimeArray: DayTimeResponse[] = [];

    for (const day of Object.values(DayOfWeek)) {
      todayDate.setDate(todayDate.getDate() - 1);
      const dateToFind = DateUtils.formatDate(new Date(todayDate), "pt-BR");
      const projectsDay = await Project.find({
        $and: [{ "timeSpent.date": dateToFind }, { userId: userId }],
      });

      const time = this._calculateTotalTime(projectsDay, dateToFind);

      weekTimeArray.push({
        name: DayOfWeek[todayDate.getDay()],
        time: time,
      } as DayTimeResponse);
    }

    return weekTimeArray;
  };
}

export default DashboardService;
