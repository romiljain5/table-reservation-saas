import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MotionDiv } from "@/components/motion/MotionDiv";

export default async function RestaurantPublicPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!params?.slug) return notFound();

  let restaurant = null;

  try {
    restaurant = await prisma.restaurant.findUnique({
      where: { slug: params.slug },
    });
  } catch (error) {
    console.error("DB Error:", error);
  }

  if (!restaurant) return notFound();

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="grid gap-8 md:grid-cols-[1.3fr,1fr] items-center">
        <div className="space-y-4">
          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
              Reserve your table
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Effortless dining at{" "}
              <span className="text-emerald-400">{restaurant.name}</span>
            </h2>
          </MotionDiv>

          <MotionDiv
            className="text-sm text-slate-300 leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Book your next visit in seconds. Choose your time, party size and
            preferences — we&apos;ll have your table ready when you arrive.
          </MotionDiv>

          <MotionDiv
            className="flex flex-wrap gap-3 pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Link
              href={`/${restaurant.slug}/reserve`}
              className="inline-flex items-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition"
            >
              Reserve a Table
              <span className="ml-2 text-xs">→</span>
            </Link>

            <div className="flex flex-col text-xs text-slate-400">
              <span>Instant confirmation</span>
              <span>No app download required</span>
            </div>
          </MotionDiv>
        </div>

        {/* Right side image / ambient card */}
        <MotionDiv
          className="relative aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden border border-emerald-500/30 bg-gradient-to-tr from-emerald-500/10 via-slate-900 to-slate-800 flex items-end p-4"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0,rgba(52,211,153,0.25),transparent_50%),radial-gradient(circle_at_90%_100%,rgba(56,189,248,0.25),transparent_55%)]" />

          <div className="relative z-10 text-xs text-slate-100 space-y-1">
            <p className="font-semibold">Tonight at {restaurant.name}</p>
            <p className="text-slate-300">
              See open times, add celebration notes, and check in with a QR code
              when you arrive.
            </p>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}
