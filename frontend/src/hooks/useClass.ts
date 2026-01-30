import { useContext } from "react";
import { ClassContext } from "@/contexts/ClassContext";

export const useClass = () => {
  const context = useContext(ClassContext);

  if (!context) {
    throw new Error("useClass must be used within a ClassProvider");
  }

  return context;
};
