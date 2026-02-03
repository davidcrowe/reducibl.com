/**
 * Canonical WaitlistForm Component
 *
 * Copy this to new projects. Customize colors/text as needed.
 *
 * Features:
 * - Plausible tracking (Form: Submission, Waitlist Signup)
 * - Handles success, error, already_subscribed states
 * - Configurable via props
 *
 * Prerequisites:
 * 1. Add to src/types/global.d.ts:
 *    declare global {
 *      interface Window {
 *        plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
 *      }
 *    }
 *    export {};
 *
 * 2. Plausible script in layout.tsx with data-domain attribute
 *
 * 3. Goals in Plausible dashboard:
 *    - Custom Event: "Form: Submission"
 *    - Custom Event: "Waitlist Signup"
 */

"use client";

import { useState } from "react";

const DEFAULT_API =
  "https://us-central1-trim-glazing-445021-n8.cloudfunctions.net/joinWaitlist";

interface WaitlistFormProps {
  /** Identifies where signup came from (e.g., "inner-hero", "apprentice-bottom") */
  source?: string;
  /** Override default waitlist API endpoint */
  apiUrl?: string;
  /** Button text */
  buttonText?: string;
  /** Message shown on successful signup */
  successMessage?: string;
  /** Additional CSS classes for the form container */
  className?: string;
  /** Color variant: "dark" (white text) or "light" (dark text) */
  variant?: "dark" | "light";
}

export default function WaitlistForm({
  source = "website",
  apiUrl = DEFAULT_API,
  buttonText = "join the waitlist",
  successMessage = "you're on the list! we'll be in touch.",
  className = "",
  variant = "light",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    // Track form submission attempt
    if (typeof window !== "undefined" && window.plausible) {
      window.plausible("Form: Submission", { props: { source } });
    }

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      const data = await res.json();

      if (data.ok) {
        setStatus("success");
        setMessage(
          data.message === "already_subscribed"
            ? "you're already on the list!"
            : successMessage
        );
        setEmail("");

        // Track successful signup
        if (typeof window !== "undefined" && window.plausible) {
          window.plausible("Waitlist Signup", { props: { source } });
        }
      } else {
        setStatus("error");
        setMessage(
          data.error === "invalid_email"
            ? "please enter a valid email."
            : "something went wrong. try again."
        );
      }
    } catch {
      setStatus("error");
      setMessage("something went wrong. try again.");
    }
  }

  // Style variants
  const styles = {
    dark: {
      input: "border-white/20 bg-white/5 text-white placeholder-white/30 focus:border-white/40 focus:ring-white/20",
      button: "bg-white/90 text-gray-900 hover:bg-white",
      success: "text-green-400",
      error: "text-red-400",
    },
    light: {
      input: "border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500",
      button: "bg-gray-900 text-white hover:bg-gray-700",
      success: "text-green-700",
      error: "text-red-600",
    },
  };

  const s = styles[variant];

  if (status === "success") {
    return (
      <div className={`text-center ${className}`}>
        <p className={`text-sm font-medium ${s.success}`}>{message}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col items-center gap-3 sm:flex-row sm:justify-center ${className}`}
    >
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setStatus("idle");
        }}
        className={`w-full max-w-xs rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-1 sm:w-64 ${s.input}`}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={`rounded-lg px-6 py-3 text-sm font-semibold shadow-sm disabled:opacity-50 ${s.button}`}
      >
        {status === "loading" ? "joining..." : buttonText}
      </button>
      {status === "error" && (
        <p className={`w-full text-center text-xs sm:w-auto ${s.error}`}>
          {message}
        </p>
      )}
    </form>
  );
}
