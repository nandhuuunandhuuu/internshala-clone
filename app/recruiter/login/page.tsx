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

export default function RecruiterLoginPage() {
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

      const res = await fetch(
        `${API_URL}/api/login-tracking/check`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firebaseUid: cred.user.uid,
            ...info,
          }),
        }
      );

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
        router.push("/recruiter/dashboard");
      }
    } catch (err) {
      sessionStorage.removeItem("otpPending");
      await auth.signOut();
      setError("Invalid email or password.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `${API_URL}/api/login-tracking/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firebaseUid: pendingUid,
            otp,
            ...deviceInfo,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        sessionStorage.removeItem("otpPending");
        router.push("/recruiter/dashboard");
      }
    } catch {
      setError("Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-sm bg-white border border-[#0F172A]/10 rounded-xl p-6 sm:p-8 shadow-sm">
        {step === "login" ? (
          <>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-6 text-center">
              {t.loginTitle}
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t.emailLabel}
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
                />
              </div>

              <div>
  <label className="block text-sm font-medium text-slate-700 mb-1">
    {t.passwordLabel}
  </label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className="w-full px-3 py-2 pr-16 border border-[#0F172A]/15 rounded-lg"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-[#0F172A]"
    >
      {showPassword ? t.hide : t.show}
    </button>
      </div>
      </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                className="bg-[#F5A623] text-[#0F172A] rounded-lg py-2.5 font-semibold hover:opacity-90 transition"
              >
                {t.loginTitle}
              </button>
            </form>

            <p className="text-sm text-slate-600 text-center mt-4">
              {t.noAccount}{" "}
              <Link
                href="/recruiter/signup"
                className="font-medium text-[#0F172A]"
              >
                {t.signup}
              </Link>
            </p>

            <p className="text-sm text-slate-600 text-center mt-3">
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
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-6 text-center">
              {t.verifyLoginTitle}
            </h1>

            <p className="text-sm text-slate-600 text-center mb-4">
              {t.chromeOtpNotice}
            </p>

            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  OTP
                </label>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                className="bg-[#F5A623] text-[#0F172A] rounded-lg py-2.5 font-semibold hover:opacity-90 transition"
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