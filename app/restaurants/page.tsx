"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { fetchImageForRestaurant, getCachedImage } from "@/lib/unsplash";
import { useSession } from "next-auth/react";

export default function PublicRestaurants() {
  const { data: session, status } = useSession();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 9;

  // Debounce user input to avoid overloading the server
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1); // reset to first page on new search
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  const { data: result, isLoading, isFetching } = useQuery({
    queryKey: ["public-restaurants", debouncedQuery, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set("search", debouncedQuery);
      params.set("page", String(page));
      params.set("limit", String(perPage));

      const res = await fetch(`/api/restaurants/public?${params.toString()}`);
      if (!res.ok) return { data: [], meta: { total: 0, page: 1, totalPages: 1, perPage } };
      return res.json();
    },
    keepPreviousData: true,
  });

  const data = result?.data ?? [];
  const meta = result?.meta ?? { total: 0, page: 1, totalPages: 1, perPage };

  const [imagesMap, setImagesMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!data || data.length === 0) return;

    let cancelled = false;

    (async () => {
      const next: Record<string, string> = {};
      const toFetch: any[] = [];

      for (const r of data) {
        const cached = getCachedImage(r.id);
        if (cached) next[r.id] = cached;
        else toFetch.push(r);
      }

      // set any cached images first to avoid layout shifts
      if (!cancelled) setImagesMap((s) => ({ ...s, ...next }));

      // fetch remaining images in parallel (fetchImageForRestaurant caches results)
      await Promise.all(
        toFetch.map(async (r) => {
          try {
            const url = await fetchImageForRestaurant(r);
            if (!cancelled && url) {
              setImagesMap((s) => ({ ...s, [r.id]: url }));
            }
          } catch (e) {
            // ignore
          }
        })
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [data]);

  // Show full-screen loader only on initial load (no previous data)
  // Do not unmount the search input during loading — render page shell
  // and show a localized loader where results appear. This prevents
  // the input from losing focus when fetching new data.

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border-b dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Browse Restaurants
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Discover places, check details, and reserve instantly.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              Home
            </Link>
            {status === "authenticated" ? (
              <Link
                href="/dashboard"
                className="text-sm px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Search */}
        <div className="mb-6">
          <div className="max-w-2xl">
            <label htmlFor="restaurant-search" className="sr-only">Search restaurants</label>
            <div className="flex gap-2">
              <input
                id="restaurant-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setDebouncedQuery(query.trim());
                    setPage(1);
                  }
                }}
                placeholder="Search by name, city, or cuisine"
                className="flex-1 px-4 py-2 border rounded-md bg-white dark:bg-neutral-800"
              />

              <button
                onClick={() => {
                  setDebouncedQuery(query.trim());
                  setPage(1);
                }}
                className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800"
              >
                Search
              </button>

              {isFetching && (
                <div className="flex items-center px-3 text-sm text-slate-500">Searching…</div>
              )}

              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setDebouncedQuery("");
                    setPage(1);
                  }}
                  className="px-4 py-2 rounded-md border bg-slate-50 dark:bg-neutral-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
        {isLoading && data.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-sm animate-pulse">Loading restaurants…</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">No restaurants found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((r: any) => {
              const photoSrc = imagesMap[r.id] || r.logoUrl || null;

              return (
                <article
                  key={r.id}
                  className="group rounded-2xl border bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg transition-all overflow-hidden"
                >
                  <Link href={`/restaurants/${r.slug}`} className="block">
                    <div className="relative h-44 bg-slate-100 dark:bg-neutral-800 overflow-hidden">
                      {photoSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photoSrc}
                          alt={r.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-neutral-700 flex items-center justify-center text-xl font-semibold text-slate-600">
                            {r.name?.[0]?.toUpperCase() ?? "R"}
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-5 space-y-3">
                    <div>
                      <h2 className="font-semibold text-lg leading-tight">
                        {r.name}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        {r.city}
                        {r.state ? `, ${r.state}` : ""}
                      </p>
                    </div>

                    {r.cuisines?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {r.cuisines.map((c: string, i: number) => (
                          <span
                            key={i}
                            className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-300"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-3 border-t dark:border-neutral-800 space-y-1">
                      <p className="text-sm">
                        {r.phone ? (
                          <a
                            href={`tel:${r.phone}`}
                            className="text-indigo-600 hover:underline"
                          >
                            {r.phone}
                          </a>
                        ) : (
                          <span className="text-slate-400">No phone listed</span>
                        )}
                      </p>
                      <p className="text-sm text-slate-500">
                        {r.addressLine1 ?? r.city ?? "Address not available"}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <Link
                        href={`/restaurants/${r.slug}`}
                        className="flex-1 text-center text-sm px-3 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800"
                      >
                        View
                      </Link>
                      <Link
                        href={`/r/${r.slug}`}
                        className="flex-1 text-center text-sm px-3 py-2 rounded-md border hover:bg-slate-50 dark:hover:bg-neutral-800"
                      >
                        Reserve
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-2 rounded-md border disabled:opacity-50"
            >
              Prev
            </button>

            <div className="text-sm text-slate-600">
              Page <span className="font-medium">{meta.page}</span> of <span className="font-medium">{meta.totalPages}</span>
              {meta.total > 0 && <span className="text-slate-400"> · {meta.total} results</span>}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
              className="px-3 py-2 rounded-md border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
