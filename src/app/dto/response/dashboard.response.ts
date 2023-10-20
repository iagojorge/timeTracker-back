import { DayTime } from "../../../shared/types/day.time";

export interface DayTimeResponse extends DayTime {}

export interface DashboardResponse {
  weekTimeArray: DayTimeResponse[];
  weekTime: string;
  monthTime: string;
  todayTime: string;
}
