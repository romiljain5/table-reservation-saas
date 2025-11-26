"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

export default function RestaurantStaffPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");

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
      toast.success("Invite sent!");
      setEmail("");
      queryClient.invalidateQueries(["staff", id]);
    },
    onError: () => toast.error("Failed to invite staff"),
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
              <li key={m.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">{m.name || "Unnamed User"}</div>
                  <div className="text-sm text-slate-500">{m.email}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-slate-100 border">
                  {m.role}
                </span>
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
