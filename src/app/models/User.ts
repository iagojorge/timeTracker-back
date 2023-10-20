import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    name: String,
    email: String,
    password: String,
  },
  {
    collection: "users",
  }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export { User };
