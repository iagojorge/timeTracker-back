import { TimeSpent } from "../types/time.spent";

export interface ProjectFilter {
  id: string;
  name: string;
  timeSpent: TimeSpent[];
  userId: string;
}
