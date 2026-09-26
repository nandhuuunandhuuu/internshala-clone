"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import { useOtpGuard } from "../lib/useOtpGuard";
import { API_URL } from "../lib/apiConfig";

type Internship = {
  _id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  applicantCount: number;
};

export default function InternshipsPage() {
  const { checked, blocked } = useOtpGuard("/login");

  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    fetch(`${API_URL}/api/internships`)
      .then((res) => res.json())
      .then((data) => {
        setInternships(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching internships:", err);
        setLoading(false);
      });
  }, []);

  const locations = Array.from(
    new Set(internships.map((i) => i.location))
  );

  const filtered = internships.filter((i) => {
    const matchesSearch =
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.company.toLowerCase().includes(search.toLowerCase());

    const matchesLocation = locationFilter
      ? i.location === locationFilter
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
        {t.internships}
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
          {t.noInternshipsMatch}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((internship) => (
          <Link
            key={internship._id}
            href={`/internships/${internship._id}`}
            className="block bg-white border border-[#0F172A]/10 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#F5A623]/50 transition"
          >
            <h2 className="text-lg font-semibold text-[#0F172A]">
              {internship.title}
            </h2>

            <p className="text-slate-600">
              {internship.company}
            </p>

            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-slate-500">
                {internship.location} • {internship.duration}
              </p>

              <span className="text-xs font-medium text-[#0D9488] bg-[#0D9488]/10 px-2 py-0.5 rounded-full">
                {internship.applicantCount}{" "}
                {internship.applicantCount !== 1
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