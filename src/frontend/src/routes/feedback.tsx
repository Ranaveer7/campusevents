import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { createRoute } from "@tanstack/react-router";
import { MessageSquare, Send, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";
import { MOCK_EVENTS } from "../hooks/useEvents";
import { useAllFeedback, useSubmitFeedback } from "../hooks/useFeedback";
import { useRegistrations } from "../hooks/useRegistrations";
import { Route as RootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/feedback",
  component: FeedbackPage,
});

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

function StudentFeedbackForm() {
  const { data: registrations, isLoading: regsLoading } = useRegistrations();
  const submitFeedback = useSubmitFeedback();

  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");

  // Only events student is registered for (registered or waitlisted)
  const registeredEvents =
    registrations
      ?.filter((r) => r.status === "registered" || r.status === "waitlisted")
      .map((r) => ({
        id: r.eventId.toString(),
        title:
          r.eventTitle ??
          MOCK_EVENTS.find((e) => e.id === r.eventId)?.title ??
          `Event #${r.eventId}`,
      })) ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setCommentError("Please share your experience before submitting.");
      return;
    }
    if (!selectedEventId) {
      toast.error("Please select an event to review.");
      return;
    }
    setCommentError("");
    await submitFeedback.mutateAsync({
      eventId: BigInt(selectedEventId),
      rating,
      comment,
    });
    toast.success("Feedback submitted — thank you!");
    setComment("");
    setRating(5);
    setSelectedEventId("");
  };

  if (regsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full bg-muted/30 rounded-lg" />
        <Skeleton className="h-24 w-full bg-muted/30 rounded-lg" />
      </div>
    );
  }

  if (registeredEvents.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 gap-4"
        data-ocid="feedback.empty_state"
      >
        <MessageSquare className="w-12 h-12 text-muted-foreground/40" />
        <p className="text-muted-foreground text-center max-w-xs">
          You have no registered events yet. Register for an event to leave
          feedback.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card-dark rounded-xl border border-white/10 p-6 space-y-5"
      data-ocid="feedback.form"
    >
      <div className="space-y-2">
        <label
          htmlFor="fb-event"
          className="text-sm font-medium text-foreground"
        >
          Select Event *
        </label>
        <Select value={selectedEventId} onValueChange={setSelectedEventId}>
          <SelectTrigger
            className="bg-muted/30 border-border/40"
            data-ocid="feedback.event_select"
          >
            <SelectValue placeholder="Choose an event you attended..." />
          </SelectTrigger>
          <SelectContent className="bg-card border-border/40">
            {registeredEvents.map((ev) => (
              <SelectItem key={ev.id} value={ev.id}>
                {ev.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Rating *</p>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHoverRating(s)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus-visible:outline-none"
              aria-label={`${s} star${s > 1 ? "s" : ""}`}
              data-ocid={`feedback.rating.${s}`}
            >
              <Star
                className={`w-7 h-7 transition-colors duration-150 ${
                  s <= (hoverRating || rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-muted-foreground/30 hover:text-yellow-400/60"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground self-center">
            {rating} / 5
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="fb-comment"
          className="text-sm font-medium text-foreground"
        >
          Your Experience *
        </label>
        <Textarea
          id="fb-comment"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (commentError) setCommentError("");
          }}
          placeholder="Tell us what you thought of the event..."
          className={`bg-muted/30 border-border/40 focus:border-cyan-400/60 min-h-[100px] ${commentError ? "border-destructive/60" : ""}`}
          data-ocid="feedback.comment_textarea"
        />
        {commentError && (
          <p className="text-xs text-destructive" role="alert">
            {commentError}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!selectedEventId || submitFeedback.isPending}
        className="button-cyan gap-2"
        data-ocid="feedback.submit_button"
      >
        <Send className="w-4 h-4" />
        {submitFeedback.isPending ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  );
}

function AdminFeedbackList() {
  const { data: feedback, isLoading } = useAllFeedback();
  const [filter, setFilter] = useState<number | null>(null);

  const filtered =
    feedback?.filter((f) => filter === null || f.rating === filter) ?? [];

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap" data-ocid="feedback.rating.tab">
        {[null, 5, 4, 3, 2, 1].map((r) => (
          <button
            key={r ?? "all"}
            type="button"
            onClick={() => setFilter(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              filter === r
                ? "bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/40 text-yellow-400"
                : "border border-border/30 text-muted-foreground hover:border-border/60"
            }`}
          >
            {r === null ? "All" : `${r}★`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {["sk1", "sk2", "sk3"].map((k) => (
            <Skeleton key={k} className="h-28 bg-muted/30 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 gap-4"
          data-ocid="feedback.empty_state"
        >
          <MessageSquare className="w-12 h-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">No feedback found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <div
              key={item.id.toString()}
              className="glass-card-dark rounded-xl border border-white/10 p-4 hover:border-cyan-400/20 transition-all duration-200 stagger-item"
              data-ocid={`feedback.item.${i + 1}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm text-foreground">
                      {item.userName}
                    </p>
                    {item.eventTitle && (
                      <Badge
                        variant="outline"
                        className="text-xs border-cyan-400/30 text-cyan-400 bg-cyan-400/5"
                      >
                        {item.eventTitle}
                      </Badge>
                    )}
                  </div>
                  <StarRating rating={item.rating} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(
                    Number(item.submittedAt) / 1000000,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {item.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FeedbackPage() {
  const { role } = useAuth();

  return (
    <ProtectedRoute>
      <Layout title="Feedback">
        <div className="max-w-5xl mx-auto space-y-6" data-ocid="feedback.page">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Feedback
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {role === "admin"
                ? "All event feedback from attendees"
                : "Share your experience for events you attended"}
            </p>
          </div>

          {role === "admin" ? <AdminFeedbackList /> : <StudentFeedbackForm />}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
