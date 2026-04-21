import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Route as RootRoute } from "./routes/__root";
import { Route as AnalyticsRoute } from "./routes/analytics";
import { Route as AttendeesRoute } from "./routes/attendees";
import { Route as DashboardRoute } from "./routes/dashboard";
import { Route as EventDetailRoute } from "./routes/event-detail";
import { EditEventRoute, NewEventRoute } from "./routes/event-form";
import { Route as EventsRoute } from "./routes/events";
import { Route as FeedbackRoute } from "./routes/feedback";
import { Route as IndexRoute } from "./routes/index";
import { Route as LoginRoute } from "./routes/login";
import { Route as ProfileRoute } from "./routes/profile";
import { Route as RegistrationsRoute } from "./routes/registrations";
import { Route as SettingsRoute } from "./routes/settings";

const routeTree = RootRoute.addChildren([
  IndexRoute,
  LoginRoute,
  DashboardRoute,
  EventsRoute,
  EventDetailRoute,
  NewEventRoute,
  EditEventRoute,
  RegistrationsRoute,
  FeedbackRoute,
  AnalyticsRoute,
  AttendeesRoute,
  SettingsRoute,
  ProfileRoute,
]);

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background dark gap-4">
      <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
        404
      </h1>
      <p className="text-muted-foreground">Page not found</p>
      <a href="/login" className="button-cyan text-sm px-4 py-2 rounded-lg">
        Go to Login
      </a>
    </div>
  ),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
