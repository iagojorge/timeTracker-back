import { TimeSpent } from "../../models/Project";

export interface ProjectRequest {
  name: string;
  timeSpent: TimeSpent[];
  userId: string;
}
