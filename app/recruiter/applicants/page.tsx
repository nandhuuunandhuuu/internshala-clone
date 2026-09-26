"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useLanguage } from "../../lib/LanguageContext";
import { translations } from "../../lib/translations";
import { API_URL } from "../../lib/apiConfig";

type ApplicantItem = {
  _id: string;
  listingType: "Internship" | "Job";
  status: string;
  createdAt: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  user: { name: string; email: string };
  listing: { title: string; company: string };
};

const statusOptions = ["Under Review", "Shortlisted", "Rejected"];

const statusStyles: Record<string, string> = {
  "Under Review": "bg-[#F5A623]/15 text-[#B7791F]",
  "Shortlisted": "bg-[#0D9488]/15 text-[#0D9488]",
  "Rejected": "bg-red-100 text-red-700",
};

export default function RecruiterApplicantsPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];

  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/api/applications/recruiter/${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        setApplicants(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching applicants:", err);
        setLoading(false);
      });
  }, [user]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setApplicants((prev) =>
      prev.map((a) =>
        a._id === id ? { ...a, status: newStatus } : a
      )
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
        <p className="text-slate-600">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-1">
        {t.applicantsTitle}
      </h1>

      <p className="text-sm text-slate-500 mb-6">
        {t.rankedByMatch}
      </p>

      {applicants.length === 0 && (
        <p className="text-slate-600">{t.noApplicationsYet}</p>
      )}

      <div className="flex flex-col gap-4">
        {applicants.map((app) => (
          <div
            key={app._id}
            className="bg-white border border-[#0F172A]/10 rounded-xl p-4 sm:p-5 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-[#0F172A]">
                    {app.user?.name}
                  </p>

                  <span className="text-xs font-bold text-white bg-[#0F172A] px-2 py-0.5 rounded-full">
                    {app.matchScore}% {t.match}
                  </span>
                </div>

                <p className="text-sm text-slate-600">
                  {app.user?.email}
                </p>

                <p className="text-sm text-slate-600 mt-1">
                  {t.appliedTo}:{" "}
                  <span className="font-medium">
                    {app.listing?.title}
                  </span>{" "}
                  (
                  {app.listingType === "Internship"
                    ? t.internship
                    : t.job}
                  )
                </p>

                {app.matchedSkills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {app.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs bg-[#0D9488]/10 text-[#0D9488] px-2 py-0.5 rounded-full"
                      >
                        ✓ {skill}
                      </span>
                    ))}

                    {app.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-slate-500 mt-2">
                  {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-2">
                <span
                  className={`text-xs sm:text-sm font-medium px-3 py-1 rounded-full ${statusStyles[app.status]}`}
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
                  className="text-sm border border-[#0F172A]/15 rounded-md px-2 py-1"
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
          </div>
        ))}
      </div>
    </div>
  );
}