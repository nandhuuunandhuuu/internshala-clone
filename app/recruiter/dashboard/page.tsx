"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/AuthContext";
import { useLanguage } from "../../lib/LanguageContext";
import { translations } from "../../lib/translations";
import { API_URL } from "../../lib/apiConfig";

type Company = {
  _id: string;
  name: string;
  industry: string;
  verified: boolean;
};

type Post = {
  _id: string;
  title: string;
  listingType: "Internship" | "Job";
  applicantCount: number;
};

export default function RecruiterDashboardPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter();

  const [company, setCompany] = useState<Company | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/api/companies/by-user/${user.uid}`)
      .then((res) => res.json())
      .then((companyData) => {
        setCompany(companyData);
        return fetch(
          `${API_URL}/api/recruiter/${user.uid}/listings`
        );
      })
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading recruiter dashboard:", err);
        setLoading(false);
      });
  }, [user]);

  const handleDelete = async (id: string, listingType: string) => {
    if (!confirm(t.deleteListingConfirm)) return;

    const endpoint =
      listingType === "Internship"
        ? `${API_URL}/api/internships/${id}`
        : `${API_URL}/api/jobs/${id}`;

    try {
      await fetch(endpoint, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
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
      <button
        onClick={() => router.replace("/?from=dashboard")}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-[#0F172A] mb-4"
      >
        ← {t.backToHome}
      </button>

      <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-1">
        {company?.name || t.recruiterDashboard}
      </h1>

      <p className="text-sm text-slate-500 mb-6">
        {company?.verified ? (
          <span className="text-[#0D9488] font-medium">
            ✓ {t.verifiedCompany}
          </span>
        ) : (
          <span>{t.verificationPending}</span>
        )}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Link
          href="/recruiter/post"
          className="inline-block text-center bg-[#F5A623] text-[#0F172A] rounded-lg px-5 py-2.5 font-semibold hover:opacity-90 transition"
        >
          {t.postNewListing}
        </Link>

        <Link
          href="/recruiter/applicants"
          className="inline-block text-center border border-[#0F172A]/15 rounded-lg px-5 py-2.5 font-medium hover:bg-[#0F172A]/5 transition"
        >
          {t.viewApplicants}
        </Link>
      </div>

      <h2 className="text-lg font-semibold text-[#0F172A] mb-3">
        {t.recentPosts}
      </h2>

      {posts.length === 0 && (
        <p className="text-slate-600">{t.noPostsYetAdmin}</p>
      )}

      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <div
            key={post._id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border border-[#0F172A]/10 rounded-lg p-4 gap-2"
          >
            <div>
              <p className="font-medium text-[#0F172A]">{post.title}</p>

              <p className="text-sm text-slate-500">
                {post.listingType === "Internship"
                  ? t.internship
                  : t.job}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-600">
                {post.applicantCount}{" "}
                {post.applicantCount === 1
                  ? t.applicant
                  : t.applicants}
              </p>

              <Link
                href={`/recruiter/edit/${post.listingType.toLowerCase()}/${post._id}`}
                className="text-sm font-medium text-[#0D9488] hover:underline"
              >
                {t.edit}
              </Link>

              <button
                onClick={() =>
                  handleDelete(post._id, post.listingType)
                }
                className="text-sm font-medium text-red-600 hover:underline"
              >
                {t.delete}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}