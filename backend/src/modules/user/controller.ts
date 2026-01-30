import { Request, Response, NextFunction } from "express";
import { Res } from "../../core/response";
import Service from "./service";

export default {
  // ------------------------------ get profile ------------------------------
  getProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await Service.getProfile(req.user!);
      return Res.success(res, "Profile retrieved successfully", profile);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- update profile --------------------
  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Service.updateProfile(req.user!, req.validated.body);
      return Res.success(res, "Profile updated successfully");
    } catch (error) {
      next(error);
    }
  },

  // ------------------------------ change password ------------------------------
  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Service.changePassword(req.user!.id, req.validated.body);
      return Res.success(res, "Password changed successfully");
    } catch (error) {
      next(error);
    }
  },

  // ------------------------------ get user by id ------------------------------
  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await Service.getUserById(req.validated.params.id);
      return Res.success(res, "Profile retrieved successfully", profile);
    } catch (error) {
      next(error);
    }
  },

  //-------------------- search users --------------------
  searchUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.searchUsers(req.validated.query);
      return Res.success(res, "Users fetched successfully", result);
    } catch (error) {
      next(error);
    }
  },
};
