"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import { API_URL } from "../lib/apiConfig";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Save extra profile info (name) to our own backend/MongoDB
           // Save extra profile info (name) to our own backend/MongoDB
      const userRes = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: userCredential.user.uid,
          name,
          email,
        }),
      });
      if (!userRes.ok) {
        const data = await userRes.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create user record.");
      }

      router.push("/profile");
    } catch (err: any) {
      setError(
        err.message.includes("email-already")
          ? "This email is already registered."
          : "Signup failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-sm border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 text-center">
          {t.signupTitle}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {t.fullNameLabel}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {t.emailLabel}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
            />
          </div>

          <div>
  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
    {t.passwordLabel}
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      minLength={6}
      className="w-full px-3 py-2 pr-16 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
    >
      {showPassword ? t.hide : t.show}
    </button>
    </div>
    </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-md py-2 font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center mt-4">
          {t.alreadyHaveAccount}{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-900 dark:text-zinc-50"
          >
            {t.login}
          </Link>
        </p>
      </div>
    </div>
  );
}
