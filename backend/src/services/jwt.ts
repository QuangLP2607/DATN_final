import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthUser } from "../interfaces/user";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const JWT_ACCESS_TOKEN_EXPIRES = "1d";
const JWT_REFRESH_TOKEN_EXPIRES = "7d";

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error(
    "Missing JWT_SECRET or JWT_REFRESH_SECRET in environment variables"
  );
}

// -------------------- ACCESS TOKEN --------------------
export function generateAccessToken(user: AuthUser): string {
  const options: SignOptions = { expiresIn: JWT_ACCESS_TOKEN_EXPIRES };
  return jwt.sign(user, JWT_SECRET, options);
}

// -------------------- REFRESH TOKEN --------------------
export function generateRefreshToken(user: AuthUser): string {
  const options: SignOptions = { expiresIn: JWT_REFRESH_TOKEN_EXPIRES };
  return jwt.sign(user, JWT_REFRESH_SECRET, options);
}

// -------------------- GENERATE BOTH --------------------
export function generateTokens(user: AuthUser) {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
}

// -------------------- REFRESH ACCESS TOKEN --------------------
export function refreshAccessToken(refreshToken: string): string | null {
  try {
    const decoded = jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET
    ) as jwt.JwtPayload & AuthUser;
    return generateAccessToken({ id: decoded.id, role: decoded.role });
  } catch {
    return null;
  }
}
