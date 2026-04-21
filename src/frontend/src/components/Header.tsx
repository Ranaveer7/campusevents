import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export function Header({ onMenuClick, title = "Dashboard" }: HeaderProps) {
  const { profile, role, logout } = useAuth();

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-16 flex items-center gap-4 px-4 lg:px-6",
        "bg-card/80 backdrop-blur-xl border-b border-border/30",
        "shadow-glass-sm",
      )}
      data-ocid="header"
    >
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden text-muted-foreground hover:text-foreground"
        onClick={onMenuClick}
        data-ocid="header.menu_toggle"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Page title */}
      <div className="hidden lg:block">
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-9 bg-muted/50 border-border/30 focus:border-cyan-400/50 focus:shadow-[0_0_12px_rgba(102,204,255,0.15)] transition-all duration-200"
            data-ocid="header.search_input"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          data-ocid="header.notifications_button"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500" />
        </Button>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l border-border/30">
          <Avatar className="w-8 h-8 ring-2 ring-cyan-400/30">
            <AvatarFallback className="bg-gradient-to-br from-cyan-400/20 to-purple-500/20 text-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block min-w-0">
            <p className="text-sm font-medium leading-none truncate max-w-[120px]">
              {profile?.name ?? "User"}
            </p>
            <p className="text-xs text-cyan-400 capitalize mt-0.5">{role}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            data-ocid="header.logout_button"
            className="text-muted-foreground hover:text-destructive hidden sm:flex"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
