"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "./lib/AuthContext";
import { useLanguage } from "./lib/LanguageContext";
import { translations } from "./lib/translations";
import { API_URL } from "./lib/apiConfig";
import { useSearchParams } from "next/navigation";

type Recommendation = {
  _id: string;
  title: string;
  company: string;
  listingType: "Internship" | "Job";
  matchScore: number;
};

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];

  const [userData, setUserData] = useState<{
    name: string;
    skills?: string[];
    resumeUrl?: string;
  } | null>(null);

  const [readiness, setReadiness] = useState<{
    totalScore: number;
    tips: string[];
  } | null>(null);

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const searchParams = useSearchParams();
  const [role, setRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    setUserData(null);
    setReadiness(null);
    setRecommendations([]);

    if (user) {
      fetch(`${API_URL}/api/users/${user.uid}`)
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch((err) => console.error(err));

      fetch(`${API_URL}/api/users/${user.uid}/readiness`)
        .then((res) => res.json())
        .then((data) => setReadiness(data))
        .catch((err) => console.error(err));

      fetch(`${API_URL}/api/users/${user.uid}/recommendations`)
        .then((res) => res.json())
        .then((data) =>
          setRecommendations(
            Array.isArray(data) ? data.slice(0, 6) : []
          )
        )
        .catch((err) => console.error(err));
    }
  }, [user?.uid]);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    setRoleLoading(true);

    fetch(`${API_URL}/api/users/role/${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        setRole(data.role);
        setRoleLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setRoleLoading(false);
      });
  }, [user?.uid]);

  const trending = [
    {
      icon: "🚀",
      title: t.masterInDemandSkills,
      subtitle: t.boostResumeProjects,
      bg: "#0F172A",
    },
    {
      icon: "📄",
      title: t.completeYourResume,
      subtitle: t.generateProfessionalResume,
      bg: "#F5A623",
      dark: true,
      link: "/resume-builder",
    },
    {
      icon: "👥",
      title: t.growYourNetwork,
      subtitle: t.addFriendsPublicSpace,
      bg: "#0F172A",
      link: "/friends",
    },
  ];

  if (authLoading || roleLoading) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-slate-600">{t.loading}</p>
      </div>
    );
  }

  if (!user || role === "admin" || role === "recruiter") {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#F5A623]/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative px-6 py-24 sm:py-32 max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold tracking-wide uppercase text-[#F5A623] bg-[#F5A623]/10 px-3 py-1 rounded-full mb-6">
            {t.heroTag}
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold text-[#0F172A] leading-tight">
            {t.heroTitle}
          </h1>

          <p className="mt-5 text-lg text-slate-600 max-w-xl mx-auto">
            {t.heroSubtitle}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/internships"
              className="bg-[#F5A623] text-[#0F172A] font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              {t.browseInternships}
            </Link>

            <Link
              href="/jobs"
              className="border border-[#0F172A]/15 text-[#0F172A] font-semibold px-6 py-3 rounded-lg hover:bg-[#0F172A]/5 transition"
            >
              {t.browseJobs}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const score = readiness?.totalScore ?? 0;
  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (score / 100) * circumference;

  const topTip =
    readiness?.tips?.[0] === "ADD_SKILLS_PROMPT"
      ? t.addSkillsPrompt
      : readiness?.tips?.[0] || t.keepBuildingProfile;

  return (
    <div>
      <div className="px-4 sm:px-8 pt-12 pb-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#0F172A0D"
                strokeWidth="8"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#F5A623"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>

            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#0F172A]">
              {score}%
            </span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A]">
              {t.greeting}, {userData?.name || ""} 👋
            </h1>
            <p className="text-slate-500 mt-1">{t.helpLandCareer}</p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 max-w-6xl mx-auto mb-12">
        <div className="bg-[#0F172A] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#F5A623] uppercase tracking-wide mb-2">
              {t.yourNextStep}
            </p>

            <p className="text-white text-lg font-semibold max-w-md">
              {topTip}
            </p>
          </div>

          <Link
            href="/profile"
            className="bg-[#F5A623] text-[#0F172A] font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition shrink-0"
          >
            {t.goToProfile}
          </Link>
        </div>
      </div>

      <div className="px-4 sm:px-8 max-w-6xl mx-auto mb-16">
        <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
          {t.trendingTitle} 🔥
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trending.map((card) => {
            const content = (
              <div
                className="w-full h-36 rounded-2xl p-5 flex flex-col justify-between"
                style={{ backgroundColor: card.bg }}
              >
                <span className="text-2xl">{card.icon}</span>

                <div>
                  <p
                    className={`font-semibold text-sm ${
                      card.dark ? "text-[#0F172A]" : "text-white"
                    }`}
                  >
                    {card.title}
                  </p>

                  <p
                    className={`text-xs mt-0.5 ${
                      card.dark ? "text-[#0F172A]/70" : "text-white/70"
                    }`}
                  >
                    {card.subtitle}
                  </p>
                </div>
              </div>
            );

            return card.link ? (
              <Link href={card.link} key={card.title}>
                {content}
              </Link>
            ) : (
              <div key={card.title}>{content}</div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#0D9488]/[0.04] border-t border-[#0F172A]/5 py-16">
        <div className="px-4 sm:px-8 max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-[#0F172A] mb-1">
            {t.recommendedForYou}
          </h2>

          <p className="text-sm text-slate-500 mb-6">
            {t.asPerPreferences}
          </p>

          {recommendations.length === 0 ? (
            <p className="text-sm text-slate-500">
              {t.addSkillsPrompt}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec) => (
                <Link
                  key={rec._id}
                  href={`/${rec.listingType.toLowerCase()}s/${rec._id}`}
                  className="bg-white border border-[#0F172A]/10 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#F5A623]/50 transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-[#0F172A] text-sm">
                      {rec.title}
                    </h3>

                    {rec.matchScore > 0 && (
                      <span className="text-xs font-bold text-white bg-[#0F172A] px-2 py-0.5 rounded-full shrink-0 ml-2">
                        {rec.matchScore}%
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500">
                    {rec.company} • {rec.listingType}
                  </p>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/for-you"
              className="text-sm font-medium text-[#0D9488] hover:underline"
            >
              {t.viewAll} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}