"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../../lib/LanguageContext";
import { translations } from "../../lib/translations";
import { getDeviceInfo } from "../../lib/deviceDetect";
import { API_URL } from "../../lib/apiConfig";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"login" | "otp">("login");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pendingUid, setPendingUid] = useState("");
  const [deviceInfo, setDeviceInfo] = useState({
    browser: "",
    os: "",
    deviceType: "",
  });

  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      sessionStorage.setItem("otpPending", "true");

      const info = getDeviceInfo();
      setDeviceInfo(info);
      setPendingUid(cred.user.uid);

      const res = await fetch(`${API_URL}/api/login-tracking/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: cred.user.uid,
          ...info,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        sessionStorage.removeItem("otpPending");
        await auth.signOut();
        setError(data.error);
        return;
      }

      if (data.requiresOtp) {
        setStep("otp");
      } else {
        sessionStorage.removeItem("otpPending");
        router.push("/admin/dashboard");
      }
    } catch (err) {
      sessionStorage.removeItem("otpPending");
      await auth.signOut();
      setError(t.invalidCredentials);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/login-tracking/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: pendingUid,
          otp,
          ...deviceInfo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        sessionStorage.removeItem("otpPending");
        router.push("/admin/dashboard");
      }
    } catch {
      setError("Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-sm border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 sm:p-8">
        {step === "login" ? (
          <>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 text-center">
              {t.adminLoginTitle}
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  {t.emailLabel}
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-md py-2 font-medium hover:opacity-90 transition"
              >
                {t.loginTitle}
              </button>
            </form>

            <p className="text-sm text-slate-600 text-center mt-4">
              <Link
                href="/forgot-password"
                className="font-medium text-[#0F172A]"
              >
                {t.forgotPassword}
              </Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 text-center">
              {t.verifyLoginTitle}
            </h1>

            <p className="text-sm text-slate-600 text-center mb-4">
              {t.chromeOtpNotice}
            </p>

            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  OTP
                </label>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-md py-2 font-medium hover:opacity-90 transition"
              >
                {t.verifyAndContinue}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}