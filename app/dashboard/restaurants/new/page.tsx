"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRestaurantStore } from "@/store/restaurantStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewRestaurantPage() {
  const router = useRouter();
  const { setRestaurant } = useRestaurantStore();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("Name, Phone & Address are required");
      return;
    }

    const res = await fetch("/api/restaurants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      toast.error("Failed to create restaurant");
      return;
    }

    const restaurant = await res.json();

    setRestaurant(restaurant.id, restaurant.name);
    toast.success("Restaurant created!");

    router.push(`/dashboard/restaurants/${restaurant.id}/layout`);
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Add New Restaurant
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="md:col-span-2">
          <Label>Name *</Label>
          <Input
            required
            placeholder="Clayton Downtown"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>

        {/* Phone */}
        <div className="md:col-span-2">
          <Label>Phone *</Label>
          <Input
            placeholder="+1 555-123-4567"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <Label>Address *</Label>
          <Input
            placeholder="123 Main St"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          />
        </div>

        {/* City */}
        <div>
          <Label>City</Label>
          <Input
            placeholder="St. Louis"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          />
        </div>

        {/* State */}
        <div>
          <Label>State</Label>
          <Input
            placeholder="MO"
            value={form.state}
            onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
          />
        </div>

        {/* ZIP */}
        <div className="md:col-span-2">
          <Label>ZIP Code</Label>
          <Input
            placeholder="63105"
            value={form.zip}
            onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
          />
        </div>
      </div>

      <Button
        className="w-full bg-slate-900 text-white hover:bg-slate-800"
        onClick={handleSubmit}
      >
        Continue to Layout →
      </Button>
    </div>
  );
}
