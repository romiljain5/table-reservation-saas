"use client";

import { useQuery } from "@tanstack/react-query";
import { useRestaurantStore } from "@/store/restaurantStore";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function RestaurantSwitcher() {
  const { restaurantId, restaurantName, setRestaurant } = useRestaurantStore();

  const { data, isLoading } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const res = await fetch("/api/restaurants");
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;

  const restaurants = data || [];

  return (
    <Select
      value={restaurantId || ""}
      onValueChange={(value) => {
        const selected = restaurants.find((r: any) => r.id === value);
        setRestaurant(selected.id, selected.name);
      }}
    >
      <SelectTrigger className="w-48 bg-white border">
        <SelectValue placeholder="Select restaurant" />
      </SelectTrigger>

      <SelectContent>
        {restaurants.map((r: any) => (
          <SelectItem key={r.id} value={r.id}>
            {r.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
