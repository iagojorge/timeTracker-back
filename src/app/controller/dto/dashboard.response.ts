import { DayTime } from "../../interface/day.time";

export interface DashboardResponse {
  weekTimeArray: DayTime[];
  weekTime: string;
  monthTime: string;
  todayTime: string;
}
