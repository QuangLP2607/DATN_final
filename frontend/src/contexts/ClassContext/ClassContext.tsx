import { createContext } from "react";
import type { Class } from "@/interfaces/class";

export interface ClassContextType {
  classes: Class[];
  activeClass?: Class;
  setClasses: (classes: Class[]) => void;
  setActiveClass: (cls?: Class) => void;
}

export const ClassContext = createContext<ClassContextType | undefined>(
  undefined
);
