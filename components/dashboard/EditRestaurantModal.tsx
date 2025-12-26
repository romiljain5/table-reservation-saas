"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function EditRestaurantModal({ restaurant }: { restaurant: any }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(restaurant.name);
  const [phone, setPhone] = useState(restaurant.phone ?? "");
  const [addressLine1, setAddressLine1] = useState(restaurant.addressLine1 ?? "");
  const [addressLine2, setAddressLine2] = useState(restaurant.addressLine2 ?? "");
  const [city, setCity] = useState(restaurant.city ?? "");
  const [state, setState] = useState(restaurant.state ?? "");
  const [zipCode, setZipCode] = useState(restaurant.zipCode ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(restaurant.websiteUrl ?? "");
  const [cuisines, setCuisines] = useState(
    Array.isArray(restaurant.cuisines) ? restaurant.cuisines.join(", ") : (restaurant.cuisines ?? "")
  );

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/restaurants/${restaurant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          addressLine1,
          addressLine2,
          city,
          state,
          zipCode,
          websiteUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      toast.success("Restaurant updated!");
    } catch (error) {
      toast.error("Unable to update restaurant");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Restaurant</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Restaurant Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Restaurant Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Restaurant name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Address Line 1
            </label>
            <Input
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="Street address"
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Address Line 2
            </label>
            <Input
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="Suite, apt (optional)"
            />
          </div>

          {/* City, State, Zip */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <Input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ZIP</label>
              <Input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="ZIP"
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <Input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          {/* Cuisines */}
          <div>
            <label className="block text-sm font-medium mb-1">Cuisines</label>
            <Input
              value={cuisines}
              onChange={(e) => setCuisines(e.target.value)}
              placeholder="e.g., Indian, Italian, Mexican"
            />
            <p className="text-xs text-slate-500 mt-1">Separate multiple cuisines with commas.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              // prepare cuisines array
              const cuisinesArray = cuisines
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);

              await fetch(`/api/restaurants/${restaurant.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name,
                  phone,
                  addressLine1,
                  addressLine2,
                  city,
                  state,
                  zipCode,
                  websiteUrl,
                  cuisines: cuisinesArray,
                }),
              });

              // reuse existing success flow
              setOpen(false);
              queryClient.invalidateQueries({ queryKey: ["restaurants"] });
              toast.success("Restaurant updated!");
            }}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
