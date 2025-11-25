"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

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
    <div className="h-screen flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-white p-6 shadow rounded space-y-4"
      >
        <h1 className="text-xl font-semibold">Create Account</h1>

        <Input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />

        <Input
          placeholder="Restaurant Name"
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
        />

        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button type="submit" className="w-full">Create Account</Button>
      </form>
    </div>
  );
}
