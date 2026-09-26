"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/LanguageContext";
import { translations } from "../../lib/translations";
import { API_URL } from "../../lib/apiConfig";
import { useRouter } from "next/navigation";

type Stats = {
  totalInternships: number;
  totalJobs: number;
  totalApplications: number;
  totalStudents: number;
  totalRecruiters: number;
  totalCompanies: number;
};

type Post = {
  _id: string;
  title: string;
  listingType: "Internship" | "Job";
  applicantCount: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/admin/stats`).then((r) => r.json()),
      fetch(`${API_URL}/api/admin/recent-posts`).then((r) => r.json()),
    ])
      .then(([statsData, postsData]) => {
        setStats(statsData);
        setPosts(postsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading dashboard:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string, listingType: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

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
        <p className="text-zinc-600 dark:text-zinc-400">{t.loading}</p>
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

      <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        {t.adminDashboard}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Link
          href="/admin/manage?view=students"
          className="bg-white border border-[#0F172A]/10 rounded-lg p-5 text-center shadow-sm hover:shadow-md hover:border-[#F5A623]/50 transition"
        >
          <p className="text-2xl font-bold text-[#0F172A]">
            {stats?.totalStudents ?? 0}
          </p>
          <p className="text-sm text-slate-500 mt-1">{t.totalStudents}</p>
        </Link>

        <Link
          href="/admin/manage?view=recruiters"
          className="bg-white border border-[#0F172A]/10 rounded-lg p-5 text-center shadow-sm hover:shadow-md hover:border-[#F5A623]/50 transition"
        >
          <p className="text-2xl font-bold text-[#0F172A]">
            {stats?.totalRecruiters ?? 0}
          </p>
          <p className="text-sm text-slate-500 mt-1">{t.totalRecruiters}</p>
        </Link>

        <Link
          href="/admin/manage?view=companies"
          className="bg-white border border-[#0F172A]/10 rounded-lg p-5 text-center shadow-sm hover:shadow-md hover:border-[#F5A623]/50 transition"
        >
          <p className="text-2xl font-bold text-[#0F172A]">
            {stats?.totalCompanies ?? 0}
          </p>
          <p className="text-sm text-slate-500 mt-1">{t.companies}</p>
        </Link>

        <Link
          href="/internships"
          className="bg-white border border-[#0F172A]/10 rounded-lg p-5 text-center shadow-sm hover:shadow-md hover:border-[#F5A623]/50 transition"
        >
          <p className="text-2xl font-bold text-[#0F172A]">
            {stats?.totalInternships ?? 0}
          </p>
          <p className="text-sm text-slate-500 mt-1">{t.internshipsPosted}</p>
        </Link>

        <Link
          href="/jobs"
          className="bg-white border border-[#0F172A]/10 rounded-lg p-5 text-center shadow-sm hover:shadow-md hover:border-[#F5A623]/50 transition"
        >
          <p className="text-2xl font-bold text-[#0F172A]">
            {stats?.totalJobs ?? 0}
          </p>
          <p className="text-sm text-slate-500 mt-1">{t.jobsPosted}</p>
        </Link>

        <Link
          href="/admin/applicants"
          className="bg-white border border-[#0F172A]/10 rounded-lg p-5 text-center shadow-sm hover:shadow-md hover:border-[#F5A623]/50 transition"
        >
          <p className="text-2xl font-bold text-[#0F172A]">
            {stats?.totalApplications ?? 0}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {t.totalApplicationsLabel}
          </p>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Link
          href="/admin/post"
          className="inline-block text-center bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-md px-5 py-2 font-medium hover:opacity-90 transition"
        >
          {t.postNewListing}
        </Link>

        <Link
          href="/admin/applicants"
          className="inline-block text-center border border-zinc-300 dark:border-zinc-700 rounded-md px-5 py-2 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
        >
          {t.viewApplicants}
        </Link>

        <Link
          href="/admin/manage"
          className="inline-block text-center border border-[#0F172A]/15 rounded-md px-5 py-2 font-medium hover:bg-[#0F172A]/5 transition"
        >
          {t.managePlatform}
        </Link>
      </div>

      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
        {t.recentPosts}
      </h2>

      {posts.length === 0 && (
        <p className="text-zinc-600 dark:text-zinc-400">
          {t.noPostsYetAdmin}
        </p>
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
                {post.listingType === "Internship" ? t.internship : t.job}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-600">
                {post.applicantCount}{" "}
                {post.applicantCount === 1 ? t.applicant : t.applicants}
              </p>

              <Link
                href={`/admin/edit/${post.listingType.toLowerCase()}/${post._id}`}
                className="text-sm font-medium text-[#0D9488] hover:underline"
              >
                {t.edit}
              </Link>

              <button
                onClick={() => handleDelete(post._id, post.listingType)}
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