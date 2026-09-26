"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage, LANGUAGES, Language } from "../lib/LanguageContext";
import { useAuth } from "../lib/AuthContext";
import { API_URL } from "../lib/apiConfig";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [pendingFrench, setPendingFrench] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setPendingFrench(false);
        setError("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = async (code: Language) => {
    setOpen(false);
    setError("");

    if (code === "fr") {
      if (!user) {
        setError("Please log in to switch to French.");
        return;
      }

      setSending(true);

      try {
        await fetch(`${API_URL}/api/language/request-french-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firebaseUid: user.uid }),
        });

        setPendingFrench(true);
      } catch {
        setError("Could not send verification code.");
      } finally {
        setSending(false);
      }

      return;
    }

    setLanguage(code);
  };

  const confirmFrenchOtp = async () => {
    if (!user) return;

    setError("");

    try {
      const res = await fetch(
        `${API_URL}/api/language/verify-french-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firebaseUid: user.uid,
            otp,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setLanguage("fr");
        setPendingFrench(false);
        setOtp("");
      }
    } catch {
      setError("Something went wrong.");
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-xs font-medium border border-[#0F172A]/15 rounded-md px-2.5 py-1.5 hover:bg-[#0F172A]/5 transition"
      >
        🌐 {LANGUAGES.find((l) => l.code === language)?.label}
      </button>

      {open && (
        <div className="absolute right-0 mt-1 bg-white border border-[#0F172A]/10 rounded-lg shadow-md z-50 w-40">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`block w-full text-left px-3 py-2 text-sm hover:bg-[#F5A623]/10 ${
                language === lang.code
                  ? "font-semibold text-[#0F172A]"
                  : "text-slate-600"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}

      {pendingFrench && (
        <div className="absolute right-0 mt-1 bg-white border border-[#0F172A]/10 rounded-lg shadow-md z-50 w-64 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-600">
              Enter the OTP sent to your email to enable French.
            </p>

            <button
              onClick={() => {
                setPendingFrench(false);
                setOtp("");
                setError("");
              }}
              className="text-slate-400 hover:text-slate-600 text-sm ml-2 shrink-0"
              aria-label="Cancel"
            >
              ✕
            </button>
          </div>

          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full px-2 py-1.5 border border-[#0F172A]/15 rounded text-sm mb-2 text-center tracking-widest"
          />

          {error && (
            <p className="text-xs text-red-600 mb-2">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={confirmFrenchOtp}
              className="flex-1 bg-[#F5A623] text-[#0F172A] text-sm font-medium rounded py-1.5"
            >
              Verify
            </button>

            <button
              onClick={() => {
                setPendingFrench(false);
                setOtp("");
                setError("");
              }}
              className="flex-1 border border-[#0F172A]/15 text-slate-600 text-sm font-medium rounded py-1.5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && !pendingFrench && (
        <p className="absolute right-0 mt-1 text-xs text-red-600 bg-white border border-red-200 rounded p-2 w-48">
          {error}
        </p>
      )}
    </div>
  );
}