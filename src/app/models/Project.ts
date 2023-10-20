import mongoose, { Document, Model, Schema } from "mongoose";
import { TimeSpent } from "../../shared/types/time.spent";

interface IProject extends Document {
  name: string;
  timeSpent: TimeSpent[];
  userId: string;
}

const projectSchema = new Schema<IProject>(
  {
    name: String,
    timeSpent: [
      {
        date: String,
        time: Number,
      },
    ],
    userId: String,
  },
  {
    collection: "projects",
  }
);

const Project: Model<IProject> = mongoose.model<IProject>(
  "Project",
  projectSchema
);

export { IProject, Project, TimeSpent };
