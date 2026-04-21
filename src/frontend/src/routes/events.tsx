import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, createRoute } from "@tanstack/react-router";
import {
  Calendar,
  Edit2,
  MapPin,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";
import { useDeleteEvent, useEvents } from "../hooks/useEvents";
import type { Event } from "../types";
import { Route as RootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/events",
  component: EventsPage,
});

const STATUS_STYLES: Record<string, string> = {
  upcoming: "border-cyan-400/50 text-cyan-400 bg-cyan-400/10",
  ongoing: "border-pink-500/50 text-pink-400 bg-pink-500/10",
  past: "border-muted-foreground/30 text-muted-foreground bg-muted/20",
  cancelled: "border-destructive/30 text-destructive bg-destructive/10",
};

const CATEGORIES = [
  "All",
  "Technology",
  "Academic",
  "Career",
  "Arts & Culture",
  "Cultural",
  "Sports",
];

function EventCard({
  event,
  isAdmin,
  onDelete,
}: { event: Event; isAdmin: boolean; onDelete: (id: bigint) => void }) {
  const pct = Math.min(
    100,
    (Number(event.registeredCount) / Number(event.capacity)) * 100,
  );

  return (
    <div
      className="glass-card-dark rounded-xl border border-white/10 p-4 flex flex-col gap-3 hover:border-cyan-400/25 hover:shadow-[0_0_20px_rgba(102,204,255,0.08)] transition-all duration-200 group"
      data-ocid="event.card"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display font-semibold text-foreground text-sm leading-tight">
          {event.title}
        </h3>
        <Badge
          variant="outline"
          className={`text-xs flex-shrink-0 border ${STATUS_STYLES[event.status] ?? ""}`}
        >
          {event.status}
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2">
        {event.description}
      </p>

      <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan-400/70" />
          {new Date(Number(event.date) / 1000000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-purple-400/70" />
          {event.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-pink-400/70" />
          {event.category}
        </span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>
            Registered: {event.registeredCount.toString()}/
            {event.capacity.toString()}
          </span>
          {Number(event.waitlistedCount) > 0 && (
            <span>Waitlisted: {event.waitlistedCount.toString()}</span>
          )}
        </div>
        <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {isAdmin ? (
        <div className="flex gap-2 pt-1">
          <Link
            to="/events/$eventId/edit"
            params={{ eventId: event.id.toString() }}
            className="flex-1"
            data-ocid="event.edit_button"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5 border-border/30 hover:border-cyan-400/50 text-xs"
            >
              <Edit2 className="w-3 h-3" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(event.id)}
            data-ocid="event.delete_button"
            className="flex-1 gap-1.5 border-destructive/30 hover:border-destructive/60 hover:bg-destructive/10 text-destructive text-xs"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </Button>
        </div>
      ) : (
        <Link
          to="/events/$eventId"
          params={{ eventId: event.id.toString() }}
          data-ocid="event.view.link"
        >
          <Button size="sm" className="w-full button-cyan text-xs">
            Register
          </Button>
        </Link>
      )}
    </div>
  );
}

function EventsPage() {
  const { role } = useAuth();
  const { data: events, isLoading } = useEvents();
  const deleteEvent = useDeleteEvent();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState<bigint | null>(null);
  const isAdmin = role === "admin";

  const filtered =
    events?.filter((e) => {
      const matchSearch =
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || e.category === category;
      return matchSearch && matchCat;
    }) ?? [];

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteEvent.mutateAsync(deleteTarget);
    toast.success("Event deleted successfully");
    setDeleteTarget(null);
  };

  return (
    <ProtectedRoute>
      <Layout title="Events">
        <div className="max-w-7xl mx-auto space-y-6" data-ocid="events.page">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Events
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {isAdmin
                  ? "Manage all campus events"
                  : "Browse and register for events"}
              </p>
            </div>
            {isAdmin && (
              <Link to="/events/new" data-ocid="events.create_button">
                <Button className="button-cyan gap-2">
                  <Plus className="w-4 h-4" />
                  Create Event
                </Button>
              </Link>
            )}
          </div>

          {/* Filters */}
          <div
            className="flex flex-col sm:flex-row gap-3"
            data-ocid="events.filters.section"
          >
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/30 border-border/40 focus:border-cyan-400/50 h-9"
                data-ocid="events.search_input"
              />
            </div>
            <div
              className="flex gap-2 flex-wrap"
              data-ocid="events.category.tab"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    category === cat
                      ? "bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/40 text-cyan-400"
                      : "border border-border/30 text-muted-foreground hover:border-border/60 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((k) => (
                <Skeleton key={k} className="h-56 bg-muted/30 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 gap-4"
              data-ocid="events.empty_state"
            >
              <Calendar className="w-12 h-12 text-muted-foreground/40" />
              <p className="text-muted-foreground">
                No events found matching your search.
              </p>
              {isAdmin && (
                <Link to="/events/new">
                  <Button className="button-cyan">Create First Event</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((event, i) => (
                <div
                  key={event.id.toString()}
                  className="stagger-item"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  data-ocid={`events.item.${i + 1}`}
                >
                  <EventCard
                    event={event}
                    isAdmin={isAdmin}
                    onDelete={(id) => setDeleteTarget(id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        confirmLabel="Delete Event"
        destructive
        onConfirm={handleDelete}
      />
    </ProtectedRoute>
  );
}
