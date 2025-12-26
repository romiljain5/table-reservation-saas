"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordModal({ open, onOpenChange }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Form submitted");
    setLoading(true);
    setError("");
    setMessage("");

    console.log("Submitting forgot password for:", email);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setMessage("Reset link sent to your email!");
      setEmail("");
      setTimeout(() => onOpenChange(false), 2000);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setMessage("");
    onOpenChange(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg p-4" onClick={handleClose}>
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-sm bg-gradient-to-br from-white/20 to-white/10 p-8 rounded-2xl shadow-2xl border border-white/40 backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-white/70 text-sm mb-6">Enter your email to receive a reset link</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/30 text-white placeholder:text-white/50 border-white/30"
                  required
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-200 text-sm bg-red-500/20 p-2 rounded"
                >
                  {error}
                </motion.p>
              )}
              {message && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-200 text-sm bg-green-500/20 p-2 rounded"
                >
                  {message}
                </motion.p>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="flex-1 bg-white text-indigo-600 font-semibold hover:bg-white/90"
                >
                  {loading ? "Sending..." : "Send Link"}
                </Button>
                <Button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 bg-white/20 text-white hover:bg-white/30 border border-white/40 font-semibold"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}