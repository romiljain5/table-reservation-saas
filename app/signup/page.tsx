"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const { data: session, status } = useSession();

  // 🔥 Redirect if logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  // Wait while checking session
  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Checking session...
      </div>
    );
  }

  const submit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        restaurantName: restaurant,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Signup failed");
      return;
    }

    toast.success("Account created! Login now");
    router.push("/login");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="w-full max-w-sm backdrop-blur-xl bg-white/10 p-8 rounded-xl shadow-xl border border-white/20 space-y-5"
      >
        <h1 className="text-3xl font-bold text-center text-white drop-shadow-md">
          Create Account
        </h1>

        <Input
          placeholder="Your Name"
          className="bg-white/20 text-white placeholder:text-white/70"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Restaurant Name"
          className="bg-white/20 text-white placeholder:text-white/70"
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
        />

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

        <Button type="submit" className="w-full bg-white text-black hover:bg-white/90">
          Create Account
        </Button>

        <p className="text-center text-sm text-white/90 pt-2">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold underline text-white">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
