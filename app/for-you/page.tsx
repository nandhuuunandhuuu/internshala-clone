"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import { useOtpGuard } from "../lib/useOtpGuard";
import { API_URL } from "../lib/apiConfig";

type Recommendation = {
  _id: string;
  title: string;
  company: string;
  location: string;
  listingType: "Internship" | "Job";
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
};

export default function ForYouPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const { checked, blocked } = useOtpGuard("/login");

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetch(`${API_URL}/api/users/${user.uid}/recommendations`)
        .then((res) => res.json())
        .then((data) => {
          setRecommendations(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching recommendations:", err);
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

  const topMatches = recommendations.filter((r) => r.matchScore > 0);
  const otherListings = recommendations.filter((r) => r.matchScore === 0);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-1">
        {t.forYouTitle}
      </h1>

      <p className="text-sm text-slate-500 mb-6">
        {t.forYouSubtitle}
      </p>

      {topMatches.length === 0 && (
        <div className="bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-lg p-4 mb-6 text-sm text-[#B7791F]">
          {t.addSkillsPrompt}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {topMatches.map((rec) => (
          <Link
            key={rec._id}
            href={`/${rec.listingType.toLowerCase()}s/${rec._id}`}
            className="block bg-white border border-[#0F172A]/10 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#F5A623]/50 transition"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-[#0F172A]">
                {rec.title}
              </h2>

              <span className="text-xs font-bold text-white bg-[#0F172A] px-2 py-0.5 rounded-full">
                {rec.matchScore}% {t.matchLabel}
              </span>
            </div>

            <p className="text-slate-600">
              {rec.company} • {rec.location}
            </p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {rec.matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-[#0D9488]/10 text-[#0D9488] px-2 py-0.5 rounded-full"
                >
                  ✓ {skill}
                </span>
              ))}

              {rec.missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full"
                >
                  Learn: {skill}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {otherListings.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-[#0F172A] mt-8 mb-3">
            {t.otherOpportunities}
          </h2>

          <div className="flex flex-col gap-3">
            {otherListings.map((rec) => (
              <Link
                key={rec._id}
                href={`/${rec.listingType.toLowerCase()}s/${rec._id}`}
                className="block bg-white border border-[#0F172A]/10 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <p className="font-medium text-[#0F172A]">
                  {rec.title}
                </p>

                <p className="text-sm text-slate-500">
                  {rec.company} • {rec.location}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}