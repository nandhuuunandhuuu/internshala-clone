"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import { useOtpGuard } from "../lib/useOtpGuard";
import { API_URL } from "../lib/apiConfig";

type Application = {
  status: string;
  createdAt: string;
};

export default function CareerProgressPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const { checked, blocked } = useOtpGuard("/login");

  const [applications, setApplications] = useState<Application[]>([]);
  const [skillCount, setSkillCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      Promise.all([
        fetch(`${API_URL}/api/applications/user/${user.uid}`).then((r) =>
          r.json()
        ),
        fetch(`${API_URL}/api/users/${user.uid}`).then((r) => r.json()),
      ])
        .then(([apps, userData]) => {
          setApplications(Array.isArray(apps) ? apps : []);
          setSkillCount((userData.skills || []).length);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading career progress:", err);
          setLoading(false);
        });
    }
  }, [user, authLoading, router]);

  if (!checked || blocked) {
    return (
      <div className="px-4 sm:px-8 py-10 max-w-5xl mx-auto text-center">
        <p className="text-slate-600">{t.loading}</p>
      </div>
    );
  }

  if (authLoading || loading) {
    return (
      <div className="px-4 sm:px-8 py-10 max-w-3xl mx-auto text-center">
        <p className="text-slate-600">{t.loading}</p>
      </div>
    );
  }

  const total = applications.length;
  const shortlisted = applications.filter(
    (a) => a.status === "Shortlisted"
  ).length;
  const rejected = applications.filter(
    (a) => a.status === "Rejected"
  ).length;
  const underReview = applications.filter(
    (a) => a.status === "Under Review"
  ).length;

  return (
    <div className="px-4 sm:px-8 py-10 max-w-5xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-6">
        {t.careerProgressTitle}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-[#0F172A]/10 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-[#0F172A]">{total}</p>
          <p className="text-xs text-slate-500 mt-1">
            {t.totalApplications}
          </p>
        </div>
        <div className="bg-white border border-[#0F172A]/10 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-[#0D9488]">{shortlisted}</p>
          <p className="text-xs text-slate-500 mt-1">
            {t.shortlisted}
          </p>
        </div>
        <div className="bg-white border border-[#0F1728]/10 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-[#F5A623]">{underReview}</p>
          <p className="text-xs text-slate-500 mt-1">
            {t.underReview}
          </p>
        </div>
        <div className="bg-white border border-[#0F172A]/10 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-red-500">{rejected}</p>
          <p className="text-xs text-slate-500 mt-1">
            {t.rejected}
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#0F172A]/10 rounded-xl p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-600 mb-2">
          {t.skillsOnProfile}
        </p>
        <p className="text-3xl font-bold text-[#0F172A]">{skillCount}</p>
        <p className="text-sm text-slate-500 mt-2">
          {skillCount < 3
            ? t.addMoreSkillsPrompt
            : t.skillsRangePrompt}
        </p>
      </div>
    </div>
  );
}