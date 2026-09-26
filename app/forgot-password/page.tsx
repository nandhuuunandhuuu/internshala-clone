"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import { API_URL } from "../lib/apiConfig";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "confirm" | "done">("request");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [useCustomPassword, setUseCustomPassword] = useState(false);
  const [customPassword, setCustomPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const { language } = useLanguage();
  const t = translations[language];

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(
        `${API_URL}/api/password-reset/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setStep("confirm");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(
        `${API_URL}/api/password-reset/confirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier,
            code,
            customPassword: useCustomPassword ? customPassword : null,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setGeneratedPassword(data.newPassword || "");
        setStep("done");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-sm bg-white border border-[#0F172A]/10 rounded-xl p-6 sm:p-8 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-1 text-center">
          {t.forgotPassword}
        </h1>

        {step !== "done" && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <span
              className={`w-2 h-2 rounded-full ${
                step === "request" ? "bg-[#F5A623]" : "bg-[#0D9488]"
              }`}
            />
            <span
              className={`w-2 h-2 rounded-full ${
                step === "confirm" ? "bg-[#F5A623]" : "bg-slate-200"
              }`}
            />
          </div>
        )}

        {step === "request" && (
          <>
            <p className="text-sm text-slate-500 text-center mb-6">
              {t.enterEmailOrPhone}
            </p>

            <form
              onSubmit={handleRequestCode}
              className="flex flex-col gap-4"
            >
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={t.emailOrPhonePlaceholder}
                required
                className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#F5A623] text-[#0F172A] rounded-lg py-2.5 font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {submitting ? t.sending : t.sendVerificationCode}
              </button>
            </form>
          </>
        )}

        {step === "confirm" && (
          <>
            <p className="text-sm text-slate-500 text-center mb-6">
              {t.enterOtpEmail}
            </p>

            <form onSubmit={handleConfirm} className="flex flex-col gap-4">
              <input
                name="otp-code"
                autoComplete="off"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t.otpPlaceholder}
                required
                maxLength={6}
                className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg text-center tracking-widest"
              />

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={useCustomPassword}
                  onChange={(e) => setUseCustomPassword(e.target.checked)}
                />
                {t.chooseOwnPassword}
              </label>

              {useCustomPassword && (
                <input
                  type="password"
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  placeholder={t.newPasswordPlaceholder}
                  minLength={6}
                  required
                  className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
                />
              )}

              {!useCustomPassword && (
                <p className="text-xs text-slate-500">
                  {t.randomPasswordNote}
                </p>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#F5A623] text-[#0F172A] rounded-lg py-2.5 font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {submitting ? t.resetting : t.resetPasswordBtn}
              </button>
            </form>
          </>
        )}

        {step === "done" && (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0D9488"
                strokeWidth="2.5"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="text-lg font-bold text-[#0F172A] mb-1">
              {t.resetSuccessTitle}
            </h2>

            <p className="text-sm text-slate-500 mb-5">
              {generatedPassword
                ? t.resetSuccessDesc
                : t.resetSuccessDescGeneric}
            </p>

            {generatedPassword && (
              <div className="bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-lg p-4 mb-5">
                <p className="text-xs text-[#B7791F] font-medium mb-2 uppercase tracking-wide">
                  {t.yourNewPassword}
                </p>

                <p className="font-mono text-lg font-bold text-[#0F172A] bg-white border border-[#F5A623]/30 rounded-lg px-4 py-3 select-all">
                  {generatedPassword}
                </p>
              </div>
            )}

            <Link
              href="/login"
              className="block w-full bg-[#F5A623] text-[#0F172A] rounded-lg py-2.5 font-semibold hover:opacity-90 transition"
            >
              {t.continueToLogin}
            </Link>
          </div>
        )}

        {step !== "done" && (
          <p className="text-sm text-slate-600 text-center mt-4">
            <Link href="/login" className="font-medium text-[#0F172A]">
              {t.backToLogin}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}