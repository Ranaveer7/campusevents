import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createRoute, useNavigate, useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import {
  MOCK_EVENTS,
  useCreateEvent,
  useEvent,
  useUpdateEvent,
} from "../hooks/useEvents";
import type { Event } from "../types";
import { Route as RootRoute } from "./__root";

export const NewEventRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/events/new",
  component: NewEventPage,
});

export const EditEventRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/events/$eventId/edit",
  component: EditEventPage,
});

const CATEGORIES = [
  "Technology",
  "Academic",
  "Career",
  "Arts & Culture",
  "Cultural",
  "Sports",
];

interface FieldErrors {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  category?: string;
  organizer?: string;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs text-destructive mt-1" role="alert">
      {message}
    </p>
  );
}

function EventForm({
  initialData,
  onSubmit,
  isPending,
  title,
}: {
  initialData?: Partial<Event>;
  onSubmit: (
    data: Omit<Event, "id" | "registeredCount" | "waitlistedCount">,
  ) => void;
  isPending: boolean;
  title: string;
}) {
  const [eventTitle, setEventTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [date, setDate] = useState(
    initialData?.date
      ? new Date(Number(initialData.date) / 1000000).toISOString().slice(0, 16)
      : "",
  );
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [capacity, setCapacity] = useState(
    initialData?.capacity?.toString() ?? "100",
  );
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [status, setStatus] = useState<Event["status"]>(
    initialData?.status ?? "upcoming",
  );
  const [organizer, setOrganizer] = useState(initialData?.organizer ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};
    if (!eventTitle.trim()) newErrors.title = "Event title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!date) newErrors.date = "Date & time is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!category) newErrors.category = "Category is required";
    if (!organizer.trim()) newErrors.organizer = "Organizer is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: eventTitle,
      description,
      date: BigInt(new Date(date).getTime() * 1000000),
      location,
      capacity: BigInt(Number(capacity)),
      category,
      status,
      organizer,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card-dark rounded-xl border border-white/10 p-6 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2 space-y-2">
          <Label
            htmlFor="ev-title"
            className="text-sm font-medium text-foreground"
          >
            Event Title *
          </Label>
          <Input
            id="ev-title"
            value={eventTitle}
            onChange={(e) => {
              setEventTitle(e.target.value);
              if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
            }}
            placeholder="Spring Arts Festival"
            className={`bg-muted/30 border-border/40 focus:border-cyan-400/60 ${errors.title ? "border-destructive/60" : ""}`}
            data-ocid="event_form.title_input"
          />
          <FieldError message={errors.title} />
        </div>

        <div className="sm:col-span-2 space-y-2">
          <Label
            htmlFor="ev-desc"
            className="text-sm font-medium text-foreground"
          >
            Description *
          </Label>
          <Textarea
            id="ev-desc"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description)
                setErrors((p) => ({ ...p, description: undefined }));
            }}
            placeholder="Describe the event..."
            className={`bg-muted/30 border-border/40 focus:border-cyan-400/60 min-h-[80px] ${errors.description ? "border-destructive/60" : ""}`}
            data-ocid="event_form.description_input"
          />
          <FieldError message={errors.description} />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="ev-date"
            className="text-sm font-medium text-foreground"
          >
            Date & Time *
          </Label>
          <Input
            id="ev-date"
            type="datetime-local"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              if (errors.date) setErrors((p) => ({ ...p, date: undefined }));
            }}
            className={`bg-muted/30 border-border/40 focus:border-cyan-400/60 ${errors.date ? "border-destructive/60" : ""}`}
            data-ocid="event_form.date_input"
          />
          <FieldError message={errors.date} />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="ev-location"
            className="text-sm font-medium text-foreground"
          >
            Location *
          </Label>
          <Input
            id="ev-location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              if (errors.location)
                setErrors((p) => ({ ...p, location: undefined }));
            }}
            placeholder="Main Quad"
            className={`bg-muted/30 border-border/40 focus:border-cyan-400/60 ${errors.location ? "border-destructive/60" : ""}`}
            data-ocid="event_form.location_input"
          />
          <FieldError message={errors.location} />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="ev-capacity"
            className="text-sm font-medium text-foreground"
          >
            Capacity
          </Label>
          <Input
            id="ev-capacity"
            type="number"
            min="1"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="bg-muted/30 border-border/40 focus:border-cyan-400/60"
            data-ocid="event_form.capacity_input"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="ev-organizer"
            className="text-sm font-medium text-foreground"
          >
            Organizer *
          </Label>
          <Input
            id="ev-organizer"
            value={organizer}
            onChange={(e) => {
              setOrganizer(e.target.value);
              if (errors.organizer)
                setErrors((p) => ({ ...p, organizer: undefined }));
            }}
            placeholder="Tech Club"
            className={`bg-muted/30 border-border/40 focus:border-cyan-400/60 ${errors.organizer ? "border-destructive/60" : ""}`}
            data-ocid="event_form.organizer_input"
          />
          <FieldError message={errors.organizer} />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Category *
          </Label>
          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v);
              if (errors.category)
                setErrors((p) => ({ ...p, category: undefined }));
            }}
          >
            <SelectTrigger
              className={`bg-muted/30 border-border/40 ${errors.category ? "border-destructive/60" : ""}`}
              data-ocid="event_form.category_select"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/40">
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.category} />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Status</Label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as Event["status"])}
          >
            <SelectTrigger
              className="bg-muted/30 border-border/40"
              data-ocid="event_form.status_select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/40">
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="past">Past</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="button-cyan gap-2"
          data-ocid="event_form.submit_button"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Saving..." : title}
        </Button>
        <Link to="/events">
          <Button
            type="button"
            variant="outline"
            className="border-border/40 hover:border-border/70"
          >
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}

function NewEventPage() {
  const navigate = useNavigate();
  const createEvent = useCreateEvent();

  const handleSubmit = async (
    data: Omit<Event, "id" | "registeredCount" | "waitlistedCount">,
  ) => {
    await createEvent.mutateAsync(data);
    toast.success("Event created successfully!");
    navigate({ to: "/events" });
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <Layout title="Create Event">
        <div className="max-w-3xl mx-auto space-y-6" data-ocid="new_event.page">
          <div className="flex items-center gap-3">
            <Link to="/events" data-ocid="new_event.back.link">
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-muted/30 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Create Event
              </h1>
              <p className="text-muted-foreground text-sm">
                Fill in the details for the new event
              </p>
            </div>
          </div>
          <EventForm
            onSubmit={handleSubmit}
            isPending={createEvent.isPending}
            title="Create Event"
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

function EditEventPage() {
  const { eventId } = useParams({ from: "/events/$eventId/edit" });
  const navigate = useNavigate();
  const updateEvent = useUpdateEvent();
  const { data: event } = useEvent(BigInt(eventId));

  const fallbackEvent = MOCK_EVENTS.find((e) => e.id.toString() === eventId);
  const initialData = event ?? fallbackEvent;

  const handleSubmit = async (
    data: Omit<Event, "id" | "registeredCount" | "waitlistedCount">,
  ) => {
    if (!initialData) return;
    await updateEvent.mutateAsync({
      ...data,
      id: initialData.id,
      registeredCount: initialData.registeredCount,
      waitlistedCount: initialData.waitlistedCount,
    });
    toast.success("Event updated successfully!");
    navigate({ to: "/events" });
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <Layout title="Edit Event">
        <div
          className="max-w-3xl mx-auto space-y-6"
          data-ocid="edit_event.page"
        >
          <div className="flex items-center gap-3">
            <Link to="/events" data-ocid="edit_event.back.link">
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-muted/30 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Edit Event
              </h1>
              <p className="text-muted-foreground text-sm">
                Update the event details
              </p>
            </div>
          </div>
          <EventForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isPending={updateEvent.isPending}
            title="Save Changes"
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
