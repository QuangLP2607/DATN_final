import { Schema, model, Types } from "mongoose";
import {
  IUserBase,
  IAdmin,
  IStudent,
  ITeacher,
  Roles,
  JapaneseLevels,
  TeacherStatuses,
} from "../interfaces/user";

/* ----------------------------- BASE USER ----------------------------- */
const userSchema = new Schema<IUserBase>(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    avatar_id: {
      type: Types.ObjectId,
      ref: "Media",
    },

    role: {
      type: String,
      required: true,
      enum: Object.keys(Roles),
    },
  },
  {
    timestamps: true,
    discriminatorKey: "role",
    strict: true,
    strictQuery: true,
  }
);

export const UserModel = model<IUserBase>("User", userSchema, "users");

/* ------------------------------ ADMIN ------------------------------- */
const adminSchema = new Schema({});
export const AdminModel = UserModel.discriminator<IAdmin>("ADMIN", adminSchema);

/* ----------------------------- STUDENT ------------------------------ */
const studentSchema = new Schema<IStudent>({
  full_name: { type: String, default: "", trim: true },
  dob: Date,

  phone: {
    type: String,
    index: true,
    trim: true,
  },

  address: { type: String, trim: true },

  japaneseLevel: {
    type: String,
    enum: JapaneseLevels,
    default: JapaneseLevels[0],
  },

  note: { type: String, trim: true },
  lastLogin: Date,
});

export const StudentModel = UserModel.discriminator<IStudent>(
  "STUDENT",
  studentSchema
);

/* ----------------------------- TEACHER ------------------------------ */
const teacherSchema = new Schema<ITeacher>({
  full_name: { type: String, default: "", trim: true },
  dob: Date,

  phone: {
    type: String,
    index: true,
    trim: true,
  },

  address: { type: String, trim: true },

  status: {
    type: String,
    enum: TeacherStatuses,
    default: TeacherStatuses[0],
  },

  note: { type: String, trim: true },
});

export const TeacherModel = UserModel.discriminator<ITeacher>(
  "TEACHER",
  teacherSchema
);
