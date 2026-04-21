import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { GraduationCap, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../store/authStore";
import type { UserRole } from "../types";
import { Route as RootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/login",
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated, isInitializing, isLoggingIn } = useAuth();
  const { setProfile, setProfileLoaded } = useAuthStore();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [name, setName] = useState("");
  const [step, setStep] = useState<"role" | "name">("role");

  useEffect(() => {
    if (isAuthenticated) {
      void navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    if (!name.trim()) return;
    // Store profile locally before II login
    setProfile({ name: name.trim(), role: selectedRole });
    setProfileLoaded(true);
    login();
  };

  const handleContinue = () => {
    if (selectedRole) setStep("name");
  };

  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(102,204,255,0.4)]">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            CampusEvents
          </h1>
          <p className="text-muted-foreground text-sm text-center">
            Your smart campus event management system
          </p>
        </div>

        {/* Card */}
        <div className="glass-card-dark p-6 rounded-2xl border border-white/10 shadow-glass-lg">
          {step === "role" ? (
            <div className="space-y-6" data-ocid="login.role_step">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-1">
                  Welcome back
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select your role to continue
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    role: "student" as UserRole,
                    label: "Student",
                    icon: GraduationCap,
                    description: "Browse & register for events",
                  },
                  {
                    role: "admin" as UserRole,
                    label: "Admin",
                    icon: Shield,
                    description: "Manage events & analytics",
                  },
                ].map(({ role, label, icon: Icon, description }) => (
                  <button
                    type="button"
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    data-ocid={`login.role_${role}.toggle`}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 text-center",
                      selectedRole === role
                        ? "border-cyan-400/60 bg-cyan-400/10 shadow-[0_0_20px_rgba(102,204,255,0.15)]"
                        : "border-border/30 bg-muted/20 hover:border-border/60 hover:bg-muted/40",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        selectedRole === role
                          ? "bg-gradient-to-br from-cyan-400 to-purple-500"
                          : "bg-muted",
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          selectedRole === role
                            ? "text-white"
                            : "text-muted-foreground",
                        )}
                      />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          selectedRole === role
                            ? "text-cyan-400"
                            : "text-foreground",
                        )}
                      >
                        {label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <Button
                onClick={handleContinue}
                disabled={!selectedRole}
                data-ocid="login.continue_button"
                className="w-full button-cyan h-11 text-base font-semibold"
              >
                Continue as {selectedRole === "admin" ? "Admin" : "Student"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6" data-ocid="login.name_step">
              <div>
                <button
                  type="button"
                  onClick={() => setStep("role")}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 mb-3 flex items-center gap-1"
                  data-ocid="login.back_button"
                >
                  ← Back
                </button>
                <h2 className="font-display text-xl font-semibold text-foreground mb-1">
                  What's your name?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter your name to personalize your experience
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    name.trim() &&
                    !isInitializing &&
                    !isLoggingIn &&
                    handleLogin()
                  }
                  placeholder="e.g. Alex Chen"
                  className="bg-muted/30 border-border/40 focus:border-cyan-400/60 focus:shadow-[0_0_12px_rgba(102,204,255,0.15)] transition-all duration-200 h-11"
                  data-ocid="login.name_input"
                  autoFocus
                />
              </div>

              <Button
                onClick={handleLogin}
                disabled={!name.trim() || isInitializing || isLoggingIn}
                data-ocid="login.submit_button"
                className="w-full button-cyan h-11 text-base font-semibold"
              >
                {isLoggingIn || isInitializing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    {isInitializing ? "Initializing..." : "Signing in..."}
                  </span>
                ) : (
                  "Sign in with Internet Identity"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Secured by{" "}
                <span className="text-cyan-400">Internet Identity</span> — no
                passwords required
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
