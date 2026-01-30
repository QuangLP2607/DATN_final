import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// ================= Protected Route =================
interface ProtectedRouteProps {
  element: React.ReactElement;
  role?: string;
}

export function ProtectedRoute({ element, role }: ProtectedRouteProps) {
  const { user, isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return element;
}

// ================= Public Route =================
interface PublicRouteProps {
  element: React.ReactElement;
}

export function PublicRoute({ element }: PublicRouteProps) {
  const { user, isSignedIn } = useAuth();

  if (isSignedIn && user) {
    if (user.role === "STUDENT") return <Navigate to="/home" replace />;
    if (user.role === "TEACHER")
      return <Navigate to="/teaching/home" replace />;
    if (user.role === "ADMIN") return <Navigate to="/dashboard/home" replace />;
  }

  return element;
}
