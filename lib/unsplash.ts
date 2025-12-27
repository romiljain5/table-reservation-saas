type RestaurantLike = { id: string | number; name?: string; city?: string; cuisines?: string[]; logoUrl?: string };

const STORAGE_KEY = "unsplash_images_v1";
const cache = new Map<string, string>();

// Initialize cache from sessionStorage if available
try {
  const raw = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
  if (raw) {
    const obj = JSON.parse(raw);
    Object.entries(obj).forEach(([k, v]) => cache.set(k, v as string));
  }
} catch (e) {
  // ignore
}

function persist() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(cache)));
  } catch (e) {
    // ignore
  }
}

export function getCachedImage(id: string | number) {
  return cache.get(String(id)) ?? null;
}

export function setCachedImage(id: string | number, url: string) {
  cache.set(String(id), url);
  try {
    persist();
  } catch (e) {
    // ignore
  }
}

async function queryUnsplash(key: string | undefined, q: string) {
  if (!key) return null;
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape&client_id=${encodeURIComponent(key)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const photo = json.results && json.results[0];
    return photo && photo.urls && photo.urls.regular ? photo.urls.regular : null;
  } catch (e) {
    return null;
  }
}

export async function fetchImageForRestaurant(r: RestaurantLike) {
  const id = String(r.id);
  const existing = getCachedImage(id);
  if (existing) return existing;

  if (r.logoUrl) {
    setCachedImage(id, r.logoUrl);
    return r.logoUrl;
  }

  const key = typeof window !== "undefined" ? (window as any).process?.env?.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || (process as any).env?.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY : (process as any).env?.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  const rawCandidates = [
    r.name ? `${r.name} restaurant` : null,
    r.city ? `${r.city} restaurant` : null,
    r.name || null,
    (r.cuisines && r.cuisines[0]) || null,
    "food",
  ].filter(Boolean) as string[];

  const sanitize = (s: string) => s.replace(/[^[\w\s,-]]/g, "").trim();

  // try each candidate
  if (key) {
    for (const raw of rawCandidates) {
      const q = sanitize(raw);
      if (!q) continue;
      const found = await queryUnsplash(key, q);
      if (found) {
        setCachedImage(id, found);
        return found;
      }
    }
  }

  // fallback to Source endpoint
  const fallback = encodeURIComponent(sanitize(rawCandidates[0] || "restaurant"));
  const src = `https://source.unsplash.com/800x600/?restaurant,${fallback}`;
  setCachedImage(id, src);
  return src;
}

export default { getCachedImage, setCachedImage, fetchImageForRestaurant };
