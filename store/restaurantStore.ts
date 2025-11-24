import { create } from "zustand";

interface RestaurantState {
  restaurantId: string | null;
  restaurantName: string | null;
  setRestaurant: (id: string, name: string) => void;
}

export const useRestaurantStore = create<RestaurantState>((set) => {
  // Load from localStorage
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("selectedRestaurant");
    if (saved) {
      const parsed = JSON.parse(saved);
      set({ restaurantId: parsed.id, restaurantName: parsed.name });
    }
  }

  return {
    restaurantId: null,
    restaurantName: null,
    setRestaurant: (id, name) => {
      set({ restaurantId: id, restaurantName: name });
      localStorage.setItem("selectedRestaurant", JSON.stringify({ id, name }));
    },
  };
});

