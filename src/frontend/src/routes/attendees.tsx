import { createRoute } from "@tanstack/react-router";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Route as RootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/attendees",
  component: AttendeesPage,
});

function AttendeesPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Layout title="Attendees">
        <div className="max-w-7xl mx-auto space-y-6" data-ocid="attendees.page">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Attendees
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Manage event attendees and registrations
            </p>
          </div>
          <div className="glass-card-dark rounded-xl border border-white/10 p-8 text-center">
            <p className="text-muted-foreground">
              Attendees management coming soon.
            </p>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
