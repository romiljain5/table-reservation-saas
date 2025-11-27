"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ChangePasswordModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword) {
      return toast.error("All fields required");
    }
    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(form),
    });
    setLoading(false);

    if (!res.ok) return toast.error("Failed to change password");

    toast.success("Password updated!");
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change Password</Button>
      </DialogTrigger>

      <DialogContent className="dialog-content max-w-sm space-y-4">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            type="password"
            placeholder="Current Password"
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          />
          <Input
            type="password"
            placeholder="New Password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
