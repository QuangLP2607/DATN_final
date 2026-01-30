import { AdminModel, StudentModel, TeacherModel } from "../models/User";
import { Role, IUserBase } from "../interfaces/user";
import { Model } from "mongoose";

export const getModelByRole = (role: Role): Model<IUserBase> => {
  switch (role) {
    case "ADMIN":
      return AdminModel;
    case "STUDENT":
      return StudentModel;
    case "TEACHER":
      return TeacherModel;
    default:
      throw new Error("Invalid role");
  }
};
