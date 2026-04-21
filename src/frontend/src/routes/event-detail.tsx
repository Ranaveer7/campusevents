import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { createRoute, useNavigate, useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, MapPin, Star, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";
import { useEvent } from "../hooks/useEvents";
import {
  useAverageRating,
  useFeedback,
  useSubmitFeedback,
} from "../hooks/useFeedback";
import {
  useRegisterForEvent,
  useRegistrations,
} from "../hooks/useRegistrations";
import { Route as RootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/events/$eventId",
  component: EventDetailPage,
});

const STATUS_STYLES: Record<string, string> = {
  upcoming: "border-cyan-400/50 text-cyan-400 bg-cyan-400/10",
  ongoing: "border-pink-500/50 text-pink-400 bg-pink-500/10",
  past: "border-muted-foreground/30 text-muted-foreground bg-muted/20",
  cancelled: "border-destructive/30 text-destructive bg-destructive/10",
};

function EventDetailPage() {
  const { eventId } = useParams({ from: "/events/$eventId" });
  const navigate = useNavigate();
  const { role } = useAuth();
  const { data: event, isLoading } = useEvent(BigInt(eventId));
  const { data: feedbackList } = useFeedback(BigInt(eventId));
  const { data: avgRating } = useAverageRating(BigInt(eventId));
  const { data: registrations } = useRegistrations();
  const registerMutation = useRegisterForEvent();
  const submitFeedback = useSubmitFeedback();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  // Check if current student is registered for this event
  const isRegisteredForEvent =
    registrations?.some(
      (r) =>
        r.eventId === BigInt(eventId) &&
        (r.status === "registered" || r.status === "waitlisted"),
    ) ?? false;

  const handleRegister = async () => {
    if (!event) return;
    await registerMutation.mutateAsync(event.id);
    toast.success("Successfully registered!");
  };

  const handleFeedback = async () => {
    if (!event || !comment.trim()) return;
    await submitFeedback.mutateAsync({ eventId: event.id, rating, comment });
    toast.success("Feedback submitted!");
    setComment("");
    setRating(5);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout title="Event">
          <div className="max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-12 w-64 bg-muted/30 rounded-lg" />
            <Skeleton className="h-48 w-full bg-muted/30 rounded-xl" />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!event) {
    return (
      <ProtectedRoute>
        <Layout title="Event Not Found">
          <div
            className="flex flex-col items-center justify-center py-20 gap-4"
            data-ocid="event_detail.error_state"
          >
            <p className="text-muted-foreground">Event not found.</p>
            <Button
              onClick={() => navigate({ to: "/events" })}
              className="button-cyan"
            >
              Back to Events
            </Button>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const pct = Math.min(
    100,
    (Number(event.registeredCount) / Number(event.capacity)) * 100,
  );

  // Student can submit feedback only if event is past AND they are registered
  const canSubmitFeedback =
    role === "student" && event.status === "past" && isRegisteredForEvent;

  return (
    <ProtectedRoute>
      <Layout title={event.title}>
        <div
          className="max-w-4xl mx-auto space-y-6 fade-in"
          data-ocid="event_detail.page"
        >
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            data-ocid="event_detail.back.link"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>

          {/* Main card */}
          <div className="glass-card-dark rounded-xl border border-white/10 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <h1 className="font-display text-2xl font-bold text-foreground">
                {event.title}
              </h1>
              <Badge
                variant="outline"
                className={`text-sm border ${STATUS_STYLES[event.status] ?? ""}`}
              >
                {event.status}
              </Badge>
            </div>

            <p className="text-muted-foreground">{event.description}</p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: Calendar,
                  label: "Date",
                  value: new Date(
                    Number(event.date) / 1000000,
                  ).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }),
                },
                { icon: MapPin, label: "Location", value: event.location },
                { icon: Users, label: "Category", value: event.category },
                {
                  icon: Star,
                  label: "Avg Rating",
                  value: avgRating
                    ? `${avgRating.toFixed(1)} / 5`
                    : "No ratings",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="p-3 rounded-lg bg-muted/20 border border-border/20"
                >
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Icon className="w-3.5 h-3.5 text-cyan-400/70" />
                    {label}
                  </div>
                  <p className="text-sm font-medium text-foreground">{value}</p>
                </div>
              ))}
            </div>

            {/* Registration bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Registered: {event.registeredCount.toString()} /{" "}
                  {event.capacity.toString()}
                </span>
                <span>Waitlisted: {event.waitlistedCount.toString()}</span>
              </div>
              <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {role === "student" &&
              event.status !== "past" &&
              event.status !== "cancelled" && (
                <Button
                  onClick={handleRegister}
                  disabled={registerMutation.isPending}
                  className="button-cyan w-full sm:w-auto"
                  data-ocid="event_detail.register_button"
                >
                  {registerMutation.isPending
                    ? "Registering..."
                    : "Register for this Event"}
                </Button>
              )}

            {/* Not registered notice for past events */}
            {role === "student" &&
              event.status === "past" &&
              !isRegisteredForEvent && (
                <p
                  className="text-sm text-muted-foreground italic"
                  data-ocid="event_detail.not_registered.section"
                >
                  You must be registered for this event to submit feedback.
                </p>
              )}
          </div>

          {/* Feedback submission — only for registered students on past events */}
          {canSubmitFeedback && (
            <div
              className="glass-card-dark rounded-xl border border-white/10 p-5 space-y-4"
              data-ocid="event_detail.feedback.section"
            >
              <h2 className="font-display font-semibold text-foreground">
                Submit Feedback
              </h2>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus-visible:outline-none"
                      data-ocid={`event_detail.rating.${s}`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors duration-150 ${
                          s <= (hoverRating || rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-muted-foreground/40"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="bg-muted/30 border-border/40 focus:border-cyan-400/60 min-h-[80px]"
                data-ocid="event_detail.feedback.textarea"
              />
              <Button
                onClick={handleFeedback}
                disabled={!comment.trim() || submitFeedback.isPending}
                className="button-cyan"
                data-ocid="event_detail.feedback.submit_button"
              >
                Submit Feedback
              </Button>
            </div>
          )}

          {/* Feedback list */}
          {feedbackList && feedbackList.length > 0 && (
            <div
              className="glass-card-dark rounded-xl border border-white/10 p-5 space-y-4"
              data-ocid="event_detail.feedback_list.section"
            >
              <h2 className="font-display font-semibold text-foreground">
                Attendee Feedback ({feedbackList.length})
              </h2>
              <div className="space-y-3">
                {feedbackList.map((f, i) => (
                  <div
                    key={f.id.toString()}
                    className="p-3 rounded-lg bg-muted/10 border border-border/20"
                    data-ocid={`event_detail.feedback.item.${i + 1}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-medium text-foreground">
                        {f.userName}
                      </p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${s <= f.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/20"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{f.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
