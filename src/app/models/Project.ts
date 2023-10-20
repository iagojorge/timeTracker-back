import mongoose, { Document, Schema } from "mongoose";

interface TimeSpent {
  date: string;
  time: number;
}

interface ProjectDocument extends Document {
  name: string;
  timeSpent: TimeSpent[];
  userId: string;
}

const projectSchema = new Schema<ProjectDocument>(
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

const Project = mongoose.model<ProjectDocument>("Project", projectSchema);

export { Project, ProjectDocument, TimeSpent };

