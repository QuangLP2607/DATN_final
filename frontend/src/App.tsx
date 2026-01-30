import type { ComponentType, ReactNode } from "react";
import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { UploadProvider } from "./contexts/uploadContext";
import type { RouteType } from "@/routes";
import { privateRoutes, publicRoutes } from "@/routes";
import { ProtectedRoute, PublicRoute } from "@/routes/AuthRoute";

// ================= Router =================
function AppRouter() {
  const renderLayout = (
    Page: () => React.ReactElement,
    layout: ComponentType<{ children: ReactNode }> | null | undefined,
    layoutProps: Record<string, unknown> = {}
  ) => {
    if (layout === null || layout === undefined) {
      return <Page />;
    }

    const Layout = layout;
    return (
      <Layout {...layoutProps}>
        <Page />
      </Layout>
    );
  };

  return (
    <Routes>
      {/* --- Public Routes --- */}
      {publicRoutes.map((route: RouteType, index: number) => (
        <Route
          key={index}
          path={route.path}
          element={
            <PublicRoute
              element={renderLayout(
                route.component,
                route.layout,
                route.layoutProps
              )}
            />
          }
        />
      ))}

      {/* --- Private Routes --- */}
      {privateRoutes.map((route: RouteType, index: number) => (
        <Route
          key={index}
          path={route.path}
          element={
            <ProtectedRoute
              role={route.role}
              element={renderLayout(
                route.component,
                route.layout,
                route.layoutProps
              )}
            />
          }
        />
      ))}

      {/* --- Fallback --- */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// ================= Main App =================
function App() {
  return (
    <AuthProvider>
      <UploadProvider>
        <Router>
          <AppRouter />
        </Router>
      </UploadProvider>
    </AuthProvider>
  );
}

export default App;
