import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated && !fallback) {
      navigate({ to: "/login" });
    }
  }, [isInitializing, isAuthenticated, fallback, navigate]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback ?? null;
  }

  if (requiredRole && role !== requiredRole) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
        data-ocid="access_denied.section"
      >
        <div className="w-16 h-16 rounded-2xl bg-destructive/20 flex items-center justify-center">
          <span className="text-2xl">🚫</span>
        </div>
        <h2 className="text-xl font-display font-bold text-foreground">
          Access Denied
        </h2>
        <p className="text-muted-foreground text-sm text-center max-w-sm">
          You don't have permission to view this page. This section requires{" "}
          <span className="text-cyan-400 capitalize">{requiredRole}</span>{" "}
          access.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
