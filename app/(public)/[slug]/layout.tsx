// app/(public)/[slug]/layout.tsx
import { ReactNode } from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MotionDiv } from "@/components/motion/MotionDiv"; // small wrapper we'll add

type Props = {
  children: ReactNode;
  params: { slug: string };
};

export default async function PublicRestaurantLayout({
  children,
  params,
}: Props) {
  const { slug } = await params; // 👈 IMPORTANT FIX

  if (!slug) return notFound();

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
  });

  if (!restaurant) return notFound();

  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <div className="mx-auto max-w-5xl px-4 py-6">
          {/* Top bar with logo + name */}
          <header className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              {restaurant.logoUrl ? (
                <img
                  src={restaurant.logoUrl}
                  alt={restaurant.name}
                  className="h-10 w-10 rounded-full border border-slate-700 object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-semibold">
                  {restaurant.name[0]?.toUpperCase()}
                </div>
              )}

              <div>
                <h1 className="text-lg font-semibold tracking-tight">
                  {restaurant.name}
                </h1>
                {restaurant.city && (
                  <p className="text-xs text-slate-400">
                    {restaurant.city}, {restaurant.state}
                  </p>
                )}
              </div>
            </div>

            {/* Right side CTA */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              {restaurant.phone && <span>{restaurant.phone}</span>}
              {restaurant.websiteUrl && (
                <a
                  href={restaurant.websiteUrl}
                  className="underline decoration-dotted hover:text-slate-200"
                  target="_blank"
                >
                  Visit website
                </a>
              )}
            </div>
          </header>

          {/* Animated content container */}
          <MotionDiv
            className="rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl shadow-black/40 p-5 sm:p-8 backdrop-blur"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {children}
          </MotionDiv>

          <footer className="mt-8 text-center text-[11px] text-slate-500">
            Powered by TableFlow · Online Reservations
          </footer>
        </div>
      </body>
    </html>
  );
}
