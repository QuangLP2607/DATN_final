import jwt from "jsonwebtoken";
import { Role } from "../interfaces/user";

export interface JitsiUser {
  _id: string;
  role: Role;
  name: string;
  email?: string;
}

export const generateJitsiToken = (user: JitsiUser, roomId: string) => {
  const now = Math.floor(Date.now() / 1000);

  return jwt.sign(
    {
      aud: process.env.JITSI_APP_ID,
      iss: process.env.JITSI_APP_ID,
      sub: process.env.JITSI_DOMAIN?.replace(/^https?:\/\//, ""),
      room: roomId,
      context: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email || "",
          moderator: user.role === "TEACHER" || user.role === "ADMIN",
        },
      },
      iat: now,
      nbf: now - 5,
      exp: now + 3600,
    },
    process.env.JITSI_SECRET!,
    { algorithm: "HS256" }
  );
};
