import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createRoute } from "@tanstack/react-router";
import { Save, UserCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";
import { Route as RootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/profile",
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, role } = useAuth();
  const [name, setName] = useState(profile?.name ?? "");
  const [department, setDepartment] = useState(profile?.department ?? "");

  const handleSave = () => {
    toast.success("Profile updated successfully");
  };

  return (
    <ProtectedRoute>
      <Layout title="Profile">
        <div className="max-w-xl mx-auto space-y-6" data-ocid="profile.page">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              My Profile
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Manage your account details
            </p>
          </div>

          <div className="glass-card-dark rounded-xl border border-white/10 p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center">
                <UserCircle className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <p className="font-display font-semibold text-foreground">
                  {profile?.name ?? "User"}
                </p>
                <p className="text-sm text-cyan-400 capitalize">{role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="profile-name"
                  className="text-sm font-medium text-foreground"
                >
                  Full Name
                </Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-muted/30 border-border/40 focus:border-cyan-400/60"
                  data-ocid="profile.name_input"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="profile-department"
                  className="text-sm font-medium text-foreground"
                >
                  Department
                </Label>
                <Input
                  id="profile-department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="bg-muted/30 border-border/40 focus:border-cyan-400/60"
                  data-ocid="profile.department_input"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Role
                </Label>
                <div className="px-3 py-2 rounded-lg bg-muted/20 border border-border/30 text-sm text-muted-foreground capitalize">
                  {role}
                </div>
              </div>
            </div>

            <Button
              onClick={handleSave}
              data-ocid="profile.save_button"
              className="button-cyan w-full gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
