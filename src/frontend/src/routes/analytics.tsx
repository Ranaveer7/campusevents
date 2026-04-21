import { Skeleton } from "@/components/ui/skeleton";
import { createRoute } from "@tanstack/react-router";
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
import { Route as RootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/analytics",
  component: AnalyticsPage,
});

// OKLCH-based colors matching design tokens (cyan/purple/pink/blue accents)
const PIE_COLORS = [
  "oklch(0.78 0.15 200)", // cyan
  "oklch(0.65 0.22 295)", // purple
  "oklch(0.68 0.24 340)", // pink
  "oklch(0.62 0.19 250)", // blue
  "oklch(0.74 0.17 60)", // amber
  "oklch(0.70 0.17 160)", // emerald
];

function AnalyticsPage() {
  const { data: analytics, isLoading } = useAnalytics();

  const categoryData =
    analytics?.registrationsByCategory.map((c) => ({
      name: c.category,
      value: Number(c.count),
    })) ?? [];

  const monthlyData =
    analytics?.registrationsByMonth.map((m) => ({
      month: m.month,
      registrations: Number(m.count),
    })) ?? [];

  const topEvents =
    analytics?.topEvents.slice(0, 5).map((e) => ({
      title: e.title,
      registrations: Number(e.registrations),
    })) ?? [];

  return (
    <ProtectedRoute requiredRole="admin">
      <Layout title="Analytics">
        <div className="max-w-7xl mx-auto space-y-6" data-ocid="analytics.page">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Analytics & Reports
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Overview of campus event performance
            </p>
          </div>

          {/* KPI row */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            data-ocid="analytics.kpi.section"
          >
            {[
              {
                label: "Total Events",
                value: analytics?.totalEvents.toString(),
                gradient: "from-cyan-400 to-blue-500",
              },
              {
                label: "Total Registrations",
                value: analytics?.totalRegistrations.toString(),
                gradient: "from-purple-500 to-pink-500",
              },
              {
                label: "Avg Attendance",
                value: `${analytics?.averageAttendance ?? 0}%`,
                gradient: "from-pink-500 to-purple-500",
              },
              {
                label: "Upcoming Events",
                value: analytics?.upcomingEvents.toString(),
                gradient: "from-blue-500 to-cyan-400",
              },
            ].map((kpi, i) => (
              <div
                key={kpi.label}
                className="glass-card-dark p-4 rounded-xl border border-white/10 stagger-item"
                data-ocid={`analytics.kpi.item.${i + 1}`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {isLoading ? (
                  <Skeleton className="h-8 w-24 bg-muted/50 mb-1" />
                ) : (
                  <p
                    className={`text-3xl font-display font-bold bg-gradient-to-r ${kpi.gradient} bg-clip-text text-transparent`}
                  >
                    {kpi.value ?? "—"}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {kpi.label}
                </p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly bar chart */}
            <div
              className="glass-card-dark rounded-xl border border-white/10 p-5"
              data-ocid="analytics.monthly_chart.section"
            >
              <h2 className="font-display font-semibold text-foreground mb-4">
                Registrations by Month
              </h2>
              {isLoading ? (
                <Skeleton className="h-52 bg-muted/30 rounded-lg" />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "oklch(0.55 0.01 260)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "oklch(0.55 0.01 260)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.18 0.015 260)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "oklch(0.93 0.01 260)",
                      }}
                    />
                    <Bar
                      dataKey="registrations"
                      radius={[4, 4, 0, 0]}
                      fill="url(#barGradient)"
                    />
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="oklch(0.78 0.15 200)" />
                        <stop offset="100%" stopColor="oklch(0.65 0.22 295)" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Pie chart */}
            <div
              className="glass-card-dark rounded-xl border border-white/10 p-5"
              data-ocid="analytics.category_chart.section"
            >
              <h2 className="font-display font-semibold text-foreground mb-4">
                Registrations by Category
              </h2>
              {isLoading ? (
                <Skeleton className="h-52 bg-muted/30 rounded-lg" />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.18 0.015 260)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "oklch(0.93 0.01 260)",
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        fontSize: "11px",
                        color: "oklch(0.55 0.01 260)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Top events */}
          <div
            className="glass-card-dark rounded-xl border border-white/10 p-5"
            data-ocid="analytics.top_events.section"
          >
            <h2 className="font-display font-semibold text-foreground mb-4">
              Top 5 Events by Registration
            </h2>
            {isLoading ? (
              <div className="space-y-3">
                {["sk1", "sk2", "sk3", "sk4", "sk5"].map((k) => (
                  <Skeleton key={k} className="h-10 bg-muted/30 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {topEvents.map((event, i) => {
                  const maxRegs = topEvents[0]?.registrations ?? 1;
                  const pct = (event.registrations / maxRegs) * 100;
                  return (
                    <div
                      key={event.title}
                      className="flex items-center gap-3"
                      data-ocid={`analytics.top_event.item.${i + 1}`}
                    >
                      <span
                        className={`text-sm font-mono font-bold w-5 text-center ${i < 3 ? "text-cyan-400" : "text-muted-foreground"}`}
                      >
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {event.title}
                          </p>
                          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                            {event.registrations}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
