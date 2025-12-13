"use client";

import { useSession } from "next-auth/react";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Coffee, Calendar, Users, Tag, Truck, Star } from "lucide-react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const { theme } = useTheme();

  return (
    // 🔥 Enable dark mode via ThemeContext
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900 dark:from-neutral-950 dark:to-neutral-900 dark:text-slate-100">

        {/* HEADER */}
        <div className="w-full border-b bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="text-lg font-semibold">TableFlow</div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800">
                  SaaS
                </span>
                <span>— Smart reservations</span>
              </div>
            </div>

            <nav className="flex items-center gap-3">
              {status === "authenticated" && (
                <Link
                  href="/dashboard"
                  className="text-sm hidden md:inline-flex px-3 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-neutral-800"
                >
                  Dashboard
                </Link>
              )}

              {status !== "authenticated" && (
                <>
                  <Link href="/login" className="text-sm px-3 py-1 hover:underline">
                    Log in
                  </Link>

                  <Link
                    href="/signup"
                    className="hidden sm:inline-flex items-center gap-2 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-black px-3 py-1 text-sm"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </nav>

          </div>
        </div>

        {/* HERO SECTION */}
        <header className="relative overflow-hidden">

          {/* background blobs */}
          <div className="absolute inset-0 -z-10">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute -left-20 -top-28 w-96 h-96 bg-rose-200/40 dark:bg-rose-900/20 blur-3xl rounded-full"
            />
            <motion.div
              animate={{ x: [0, -20, 0], y: [0, 10, 0] }}
              transition={{ duration: 18, repeat: Infinity }}
              className="absolute right-0 top-0 w-72 h-72 bg-amber-200/30 dark:bg-amber-900/20 blur-2xl rounded-full"
            />
          </div>

          <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-10 items-center">

              {/* LEFT HERO */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <span className="inline-flex items-center gap-2 bg-slate-100 dark:bg-neutral-800 py-1 px-3 rounded-full text-xs">
                  <Coffee size={14} /> SaaS for restaurants
                </span>

                <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
                  TableFlow — Smart reservations, effortless service
                </h1>

                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl">
                  Accept online reservations, manage floor seating, let guests
                  pre-order meals, and speed up check-ins — all from a single
                  beautiful dashboard.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/reserve"
                    className="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-black px-4 py-2 rounded-md font-medium shadow hover:shadow-lg"
                  >
                    Reserve a table
                  </Link>

                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 border dark:border-neutral-700 px-4 py-2 rounded-md text-sm text-slate-700 dark:text-slate-200"
                  >
                    Dashboard demo
                  </Link>
                </div>
              </motion.div>

              {/* RIGHT MOCKUP */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="mx-auto max-w-md p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-slate-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-semibold">La Piazza</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Open • 5 PM - 11 PM
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="col-span-2 bg-slate-50 dark:bg-neutral-900 rounded-lg p-3">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Selected
                      </div>
                      <div className="font-medium mt-1">Dec 20 • 7:30 PM</div>
                    </div>

                    <div className="rounded-lg border dark:border-neutral-700 p-3">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Guests</div>
                      <div className="text-lg font-semibold">4</div>
                    </div>

                    <div className="rounded-lg border dark:border-neutral-700 p-3">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Seating</div>
                      <div className="text-lg font-semibold">Window</div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-emerald-600 text-white dark:bg-emerald-500 py-2 rounded-md">
                      Confirm
                    </button>
                    <button className="border dark:border-neutral-700 px-3 py-2 rounded-md text-sm">
                      Edit
                    </button>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </header>

        {/* FEATURES */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-semibold text-center">All you need to run a modern restaurant</h2>
            <p className="text-center text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
              Reservation engine, pre-orders, floor management, analytics — for independent restaurants & chains.
            </p>

            <div className="mt-10 grid md:grid-cols-3 gap-6">
              <FeatureCard icon={<Calendar size={20} />} title="Smart Availability">
                Block overlaps, auto-allocate tables, and suggest best times.
              </FeatureCard>
              <FeatureCard icon={<Tag size={20} />} title="Pre-order & Add-ons">
                Let guests pre-order dishes and add-ons.
              </FeatureCard>
              <FeatureCard icon={<Truck size={20} />} title="POS Integration">
                Sync pre-orders with kitchen or POS instantly.
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-neutral-900 dark:to-neutral-950">
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="text-lg font-semibold text-center">How it works</h3>
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <HowStep num={1} title="Search & Book" desc="Guests find the best available times." />
              <HowStep num={2} title="Pre-order" desc="Add dishes & add-ons before arrival." />
              <HowStep num={3} title="Host & Seat" desc="Staff confirms & seats guests fast." />
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h3 className="text-xl font-semibold">Loved by restaurants & guests</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Real feedback from people using TableFlow daily.
            </p>

            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <Testimonial name="Maria Gomez" title="Owner, La Piazza">
                "Reduced no-shows and guests love pre-ordering."
              </Testimonial>
              <Testimonial name="Ahmed Khan" title="Manager, Spice House">
                "Dashboard is clean and easy for our staff."
              </Testimonial>
              <Testimonial name="Priya Sharma" title="Customer">
                "My birthday pre-order was perfect!"
              </Testimonial>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="py-16 bg-gradient-to-b from-slate-50 to-white dark:from-neutral-900 dark:to-neutral-950">
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="text-2xl font-semibold text-center">Pricing</h3>
            <p className="text-center text-slate-500 dark:text-slate-400 mt-2">
              Simple pricing for restaurants of all sizes.
            </p>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <PriceCard title="Starter" price="₹499/mo" features={["Online reservations", "1 location", "Email support"]} />
              <PriceCard title="Pro" price="₹1,299/mo" featured features={["Multiple locations", "Pre-order & add-ons", "Priority support"]} />
              <PriceCard title="Enterprise" price="Contact us" features={["Custom integrations", "SLA onboarding", "Dedicated manager"]} />
            </div>

            <div className="mt-8 flex justify-center">
              <Link href="/signup" className="px-6 py-3 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-black">
                Start free trial
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-8 text-sm text-slate-500 dark:text-slate-400">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-lg font-semibold">TableFlow</div>
              <div className="text-xs">© {new Date().getFullYear()} TableFlow</div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/docs">Docs</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

/* ---------- Small components with dark mode ---------- */

function FeatureCard({ icon, title, children }: any) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-700 p-6 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-md bg-slate-50 dark:bg-neutral-800">{icon}</div>
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{children}</p>
        </div>
      </div>
    </motion.article>
  );
}

function HowStep({ num, title, desc }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="rounded-lg border bg-white dark:bg-neutral-900 dark:border-neutral-700 p-6"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center font-semibold">
          {num}
        </div>
        <div>
          <h5 className="font-semibold">{title}</h5>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

function Testimonial({ name, title, children }: any) {
  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="rounded-lg border bg-white dark:bg-neutral-900 dark:border-neutral-700 p-6 text-left"
    >
      <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{children}</p>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center">
          <Star size={16} />
        </div>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{title}</div>
        </div>
      </div>
    </motion.blockquote>
  );
}

function PriceCard({ title, price, features, featured = false }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={`rounded-2xl p-6 bg-white dark:bg-neutral-900 border dark:border-neutral-700 ${
        featured ? "ring-2 ring-amber-300 dark:ring-amber-600" : ""
      }`}
    >
      <div className="flex flex-col gap-4">
        <div>
          <h4 className="text-lg font-semibold">{title}</h4>
          <div className="text-2xl font-bold mt-2">{price}</div>
        </div>

        <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
          {features.map((f: string, i: number) => (
            <li key={i} className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" className="text-emerald-500">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        <Link
          href="/signup"
          className={`mt-4 inline-flex items-center justify-center w-full rounded-md py-2 ${
            featured ? "bg-amber-500 text-white" : "border dark:border-neutral-700"
          }`}
        >
          {featured ? "Start pro" : "Choose"}
        </Link>
      </div>
    </motion.div>
  );
}
