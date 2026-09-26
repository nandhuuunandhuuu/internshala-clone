"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import { useOtpGuard } from "../lib/useOtpGuard";
import { API_URL } from "../lib/apiConfig";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CLOUDINARY_CLOUD_NAME = "tz6kh7li";
const CLOUDINARY_UPLOAD_PRESET = "resume_uploads";
type Step = "form" | "otp" | "payment" | "done";

export default function ResumeBuilderPage() {
  const { checked, blocked } = useOtpGuard("/login");

  const { user, loading } = useAuth();
  const router = useRouter();
  const [plan, setPlan] = useState("free");
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [otp, setOtp] = useState("");
  const [finalResumeUrl, setFinalResumeUrl] = useState("");
  const { language } = useLanguage();
  const t = translations[language];
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    photoUrl: "",
    education: "",
    experience: "",
    skills: "",
    summary: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetch(`${API_URL}/api/payments/plan/${user.uid}`)
        .then((res) => res.json())
        .then((data) => setPlan(data.plan))
        .catch((err) => console.error(err));

      fetch(`${API_URL}/api/users/${user.uid}`)
        .then((res) => res.json())
        .then((data) =>
          setForm((prev) => ({
            ...prev,
            fullName: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            education: data.education || "",
            skills: (data.skills || []).join(", "),
          }))
        )
        .catch((err) => console.error(err));
    }
  }, [user, loading, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: uploadData }
    );
    const data = await res.json();
    if (data.secure_url) {
      setForm((prev) => ({ ...prev, photoUrl: data.secure_url }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");

    if (plan === "free") {
      setError(
        "Resume creation is available on paid plans only. Please upgrade in Pricing."
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `${API_URL}/api/resume-builder/request-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firebaseUid: user.uid }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setStep("otp");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(
        `${API_URL}/api/resume-builder/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firebaseUid: user.uid, otp }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setStep("payment");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const generateResumePdf = (): Promise<Blob> => {
    return new Promise((resolve) => {
      const doc = new jsPDF();
      let y = 20;

      doc.setFontSize(20);
      doc.text(form.fullName || "Your Name", 20, y);
      y += 8;

      doc.setFontSize(10);
      doc.text(`${form.email} | ${form.phone}`, 20, y);
      y += 12;

      doc.setFontSize(13);
      doc.text(t.summaryLabel, 20, y);
      y += 6;
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(form.summary || "-", 170);
      doc.text(summaryLines, 20, y);
      y += summaryLines.length * 5 + 8;

      doc.setFontSize(13);
      doc.text(t.educationLabel, 20, y);
      y += 6;
      doc.setFontSize(10);
      const eduLines = doc.splitTextToSize(form.education || "-", 170);
      doc.text(eduLines, 20, y);
      y += eduLines.length * 5 + 8;

      doc.setFontSize(13);
      doc.text(t.experienceLabel, 20, y);
      y += 6;
      doc.setFontSize(10);
      const expLines = doc.splitTextToSize(form.experience || "-", 170);
      doc.text(expLines, 20, y);
      y += expLines.length * 5 + 8;

      doc.setFontSize(13);
      doc.text(t.skillsLabel, 20, y);
      y += 6;
      doc.setFontSize(10);
      const skillLines = doc.splitTextToSize(form.skills || "-", 170);
      doc.text(skillLines, 20, y);

      const blob = doc.output("blob");
      resolve(blob);
    });
  };

  const handlePayment = async () => {
    if (!user) return;
    setError("");
    setSubmitting(true);

    try {
      const orderRes = await fetch(
        `${API_URL}/api/payments/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planKey: "resume_50" }),
        }
      );
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setError(orderData.error);
        setSubmitting(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: "INR",
        name: "CareerLaunch",
        description: "Resume Creation (₹50)",
        order_id: orderData.order.id,
        handler: async () => {
          const pdfBlob = await generateResumePdf();
          const uploadData = new FormData();
          uploadData.append("file", pdfBlob, "resume.pdf");
          uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

          const cloudRes = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
            { method: "POST", body: uploadData }
          );
          const cloudData = await cloudRes.json();

          await fetch(`${API_URL}/api/resume-builder/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firebaseUid: user.uid,
              resumeUrl: cloudData.secure_url,
            }),
          });

          setFinalResumeUrl(cloudData.secure_url);
          setStep("done");
          setSubmitting(false);
        },
        modal: { ondismiss: () => setSubmitting(false) },
        theme: { color: "#F5A623" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (!checked || blocked) {
    return (
      <div className="px-4 sm:px-8 py-10 max-w-5xl mx-auto text-center">
        <p className="text-slate-600">{t.loading}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-8 py-10 max-w-2xl mx-auto text-center">
        <p className="text-slate-600">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-10 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-1">
        {t.resumeBuilderTitle}
      </h1>

      <p className="text-sm text-slate-500 mb-6">
        {t.resumeBuilderSubtitle}
      </p>

      {plan === "free" && (
        <div className="bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-lg p-4 text-sm text-[#B7791F] mb-6">
          {t.requiresPaidPlan}{" "}
          <Link href="/pricing" className="underline font-medium">
            {t.viewPlans}
          </Link>
          .
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 mb-6">
          {error}
        </div>
      )}

      {step === "form" && (
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col gap-4 bg-white border border-[#0F172A]/10 rounded-xl p-5 sm:p-6 shadow-sm"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.fullNameLabel}
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.photoLabel}
            </label>
            <div className="border border-[#0F172A]/15 rounded-lg p-4">
              <input
                id="photoUpload"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <label
                htmlFor="photoUpload"
                className="flex items-center justify-center gap-2 w-full border border-dashed border-[#0F172A]/20 rounded-lg px-4 py-4 text-sm font-medium text-slate-600 cursor-pointer hover:bg-slate-50 transition"
              >
                <span className="text-base">📷</span>
                <span>{t.photoLabel}</span>
              </label>
              {form.photoUrl && (
                <div className="mt-4 flex items-center justify-center">
                  <img
                    src={form.photoUrl}
                    alt=""
                    className="w-20 h-20 rounded-lg object-cover border border-[#0F172A]/10"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.summaryLabel}
            </label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.educationLabel}
            </label>
            <textarea
              name="education"
              value={form.education}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.experienceLabel}
            </label>
            <textarea
              name="experience"
              value={form.experience}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.skillsLabel}
            </label>
            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-[#F5A623] text-[#0F172A] rounded-lg py-2.5 font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? t.sendingOtp : t.continueToPayment}
          </button>
        </form>
      )}

      {step === "otp" && (
        <form
          onSubmit={handleVerifyOtp}
          className="flex flex-col gap-4 bg-white border border-[#0F172A]/10 rounded-xl p-5 sm:p-6 shadow-sm"
        >
          <p className="text-sm text-slate-600">
            {t.enterOtpPayment}
          </p>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
            className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg text-center tracking-widest"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#F5A623] text-[#0F172A] rounded-lg py-2.5 font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? t.verifying : t.verifyOtp}
          </button>
        </form>
      )}

      {step === "payment" && (
        <div className="bg-white border border-[#0F172A]/10 rounded-xl p-5 sm:p-6 shadow-sm text-center">
          <p className="text-sm text-slate-600 mb-4">
            {t.otpVerifiedPayNow}
          </p>
          <button
            onClick={handlePayment}
            disabled={submitting}
            className="bg-[#F5A623] text-[#0F172A] rounded-lg px-6 py-2.5 font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? t.processing : t.payNow}
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="bg-[#0D9488]/10 border border-[#0D9488]/30 rounded-lg p-5 text-center">
          <p className="font-medium text-[#0D9488] mb-3">
            {t.resumeGeneratedSaved}
          </p>

          <a
            href={finalResumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0F172A] font-medium underline"
          >
            {t.viewYourResume}
          </a>
        </div>
      )}
    </div>
  );
}