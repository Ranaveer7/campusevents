import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { BookOpen, Calendar, MapPin, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import {
  useCancelRegistration,
  useRegistrations,
} from "../hooks/useRegistrations";
import { Route as RootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/registrations",
  component: RegistrationsPage,
});

const STATUS_STYLES: Record<string, string> = {
  registered: "border-cyan-400/50 text-cyan-400 bg-cyan-400/10",
  waitlisted: "border-yellow-500/50 text-yellow-400 bg-yellow-500/10",
  cancelled: "border-destructive/30 text-destructive bg-destructive/10",
};

function RegistrationsPage() {
  const { data: registrations, isLoading } = useRegistrations();
  const cancelMutation = useCancelRegistration();
  const [cancelTarget, setCancelTarget] = useState<bigint | null>(null);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    await cancelMutation.mutateAsync(cancelTarget);
    toast.success("Registration cancelled successfully");
    setCancelTarget(null);
  };

  return (
    <ProtectedRoute requiredRole="student">
      <Layout title="My Registrations">
        <div
          className="max-w-4xl mx-auto space-y-6"
          data-ocid="registrations.page"
        >
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              My Registrations
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Manage your event registrations
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {["sk1", "sk2", "sk3"].map((k) => (
                <Skeleton key={k} className="h-24 bg-muted/30 rounded-xl" />
              ))}
            </div>
          ) : !registrations || registrations.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 gap-4"
              data-ocid="registrations.empty_state"
            >
              <BookOpen className="w-12 h-12 text-muted-foreground/40" />
              <p className="text-muted-foreground">
                You have no registrations yet.
              </p>
              <Link to="/events">
                <Button className="button-cyan">Browse Events</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {registrations.map((reg, i) => (
                <div
                  key={reg.id.toString()}
                  className="glass-card-dark rounded-xl border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-cyan-400/20 transition-all duration-200 stagger-item"
                  data-ocid={`registrations.item.${i + 1}`}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-cyan-400 to-purple-500 hidden sm:block flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-semibold text-foreground text-sm">
                        {reg.eventTitle ?? `Event #${reg.eventId.toString()}`}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-xs border ${STATUS_STYLES[reg.status] ?? ""}`}
                      >
                        {reg.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {reg.eventDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-cyan-400/70" />
                          {new Date(
                            Number(reg.eventDate) / 1000000,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      {reg.eventLocation && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-purple-400/70" />
                          {reg.eventLocation}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Registered:{" "}
                      {new Date(
                        Number(reg.registeredAt) / 1000000,
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  {reg.status !== "cancelled" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCancelTarget(reg.id)}
                      data-ocid={`registrations.cancel_button.${i + 1}`}
                      className="gap-1.5 border-destructive/30 hover:border-destructive/60 hover:bg-destructive/10 text-destructive text-xs flex-shrink-0"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>

      <ConfirmDialog
        open={cancelTarget !== null}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        title="Cancel Registration"
        description="Are you sure you want to cancel this registration? You may lose your spot."
        confirmLabel="Cancel Registration"
        destructive
        onConfirm={handleCancel}
      />
    </ProtectedRoute>
  );
}
