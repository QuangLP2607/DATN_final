import { createContext } from "react";
import type { Role, User } from "@/models/User";

export interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
  login: (token: string, role: Role) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
