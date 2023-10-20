import { DayTimeResponse } from "./day.time.response";

export interface DashboardResponse {
  weekTimeArray: DayTimeResponse[];
  weekTime: string;
  monthTime: string;
  todayTime: string;
}
