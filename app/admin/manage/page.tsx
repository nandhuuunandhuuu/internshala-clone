"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../../lib/LanguageContext";
import { translations } from "../../lib/translations";
import { API_URL } from "../../lib/apiConfig";

type UserItem = {
  _id: string;
  name: string;
  email: string;
  role: string;
  suspended: boolean;
};

type CompanyItem = {
  _id: string;
  name: string;
  industry: string;
  verified: boolean;
};

type FlaggedListing = {
  _id: string;
  title: string;
  company: string;
  listingType: string;
  flags: string[];
};

export default function AdminManagePage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [flagged, setFlagged] = useState<FlaggedListing[]>([]);
  const [loading, setLoading] = useState(true);

  const { language } = useLanguage();
  const t = translations[language];

  const flagTranslationMap: Record<string, string> = {
    "No skills listed": t.flagNoSkills,
    "Short or missing description": t.flagShortDesc,
    "Not linked to a verified company account": t.flagNoCompany,
  };

  const loadAll = () => {
    Promise.all([
      fetch(`${API_URL}/api/admin/users`).then((r) => r.json()),
      fetch(`${API_URL}/api/admin/companies`).then((r) => r.json()),
      fetch(`${API_URL}/api/admin/listing-flags`).then((r) => r.json()),
    ])
      .then(([u, c, f]) => {
        setUsers(u);
        setCompanies(c);
        setFlagged(f);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading admin management data:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAll();
  }, []);

  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  const toggleVerify = async (id: string, current: boolean) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c._id === id ? { ...c, verified: !current } : c
      )
    );

    try {
      await fetch(`${API_URL}/api/companies/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: !current }),
      });
    } catch (err) {
      console.error("Error verifying company:", err);
    }
  };

  const deleteListing = async (id: string, listingType: string) => {
    if (!confirm("Delete this listing?")) return;

    const endpoint =
      listingType === "Internship"
        ? `${API_URL}/api/internships/${id}`
        : `${API_URL}/api/jobs/${id}`;

    try {
      await fetch(endpoint, { method: "DELETE" });
      setFlagged((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Error deleting listing:", err);
    }
  };

  const toggleSuspend = async (id: string, current: boolean) => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === id ? { ...u, suspended: !current } : u
      )
    );

    try {
      await fetch(`${API_URL}/api/users/admin/${id}/suspend`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspended: !current }),
      });
    } catch (err) {
      console.error("Error updating suspension:", err);
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
      <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-6">
        {t.platformManagement}
      </h1>

      <h2 className="text-lg font-semibold text-[#0F172A] mb-3">
        {t.companiesLabel}
      </h2>

      <div className="flex flex-col gap-3 mb-8">
        {companies.map((c) => (
          <div
            key={c._id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border border-[#0F172A]/10 rounded-lg p-4 gap-2"
          >
            <div>
              <p className="font-medium text-[#0F172A]">{c.name}</p>
              <p className="text-sm text-slate-500">{c.industry || "—"}</p>
            </div>

            <button
              onClick={() => toggleVerify(c._id, c.verified)}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${
                c.verified
                  ? "bg-[#0D9488]/10 text-[#0D9488]"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {c.verified
                ? t.verifiedClickToUnverify
                : t.markVerified}
            </button>
          </div>
        ))}

        {companies.length === 0 && (
          <p className="text-slate-500 text-sm">No companies yet.</p>
        )}
      </div>

      <h2 className="text-lg font-semibold text-[#0F172A] mb-3">
        {t.flaggedListings}
      </h2>

      <p className="text-sm text-slate-500 mb-3">
        {t.flaggedDisclaimer}
      </p>

      <div className="flex flex-col gap-3 mb-8">
        {flagged.map((listing) => (
          <div
            key={listing._id}
            className="bg-white border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-[#0F172A]">
                  {listing.title}{" "}
                  <span className="text-sm text-slate-500">
                    (
                    {listing.listingType === "Internship"
                      ? t.internship
                      : t.job}
                    )
                  </span>
                </p>

                <p className="text-sm text-slate-500">
                  {listing.company}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {listing.flags.map((flag) => (
                    <span
                      key={flag}
                      className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full"
                    >
                      {flagTranslationMap[flag] || flag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 shrink-0">
                <Link
                  href={`/admin/edit/${listing.listingType.toLowerCase()}/${listing._id}`}
                  className="text-sm font-medium text-[#0D9488] hover:underline"
                >
                  {t.edit}
                </Link>

                <button
                  onClick={() =>
                    deleteListing(listing._id, listing.listingType)
                  }
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        ))}

        {flagged.length === 0 && (
          <p className="text-slate-500 text-sm">
            No flagged listings right now.
          </p>
        )}
      </div>

      <h2 className="text-lg font-semibold text-[#0F172A] mb-3">
        {view === "students"
          ? "Students"
          : view === "recruiters"
          ? "Recruiters"
          : t.usersLabel}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {users
          .filter((u) => {
            if (view === "students") return u.role === "user";
            if (view === "recruiters") return u.role === "recruiter";
            return true;
          })
          .map((u) => (
            <div
              key={u._id}
              className="flex items-center justify-between bg-white border border-[#0F172A]/10 rounded-lg p-3"
            >
              <div>
                <p className="text-sm font-medium text-[#0F172A]">
                  {u.name}
                </p>

                <p className="text-xs text-slate-500">
                  {u.email}
                </p>

                <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full capitalize mt-1 inline-block">
                  {u.role === "user"
                    ? t.userRole
                    : u.role === "recruiter"
                    ? t.recruiterRole
                    : u.role === "admin"
                    ? t.adminRole
                    : u.role}
                </span>
              </div>

              <button
                onClick={() =>
                  toggleSuspend(u._id, u.suspended)
                }
                className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
                  u.suspended
                    ? "bg-red-50 text-red-600"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {u.suspended
                  ? t.suspendedReinstate
                  : t.suspend}
              </button>
            </div>
          ))}

        {users.length === 0 && (
          <p className="text-slate-500 text-sm">
            No users yet.
          </p>
        )}
      </div>
    </div>
  );
}