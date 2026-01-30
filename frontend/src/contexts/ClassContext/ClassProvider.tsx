import { useState, useEffect, type ReactNode } from "react";
import { ClassContext, type ClassContextType } from "./ClassContext";
import type { Class } from "@/interfaces/class";
import classApi from "@/services/classService";
import Loading from "@/components/ui/Loading";

interface ClassProviderProps {
  children: ReactNode;
}

export const ClassProvider = ({ children }: ClassProviderProps) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [activeClass, setActiveClass] = useState<Class | undefined>(() => {
    const storedId = localStorage.getItem("activeClassId");
    return storedId ? ({ id: storedId } as Class) : undefined;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await classApi.getMy();
        const data: Class[] = res?.classes ?? [];
        setClasses(data);

        if (activeClass?.id) {
          const found = data.find((c) => c.id === activeClass.id) ?? data[0];
          setActiveClass(found);
        } else if (data.length > 0) {
          setActiveClass(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch classes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [activeClass?.id]);

  useEffect(() => {
    if (activeClass?.id) {
      localStorage.setItem("activeClassId", activeClass.id);
    } else {
      localStorage.removeItem("activeClassId");
    }
  }, [activeClass]);

  const contextValue: ClassContextType = {
    classes,
    activeClass,
    setClasses,
    setActiveClass,
  };

  if (loading) return <Loading />;

  return (
    <ClassContext.Provider value={contextValue}>
      {children}
    </ClassContext.Provider>
  );
};
