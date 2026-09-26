"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../lib/LanguageContext";
import { translations } from "../../lib/translations";
import { API_URL } from "../../lib/apiConfig";

export default function RecruiterSignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    website: "",
    industry: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

            // Create the User record first
      const userRes = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: userCredential.user.uid,
          name: form.name,
          email: form.email,
        }),
      });
      if (!userRes.ok) {
        const data = await userRes.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create user record.");
      }

      // Then create the Company (this also sets user.role = "recruiter")
      const companyRes = await fetch(`${API_URL}/api/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: userCredential.user.uid,
          name: form.companyName,
          website: form.website,
          industry: form.industry,
          description: form.description,
        }),
      });
      if (!companyRes.ok) {
        const data = await companyRes.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create company record.");
      }

      sessionStorage.setItem("userRole", "recruiter");
      router.push("/recruiter/dashboard");
      
      sessionStorage.setItem("userRole", "recruiter");
      router.push("/recruiter/dashboard");
    } catch (err: any) {
      setError(
        err.message.includes("email-already")
          ? t.emailAlreadyRegistered
          : t.signupFailed
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 sm:px-8 py-10 max-w-lg mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-2">
        {t.recruiterSignupTitle}
      </h1>
      <p className="text-sm text-slate-600 mb-6">
        {t.createAccountSubtitle}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white border border-[#0F172A]/10 rounded-xl p-5 sm:p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t.yourNameLabel}</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t.workEmailLabel}</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
          />
        </div>
        <div>
  <label className="block text-sm font-medium text-slate-700 mb-1">{t.passwordLabel}</label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={form.password}
      onChange={handleChange}
      required
      minLength={6}
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

        <hr className="border-[#0F172A]/10 my-1" />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t.companyNameLabel}</label>
          <input
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t.websiteLabel}</label>
          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t.industryLabel}</label>
          <input
            name="industry"
            value={form.industry}
            onChange={handleChange}
            placeholder="e.g. IT Services, EdTech"
            className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t.companyDescLabel}</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#F5A623] text-[#0F172A] rounded-lg py-2.5 font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {submitting ? t.creatingAccount : t.createRecruiterBtn}
        </button>
      </form>
    </div>
  );
}
