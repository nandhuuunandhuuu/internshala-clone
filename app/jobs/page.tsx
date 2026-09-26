"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import { useOtpGuard } from "../lib/useOtpGuard";
import { API_URL } from "../lib/apiConfig";

type Job = {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  applicantCount: number;
};

export default function JobsPage() {
  const { checked, blocked } = useOtpGuard("/login");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    fetch(`${API_URL}/api/jobs`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setLoading(false);
      });
  }, []);

  const locations = Array.from(new Set(jobs.map((j) => j.location)));

  const filtered = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase());

    const matchesLocation = locationFilter
      ? j.location === locationFilter
      : true;

    return matchesSearch && matchesLocation;
  });

  if (!checked || blocked) {
    return (
      <div className="px-4 sm:px-8 py-10 max-w-5xl mx-auto text-center">
        <p className="text-slate-600">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-6">
        {t.jobs}
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-[#0F172A]/15 rounded-lg bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40"
        />

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="px-3 py-2 border border-[#0F172A]/15 rounded-lg bg-white text-[#0F172A]"
        >
          <option value="">{t.allLocations}</option>

          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p className="text-slate-600">{t.loading}</p>
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-slate-600">
          {t.noJobsMatch}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((job) => (
          <Link
            key={job._id}
            href={`/jobs/${job._id}`}
            className="block bg-white border border-[#0F172A]/10 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#F5A623]/50 transition"
          >
            <h2 className="text-base sm:text-lg font-semibold text-[#0F172A]">
              {job.title}
            </h2>

            <p className="text-slate-600">
              {job.company}
            </p>

            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-slate-500">
                {job.location} • {job.type}
              </p>

              <span className="text-xs font-medium text-[#0D9488] bg-[#0D9488]/10 px-2 py-0.5 rounded-full">
                {job.applicantCount}{" "}
                {job.applicantCount !== 1
                  ? t.applicants
                  : t.applicant}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}