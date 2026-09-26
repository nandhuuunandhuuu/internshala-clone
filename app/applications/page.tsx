"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import { useOtpGuard } from "../lib/useOtpGuard";
import { API_URL } from "../lib/apiConfig";

type ApplicationItem = {
  _id: string;
  listingType: "Internship" | "Job";
  status: string;
  createdAt: string;
  listing: {
    title: string;
    company: string;
  };
};

const statusStyles: Record<string, string> = {
  "Under Review": "bg-[#F5A623]/15 text-[#B7791F]",
  "Shortlisted": "bg-[#0D9488]/15 text-[#0D9488]",
  "Rejected": "bg-red-100 text-red-700",
};

export default function ApplicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter();

  useOtpGuard("/login");

  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetch(`${API_URL}/api/applications/user/${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          setApplications(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching applications:", err);
          setLoading(false);
        });
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="px-4 sm:px-8 py-10 max-w-3xl mx-auto text-center">
        <p className="text-zinc-600 dark:text-zinc-400">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-10 max-w-3xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        {t.myApplications}
      </h1>

      {applications.length === 0 && (
        <p className="text-zinc-600 dark:text-zinc-400">
          {t.notApplied}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {applications.map((app) => (
          <div
            key={app._id}
            className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                {app.listing?.title}
              </p>

              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {app.listing?.company} • {app.listingType}
              </p>

              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                {t.appliedOn} {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`text-xs sm:text-sm font-medium px-3 py-1 rounded-full self-start sm:self-center ${statusStyles[app.status]}`}
            >
              {app.status === "Under Review"
                ? t.underReview
                : app.status === "Shortlisted"
                ? t.shortlisted
                : t.rejected}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}