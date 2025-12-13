import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MotionDiv } from "@/components/motion/MotionDiv";

export default async function CheckInPage(props: { params: { code: string } }) {
  const { params } = await props;
  const reservation = await prisma.reservation.findFirst({
    where: { checkInCode: params.code },
    include: { restaurant: true },
  });

  if (!reservation) return notFound();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <MotionDiv
        className="w-full max-w-md rounded-3xl bg-slate-900/80 border border-emerald-500/30 p-6 text-center shadow-2xl"
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
      >
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-2">
          Welcome to {reservation.restaurant.name}
        </p>

        <h1 className="text-2xl font-semibold mb-3">You&apos;re checked in 🎉</h1>

        <p className="text-sm text-slate-300 mb-4">
          {reservation.guestName}, party of {reservation.partySize}
          <br />
          {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
        </p>

        <p className="text-xs text-slate-400">
          Please wait to be seated. A host has been notified.
        </p>
      </MotionDiv>
    </div>
  );
}
