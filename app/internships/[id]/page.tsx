"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../lib/AuthContext";
import { useLanguage } from "../../lib/LanguageContext";
import { translations } from "../../lib/translations";
import { useOtpGuard } from "../../lib/useOtpGuard";
import { API_URL } from "../../lib/apiConfig";

type Internship = {
  _id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  description: string;
};

export default function InternshipDetailPage() {
  const { checked, blocked } = useOtpGuard("/login");

  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    fetch(`${API_URL}/api/internships/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setInternship(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching internship:", err);
        setLoading(false);
      });
  }, [params.id]);

  useEffect(() => {
    if (user && params.id) {
      fetch(
        `${API_URL}/api/applications/check/${user.uid}/${params.id}`
      )
        .then((res) => res.json())
        .then((data) => setApplied(data.applied))
        .catch((err) =>
          console.error("Error checking application:", err)
        );
    }
  }, [user, params.id]);

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/api/users/role/${user.uid}`)
        .then((res) => res.json())
        .then((data) => setRole(data.role))
        .catch((err) =>
          console.error("Error fetching role:", err)
        );
    }
  }, [user]);

  const handleApply = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setApplying(true);

    try {
      await fetch(`${API_URL}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: user.uid,
          listingType: "Internship",
          listingId: internship?._id,
        }),
      });

      setApplied(true);
    } catch (err) {
      console.error("Error applying:", err);
    } finally {
      setApplying(false);
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
        <p className="text-zinc-600 dark:text-zinc-400">
          {t.loading}
        </p>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="px-4 sm:px-8 py-10 max-w-2xl mx-auto text-center">
        <p className="text-zinc-600 dark:text-zinc-400">
          {t.listingNotFound}
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-10 max-w-3xl mx-auto">
      <div className="bg-white border border-[#0F172A]/10 rounded-xl p-5 sm:p-6 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
          {internship.title}
        </h1>

        <p className="text-slate-600 mt-1">
          {internship.company}
        </p>

        <p className="text-sm text-slate-500 mt-1">
          {internship.location} • {internship.duration}
        </p>

        <p className="text-slate-700 mt-4 leading-relaxed">
          {internship.description}
        </p>

        {(!user || role === "user") && (
          <button
            onClick={handleApply}
            disabled={applied || applying}
            className="mt-6 w-full sm:w-auto bg-[#F5A623] text-[#0F172A] rounded-lg px-6 py-2.5 font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {applied
              ? t.appliedBtn
              : applying
              ? t.applying
              : t.applyNowBtn}
          </button>
        )}

        {user && (role === "admin" || role === "recruiter") && (
          <p className="mt-6 text-sm text-slate-500">
            {role === "admin"
              ? "Admin"
              : "Recruiter"}{" "}
            accounts cannot apply to listings.
          </p>
        )}
      </div>
    </div>
  );
}