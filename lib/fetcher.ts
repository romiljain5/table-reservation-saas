import { toast } from "sonner";

export async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);

  if (!res.ok) {
    toast.error("An error occurred. Please try again.");
  }

  return res;
}
