"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import useSound from "use-sound";

export default function RestaurantStaffPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [play] = useSound("/sounds/success.mp3");

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ["staff", id],
    queryFn: async () => {
      const res = await fetch(`/api/restaurants/${id}/staff`);
      return res.json();
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/restaurants/${id}/staff`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: () => {
      play();
      toast.success("Invite sent!");
      setEmail("");
      queryClient.invalidateQueries(["staff", id]);
    },
    onError: () => toast.error("Failed to invite staff"),
  });

  const removeMutation = useMutation({
    mutationFn: async ({ staffId }) => {
      await fetch(`/api/restaurants/${id}/staff/${staffId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      play();
      toast.success("Removed access");
      queryClient.invalidateQueries(["staff", id]);
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ staffId, role }) => {
      await fetch(`/api/restaurants/${id}/staff/${staffId}`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
    },
    onSuccess: () => {
      play();
      toast.success("Role updated!");
      queryClient.invalidateQueries(["staff", id]);
    },
  });

  // === Add this near inviteMutation ===
  const finishSetup = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/restaurants/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          setupStep: 4,
          isPublished: true,
          status: "ACTIVE",
        }),
      });
      if (!res.ok) throw new Error("Failed to publish restaurant");
      return res.json();
    },
    onSuccess: () => {
      play();
      toast.success("Restaurant published!");
      queryClient.invalidateQueries(["restaurants"]);
      window.location.href = "/dashboard/restaurants"; // 👈 redirect
    },
    onError: () => toast.error("Failed to publish"),
  });

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Staff Members</h1>
        <p className="text-sm text-slate-500">
          Manage access for team members in this restaurant.
        </p>
      </div>

      {/* Invite Staff */}
      <div className="p-6 bg-white border rounded-xl shadow-sm space-y-4">
        <h2 className="font-medium">Invite New Staff</h2>
        <div className="flex gap-2">
          <Input
            placeholder="staff@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button disabled={!email} onClick={() => inviteMutation.mutate()}>
            Invite
          </Button>
        </div>
      </div>

      {/* Staff List */}
      <div className="rounded-xl border bg-white shadow-sm p-6">
        <h2 className="font-medium mb-3">Current Team</h2>

        {isLoading ? (
          <div>Loading...</div>
        ) : staff.length === 0 ? (
          <div className="text-sm text-slate-500">No staff assigned yet.</div>
        ) : (
          <ul className="divide-y">
            {staff.map((m: any) => (
              <li
                key={m.id}
                className="py-3 grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b last:border-0"
              >
                {/* User + Avatar */}
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                    {m.name
                      ? m.name.charAt(0).toUpperCase()
                      : m.email.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {m.name && m.name.trim().length > 0
                        ? m.name
                        : m.email
                            .split("@")[0]
                            .replace(/\./g, " ")
                            .replace(/^\w/, (c) => c.toUpperCase())}
                    </span>
                    <span className="text-sm text-slate-500">{m.email}</span>
                  </div>
                </div>

                {/* Role Dropdown */}
                <select
                  className="border rounded px-2 py-1 text-sm bg-white"
                  value={m.role}
                  onChange={(e) =>
                    updateRoleMutation.mutate({
                      staffId: m.id,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="OWNER">Owner</option>
                  <option value="MANAGER">Manager</option>
                  <option value="HOST">Host</option>
                  <option value="SERVER">Server</option>
                  <option value="STAFF">Staff</option>
                </select>

                {/* Remove Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeMutation.mutate({ staffId: m.id })}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Next Step */}
      <div className="flex justify-end">
        <Button
          className="bg-slate-900 text-white"
          onClick={() => finishSetup.mutate()}
        >
          Finish Setup →
        </Button>
      </div>
    </div>
  );
}
