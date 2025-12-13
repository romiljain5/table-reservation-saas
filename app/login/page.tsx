"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data: session, status } = useSession();

  // 🔥 If already logged in → go to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  // Avoid rendering login form when session is loading
  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Checking session...
      </div>
    );
  }

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      toast.error("Invalid email or password");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="w-full max-w-sm backdrop-blur-xl bg-white/10 p-8 rounded-xl shadow-xl border border-white/20 space-y-5"
      >
        <h1 className="text-3xl font-bold text-center text-white drop-shadow-md">Log In</h1>

        <Input
          type="email"
          placeholder="Email"
          className="bg-white/20 text-white placeholder:text-white/70"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          className="bg-white/20 text-white placeholder:text-white/70"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-white/90">
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-center text-sm text-white/90 pt-2">
          New user?{" "}
          <Link href="/signup" className="font-semibold underline text-white">
            Create an account
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
