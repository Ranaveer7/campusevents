import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  UserCircle,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: ("admin" | "student")[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "student"],
  },
  {
    label: "Events",
    path: "/events",
    icon: Calendar,
    roles: ["admin", "student"],
  },
  {
    label: "My Registrations",
    path: "/registrations",
    icon: BookOpen,
    roles: ["student"],
  },
  { label: "Attendees", path: "/attendees", icon: Users, roles: ["admin"] },
  { label: "Analytics", path: "/analytics", icon: BarChart3, roles: ["admin"] },
  {
    label: "Feedback",
    path: "/feedback",
    icon: MessageSquare,
    roles: ["admin", "student"],
  },
  { label: "Settings", path: "/settings", icon: Settings, roles: ["admin"] },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const { role, profile, logout } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const filteredNav = NAV_ITEMS.filter((item) =>
    role === "admin" || role === "student"
      ? item.roles.includes(role as "admin" | "student")
      : false,
  );

  if (!mounted) return null;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          onKeyDown={(e) => e.key === "Escape" && onMobileClose()}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full flex flex-col sidebar-collapsible",
          "bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border",
          "shadow-glass-lg",
          collapsed ? "w-16" : "w-64",
          "lg:relative lg:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        data-ocid="sidebar"
      >
        {/* Brand */}
        <div
          className={cn(
            "flex items-center h-16 px-4 border-b border-sidebar-border gap-3",
            collapsed && "justify-center px-2",
          )}
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_12px_rgba(102,204,255,0.4)]">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-lg bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent whitespace-nowrap">
              CampusEvents
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath === item.path ||
              currentPath.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                data-ocid={`sidebar.${item.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                  "transition-all duration-200",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 text-foreground border border-cyan-400/30 shadow-[0_0_12px_rgba(102,204,255,0.15)]"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive && "text-cyan-400",
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-sidebar-border" />

        {/* User & Logout */}
        <div className="p-3 space-y-2">
          {!collapsed && (
            <Link
              to="/profile"
              onClick={onMobileClose}
              data-ocid="sidebar.profile.link"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-all duration-200"
            >
              <UserCircle className="w-5 h-5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">
                  {profile?.name ?? "User"}
                </p>
                <p className="text-xs capitalize text-cyan-400">{role}</p>
              </div>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            data-ocid="sidebar.logout_button"
            className={cn(
              "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200",
              collapsed ? "px-2 justify-center" : "justify-start gap-3",
            )}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={onToggle}
          data-ocid="sidebar.collapse_toggle"
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border items-center justify-center text-muted-foreground hover:text-foreground hover:border-cyan-400/50 transition-all duration-200 shadow-glass-sm"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </aside>
    </>
  );
}
