import { createRoute } from "@tanstack/react-router";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Route as RootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/settings",
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Layout title="Settings">
        <div className="max-w-3xl mx-auto space-y-6" data-ocid="settings.page">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Settings
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Manage application settings
            </p>
          </div>
          <div className="glass-card-dark rounded-xl border border-white/10 p-8 text-center">
            <p className="text-muted-foreground">Settings panel coming soon.</p>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
