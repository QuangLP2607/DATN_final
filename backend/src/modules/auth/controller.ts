import { Request, Response, NextFunction } from "express";
import { Res } from "../../core/response";
import Service from "./service";
import { refreshAccessToken } from "../../services/jwt";
import ms from "ms";

export default {
  // ------------------------------ signup ------------------------------
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.signup(req.validated.body);
      return Res.created(res, "Signup successful", result);
    } catch (error) {
      next(error);
    }
  },

  // ------------------------------ login ------------------------------
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken, role } = await Service.login(req.body);
      const refreshTokenExpires = process.env.JWT_REFRESH_TOKEN_EXPIRES ?? "7d";
      const maxAgeMs = (ms as any)(refreshTokenExpires) as number;
      console.log("test");
      if (typeof maxAgeMs !== "number" || maxAgeMs <= 0) {
        throw new Error(
          `Invalid time format for JWT_REFRESH_TOKEN_EXPIRES: ${refreshTokenExpires}`
        );
      }

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: maxAgeMs,
      });

      return Res.success(res, "Login successful", {
        accessToken,
        role,
      });
    } catch (error) {
      next(error);
    }
  },

  // ------------------------------ logout ------------------------------
  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return Res.success(res, "Logged out successfully");
    } catch (error) {
      next(error);
    }
  },

  // ------------------------------ refresh token ------------------------------
  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return Res.badRequest(res, "Missing refresh token");
      }

      const newAccessToken = refreshAccessToken(refreshToken);

      if (!newAccessToken) {
        return Res.forbidden(res, "Invalid or expired refresh token");
      }

      return Res.success(res, "Access token refreshed successfully", {
        accessToken: newAccessToken,
      });
    } catch (error) {
      next(error);
    }
  },
};
