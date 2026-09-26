"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../../lib/LanguageContext";
import { translations } from "../../lib/translations";
import { API_URL } from "../../lib/apiConfig";

type ApplicantItem = {
  _id: string;
  listingType: "Internship" | "Job";
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  listing: { title: string; company: string };
};

const statusOptions = ["Under Review", "Shortlisted", "Rejected"];

const statusStyles: Record<string, string> = {
  "Under Review": "bg-[#F5A623]/15 text-[#B7791F]",
  Shortlisted: "bg-[#0D9488]/15 text-[#0D9488]",
  Rejected: "bg-red-100 text-red-700",
};

export default function AdminApplicantsPage() {
  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    fetch(`${API_URL}/api/applications/admin/all`)
      .then((res) => res.json())
      .then((data) => {
        setApplicants(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching applicants:", err);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setApplicants((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
    );

    try {
      await fetch(`${API_URL}/api/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-8 py-10 max-w-6xl mx-auto text-center">
        <p className="text-zinc-600 dark:text-zinc-400">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        {t.applicantsTitle}
      </h1>

      {applicants.length === 0 && (
        <p className="text-zinc-600 dark:text-zinc-400">
          {t.noApplicationsYet}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {applicants.map((app) => (
          <div
            key={app._id}
            className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          >
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                {app.user?.name}
              </p>

              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {app.user?.email}
              </p>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {t.appliedTo}:{" "}
                <span className="font-medium">{app.listing?.title}</span>{" "}
                (
                {app.listingType === "Internship"
                  ? t.internship
                  : t.job}
                )
              </p>

              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2">
              <span
                className={`text-xs sm:text-sm font-medium px-3 py-1 rounded-full ${
                  statusStyles[app.status]
                }`}
              >
                {app.status === "Under Review"
                  ? t.underReview
                  : app.status === "Shortlisted"
                  ? t.shortlisted
                  : t.rejected}
              </span>

              <select
                value={app.status}
                onChange={(e) =>
                  handleStatusChange(app._id, e.target.value)
                }
                className="text-sm border border-zinc-300 dark:border-zinc-700 rounded-md px-2 py-1 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "Under Review"
                      ? t.underReview
                      : opt === "Shortlisted"
                      ? t.shortlisted
                      : t.rejected}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}