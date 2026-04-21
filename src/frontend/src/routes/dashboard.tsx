import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { createRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckSquare,
  Clock,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAnalytics } from "../hooks/useAnalytics";
import { useAuth } from "../hooks/useAuth";
import { useEvents } from "../hooks/useEvents";
import { useAllFeedback } from "../hooks/useFeedback";
import { useRegistrations } from "../hooks/useRegistrations";
import { Route as RootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const CHART_COLORS = [
  "oklch(0.78 0.15 200)",
  "oklch(0.65 0.22 295)",
  "oklch(0.68 0.24 340)",
  "oklch(0.62 0.19 250)",
  "oklch(0.74 0.17 60)",
  "oklch(0.70 0.17 160)",
];

function DashboardPage() {
  const { profile, role } = useAuth();
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: registrations, isLoading: regsLoading } = useRegistrations();
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: allFeedback } = useAllFeedback();

  const upcomingEvents =
    events?.filter((e) => e.status === "upcoming").slice(0, 4) ?? [];

  const upcomingCount =
    events?.filter((e) => e.status === "upcoming").length ?? 0;

  // Student: count feedback submitted (mock: feedback for their registered eventIds)
  const registeredEventIds = new Set(
    registrations?.map((r) => r.eventId.toString()) ?? [],
  );
  const feedbackSubmittedCount =
    allFeedback?.filter((f) => registeredEventIds.has(f.eventId.toString()))
      .length ?? 0;

  const statusColors: Record<string, string> = {
    upcoming: "border-cyan-400/50 text-cyan-400 bg-cyan-400/10",
    ongoing: "border-pink-500/50 text-pink-400 bg-pink-500/10",
    past: "border-muted-foreground/30 text-muted-foreground bg-muted/20",
    cancelled: "border-destructive/30 text-destructive bg-destructive/10",
  };

  const kpis =
    role === "admin"
      ? [
          {
            label: "Total Events",
            value: analyticsLoading
              ? null
              : (analytics?.totalEvents.toString() ?? "—"),
            icon: Calendar,
            gradient: "from-cyan-400 to-blue-500",
            glow: "shadow-[0_0_20px_rgba(102,204,255,0.2)]",
          },
          {
            label: "Active Registrations",
            value: analyticsLoading
              ? null
              : (analytics?.totalRegistrations.toString() ?? "—"),
            icon: Users,
            gradient: "from-purple-500 to-pink-500",
            glow: "shadow-[0_0_20px_rgba(153,102,255,0.2)]",
          },
          {
            label: "Avg Attendance",
            value: analyticsLoading
              ? null
              : `${analytics?.averageAttendance ?? 0}%`,
            icon: TrendingUp,
            gradient: "from-pink-500 to-purple-500",
            glow: "shadow-[0_0_20px_rgba(255,102,204,0.2)]",
          },
          {
            label: "Upcoming Events",
            value: analyticsLoading
              ? null
              : (analytics?.upcomingEvents.toString() ?? "—"),
            icon: BarChart3,
            gradient: "from-blue-500 to-cyan-400",
            glow: "shadow-[0_0_20px_rgba(102,204,255,0.2)]",
          },
        ]
      : [
          {
            label: "My Registrations",
            value: regsLoading
              ? null
              : (registrations
                  ?.filter((r) => r.status === "registered")
                  .length.toString() ?? "0"),
            icon: Calendar,
            gradient: "from-cyan-400 to-blue-500",
            glow: "shadow-[0_0_20px_rgba(102,204,255,0.2)]",
          },
          {
            label: "Upcoming Events",
            value: eventsLoading ? null : upcomingCount.toString(),
            icon: TrendingUp,
            gradient: "from-purple-500 to-pink-500",
            glow: "shadow-[0_0_20px_rgba(153,102,255,0.2)]",
          },
          {
            label: "Feedback Submitted",
            value: regsLoading ? null : feedbackSubmittedCount.toString(),
            icon: CheckSquare,
            gradient: "from-pink-500 to-purple-500",
            glow: "shadow-[0_0_20px_rgba(255,102,204,0.2)]",
          },
          {
            label: "Total Events",
            value: eventsLoading ? null : (events?.length.toString() ?? "0"),
            icon: BarChart3,
            gradient: "from-blue-500 to-cyan-400",
            glow: "shadow-[0_0_20px_rgba(102,204,255,0.2)]",
          },
        ];

  // Admin chart data
  const categoryData =
    analytics?.registrationsByCategory.map((c) => ({
      name: c.category,
      value: Number(c.count),
    })) ?? [];

  const monthlyData =
    analytics?.registrationsByMonth.slice(-6).map((m) => ({
      month: m.month,
      registrations: Number(m.count),
    })) ?? [];

  return (
    <ProtectedRoute
      fallback={
        <div className="text-center py-20 text-muted-foreground">
          Please log in to continue.
        </div>
      }
    >
      <Layout title="Dashboard">
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Welcome Banner */}
          <div
            className="glass-card-dark rounded-xl border border-white/10 p-5 bg-gradient-to-r from-cyan-400/5 via-purple-500/5 to-pink-500/5"
            data-ocid="dashboard.section"
          >
            <h1 className="font-display text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome back,{" "}
              <span>
                {profile?.name ?? (role === "admin" ? "Admin" : "Student")}
              </span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {role === "admin"
                ? `Managing ${analytics?.totalEvents.toString() ?? "—"} events with ${analytics?.totalRegistrations.toString() ?? "—"} total registrations.`
                : `You have ${upcomingCount} upcoming event${upcomingCount !== 1 ? "s" : ""} on campus. Check out what's happening.`}
            </p>
          </div>

          {/* KPI Cards */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            data-ocid="dashboard.kpi.section"
          >
            {kpis.map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.label}
                  className={`glass-card-dark p-4 lg:p-5 rounded-xl border border-white/10 stagger-item ${kpi.glow} hover:scale-105 transition-all duration-200`}
                  data-ocid={`dashboard.kpi.item.${i + 1}`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      {kpi.value === null ? (
                        <Skeleton className="h-8 w-16 bg-muted/50" />
                      ) : (
                        <p className="text-2xl lg:text-3xl font-display font-bold text-foreground">
                          {kpi.value}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {kpi.label}
                      </p>
                    </div>
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${kpi.gradient} flex items-center justify-center`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div
                    className={`h-0.5 rounded-full bg-gradient-to-r ${kpi.gradient} opacity-60`}
                  />
                </div>
              );
            })}
          </div>

          {/* Admin: Embedded Charts */}
          {role === "admin" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Bar Chart */}
              <div
                className="glass-card-dark rounded-xl border border-white/10 p-5"
                data-ocid="dashboard.monthly_chart.section"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-semibold text-foreground text-sm">
                    Registrations — Last 6 Months
                  </h2>
                  <Link
                    to="/analytics"
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors duration-200"
                    data-ocid="dashboard.analytics.link"
                  >
                    Full report <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                {analyticsLoading ? (
                  <Skeleton className="h-44 w-full bg-muted/30 rounded-lg" />
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "oklch(0.55 0.01 260)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "oklch(0.55 0.01 260)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "oklch(0.18 0.015 260)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                          color: "oklch(0.93 0.01 260)",
                          fontSize: "11px",
                        }}
                      />
                      <Bar
                        dataKey="registrations"
                        radius={[4, 4, 0, 0]}
                        fill="url(#dashBarGradient)"
                      />
                      <defs>
                        <linearGradient
                          id="dashBarGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="oklch(0.78 0.15 200)" />
                          <stop
                            offset="100%"
                            stopColor="oklch(0.65 0.22 295)"
                          />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Pie Chart — Registrations by Category */}
              <div
                className="glass-card-dark rounded-xl border border-white/10 p-5"
                data-ocid="dashboard.category_chart.section"
              >
                <h2 className="font-display font-semibold text-foreground text-sm mb-4">
                  Registrations by Category
                </h2>
                {analyticsLoading ? (
                  <Skeleton className="h-44 w-full bg-muted/30 rounded-lg" />
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={68}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "oklch(0.18 0.015 260)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                          color: "oklch(0.93 0.01 260)",
                          fontSize: "11px",
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          fontSize: "10px",
                          color: "oklch(0.55 0.01 260)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          )}

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Events */}
            <div
              className="lg:col-span-2 glass-card-dark rounded-xl border border-white/10 p-5"
              data-ocid="dashboard.events.section"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-foreground">
                  Upcoming Events
                </h2>
                <Link
                  to="/events"
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors duration-200"
                  data-ocid="dashboard.events.view_all.link"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3">
                {eventsLoading
                  ? ["skel-1", "skel-2", "skel-3", "skel-4"].map((key) => (
                      <Skeleton
                        key={key}
                        className="h-20 w-full bg-muted/30 rounded-lg"
                      />
                    ))
                  : upcomingEvents.map((event, i) => (
                      <div
                        key={event.id.toString()}
                        className="flex gap-3 p-3 rounded-lg border border-border/20 bg-muted/10 hover:bg-muted/20 hover:border-cyan-400/20 transition-all duration-200 stagger-item"
                        data-ocid={`dashboard.event.item.${i + 1}`}
                        style={{ animationDelay: `${i * 0.06}s` }}
                      >
                        <div className="flex-shrink-0 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-purple-500" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-sm text-foreground truncate">
                              {event.title}
                            </p>
                            <Badge
                              variant="outline"
                              className={`text-xs px-1.5 py-0 border ${statusColors[event.status] ?? ""}`}
                            >
                              {event.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(
                                Number(event.date) / 1000000,
                              ).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>
                                Registered: {event.registeredCount.toString()}/
                                {event.capacity.toString()}
                              </span>
                              <span>
                                Waitlisted: {event.waitlistedCount.toString()}
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500"
                                style={{
                                  width: `${Math.min(100, (Number(event.registeredCount) / Number(event.capacity)) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            {/* Side panel */}
            <div className="space-y-4">
              {/* Quick action */}
              {role === "admin" && (
                <Link
                  to="/events/new"
                  data-ocid="dashboard.quick_create.button"
                  className="block w-full p-4 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white font-semibold text-sm text-center shadow-[0_0_24px_rgba(102,204,255,0.3)] hover:shadow-[0_0_36px_rgba(102,204,255,0.5)] hover:scale-105 transition-all duration-200"
                >
                  + Quick Create Event
                </Link>
              )}

              {/* Recent activity */}
              <div
                className="glass-card-dark rounded-xl border border-white/10 p-4"
                data-ocid="dashboard.activity.section"
              >
                <h3 className="font-display font-semibold text-sm text-foreground mb-3">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      id: "reg-hack",
                      text: "New registration for hackathon",
                      time: "3 hours ago",
                    },
                    {
                      id: "feedback",
                      text: "Event feedback received",
                      time: "3 hours ago",
                    },
                    {
                      id: "reminder",
                      text: "Reminder sent for workshop",
                      time: "5 hours ago",
                    },
                  ].map((item, i) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3"
                      data-ocid={`dashboard.activity.item.${i + 1}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-cyan-400/20 flex-shrink-0 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-foreground">{item.text}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
