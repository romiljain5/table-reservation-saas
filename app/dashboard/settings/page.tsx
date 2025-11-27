"use client";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import ChangePasswordModal from "@/components/auth/ChangePasswordModal";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-8 p-6 text-slate-700 dark:text-slate-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage account & system preferences.
        </p>
      </div>

      {/* Profile */}
      <section className="rounded-xl border bg-white dark:bg-neutral-800 dark:border-neutral-700 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-medium">Profile</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Update your account details.
        </p>

        <Button variant="outline" className="mt-2 dark:bg-neutral-700 dark:text-slate-100">
          Edit Profile
        </Button>
      </section>

      {/* Notifications */}
      <section className="rounded-xl border bg-white dark:bg-neutral-800 dark:border-neutral-700 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-medium">Notifications</h2>

        <div className="flex items-center justify-between">
          <span className="text-sm">Email Notifications</span>
          <Switch
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>

        <Separator className="dark:bg-neutral-700" />

        <div className="flex items-center justify-between">
          <span className="text-sm">Push Alerts</span>
          <Switch checked={pushAlerts} onCheckedChange={setPushAlerts} />
        </div>
      </section>

      {/* Security */}
      <section className="rounded-xl border bg-white dark:bg-neutral-800 dark:border-neutral-700 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-medium">Security</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your login credentials.
        </p>
        <ChangePasswordModal />
      </section>

      {/* Theme Toggle */}
      <section className="rounded-xl border bg-white dark:bg-neutral-800 dark:border-neutral-700 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-medium">Appearance</h2>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Dark Mode ({theme === "dark" ? "On" : "Off"})
          </span>
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-xl border bg-red-50 dark:bg-red-950 dark:border-red-800 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-medium text-red-700 dark:text-red-300">
          Danger Zone
        </h2>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Deactivate your account or reset your data.
        </p>

        <Button variant="destructive" className="w-full">
          Delete Account
        </Button>
      </section>
    </div>
  );
}
