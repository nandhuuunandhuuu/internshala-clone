"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";
import SkillsInput from "../components/SkillsInput";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import { useOtpGuard } from "../lib/useOtpGuard";
import { API_URL } from "../lib/apiConfig";

const CLOUDINARY_CLOUD_NAME = "tz6kh7li";
const CLOUDINARY_UPLOAD_PRESET = "resume_uploads";

type UserData = {
  name: string;
  email: string;
  phone?: string;
  education?: string;
  skills?: string[];
  resumeUrl?: string;
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const { checked, blocked } = useOtpGuard("/login");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [readiness, setReadiness] = useState<{
    totalScore: number;
    breakdown: {
      profileScore: number;
      skillsScore: number;
      activityScore: number;
    };
    tips: string[];
  } | null>(null);
  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    education: "",
    skills: "",
  });

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      await fetch(`${API_URL}/api/users/${user.uid}`, {
        method: "DELETE",
      });
      router.push("/login");
    } catch (err) {
      console.error("Error deleting account:", err);
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetch(`${API_URL}/api/users/${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
          setForm({
            name: data.name || "",
            phone: data.phone || "",
            email: data.email || "",
            education: data.education || "",
            skills: (data.skills || []).join(", "),
          });
        })
        .catch((err) => console.error("Error fetching profile:", err));

      fetch(`${API_URL}/api/login-tracking/history/${user.uid}`)
        .then((res) => res.json())
        .then((data) => setLoginHistory(Array.isArray(data) ? data : []))
        .catch((err) => console.error(err));

      fetch(`${API_URL}/api/users/${user.uid}/readiness`)
        .then((res) => res.json())
        .then((data) => setReadiness(data))
        .catch((err) => console.error("Error fetching readiness:", err));

      fetch(`${API_URL}/api/skills`)
        .then((res) => res.json())
        .then((data) => setSkillOptions(data))
        .catch((err) => console.error("Error fetching skills list:", err));
    }
  }, [user, loading, router]);

  const handleSave = async () => {
    if (!user || !userData) return;
    setSaving(true);
    setSaveError("");

    const skillsArray = form.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`${API_URL}/api/users/${user.uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          education: form.education,
          skills: skillsArray,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save profile.");
      }

      const updated = await res.json();

      if (form.email !== userData.email) {
        const emailRes = await fetch(`${API_URL}/api/users/${user.uid}/email`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newEmail: form.email }),
        });
        if (!emailRes.ok) {
          const data = await emailRes.json().catch(() => ({}));
          throw new Error(data.error || "Failed to update email.");
        }
      }

      setUserData({
        ...updated,
        email: form.email,
      });
      setEditing(false);
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setSaveError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!user) return;
    if (!confirm("Remove your uploaded resume?")) return;

    try {
      const res = await fetch(`${API_URL}/api/users/${user.uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeUrl: "" }),
      });

      const updated = await res.json();
      setUserData(updated);
    } catch (err) {
      console.error("Error deleting resume:", err);
    }
  };

  const handleResumeUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
        { method: "POST", body: uploadData }
      );

      const cloudData = await cloudRes.json();

      if (!cloudData.secure_url) throw new Error("Upload failed");

      const res = await fetch(`${API_URL}/api/users/${user.uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeUrl: cloudData.secure_url }),
      });

      const updated = await res.json();
      setUserData(updated);
    } catch (err) {
      console.error("Error uploading resume:", err);
    } finally {
      setUploading(false);
    }
  };

  if (!checked || blocked) {
    return (
      <div className="px-4 sm:px-8 py-10 max-w-5xl mx-auto text-center">
        <p className="text-slate-600">{t.loading}</p>
      </div>
    );
  }

  if (loading || !userData) {
    return (
      <div className="px-4 sm:px-8 py-10 max-w-5xl mx-auto text-center">
        <p className="text-slate-600">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-10 max-w-5xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-6">
        {t.myProfile}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-[#0F172A]/10 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
            {editing ? (
              <>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    {t.nameLabel}
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    {t.phoneLabel}
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    {t.educationLabel}
                  </label>
                  <input
                    value={form.education}
                    onChange={(e) =>
                      setForm({ ...form, education: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    {t.skillsLabel}
                  </label>
                  <SkillsInput
                    value={form.skills}
                    onChange={(val) =>
                      setForm({ ...form, skills: val })
                    }
                    suggestions={skillOptions}
                  />
                </div>

                {saveError && <p className="text-sm text-red-600">{saveError}</p>}

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#F5A623] text-[#0F172A] rounded-lg px-5 py-2 font-semibold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={() => setEditing(false)}
                    className="border border-[#0F172A]/15 rounded-lg px-5 py-2 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-slate-500">{t.nameLabel}</p>
                  <p className="text-base font-medium text-[#0F172A]">
                    {userData.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="text-base font-medium text-[#0F172A]">
                    {userData.email}
                  </p>
                </div>

                {userData.phone && (
                  <div>
                    <p className="text-sm text-slate-500">{t.phoneLabel}</p>
                    <p className="text-base font-medium text-[#0F172A]">
                      {userData.phone}
                    </p>
                  </div>
                )}

                {userData.education && (
                  <div>
                    <p className="text-sm text-slate-500">
                      {t.educationLabel}
                    </p>
                    <p className="text-base font-medium text-[#0F172A]">
                      {userData.education}
                    </p>
                  </div>
                )}

                {userData.skills && userData.skills.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-500 mb-2">
                      {t.skillsLabel}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {userData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs sm:text-sm bg-[#F5A623]/10 text-[#B7791F] px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-slate-500 mb-2">
                    {t.resumeLabel}
                  </p>

                  {userData.resumeUrl ? (
                    <div className="flex items-center gap-3">
                      <a
                        href={userData.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0D9488] font-medium hover:underline"
                      >
                        {t.viewResume}
                      </a>

                      <button
                        onClick={handleDeleteResume}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">{t.noResume}</p>
                  )}

                  <div className="mt-2">
                    <label className="inline-block cursor-pointer text-sm font-medium text-[#0F172A] border border-[#0F172A]/15 rounded-lg px-4 py-2 hover:bg-[#0F172A]/5 transition">
                      {uploading
                        ? "Uploading..."
                        : userData.resumeUrl
                        ? "Replace Resume (PDF)"
                        : "Upload Resume (PDF)"}
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleResumeUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="mt-2 w-full sm:w-auto bg-[#F5A623] text-[#0F172A] rounded-lg px-6 py-2.5 font-semibold hover:opacity-90 transition"
                >
                  {t.editProfile}
                </button>
              </>
            )}
          </div>

          <div className="mt-6 text-center lg:text-left">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete Account
              </button>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-sm mx-auto lg:mx-0">
                <p className="text-sm text-red-700 mb-3">
                  This will permanently delete your account and cannot be
                  undone. Are you sure?
                </p>

                <div className="flex gap-2 justify-center lg:justify-start">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="text-sm font-medium bg-red-600 text-white px-4 py-1.5 rounded-lg disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Yes, Delete"}
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-sm font-medium border border-[#0F172A]/15 px-4 py-1.5 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {readiness && (
            <div className="bg-white border border-[#0F172A]/10 rounded-xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-slate-600">
                  {t.careerReadiness}
                </p>
                <span className="text-2xl font-bold text-[#0F172A]">
                  {readiness.totalScore}
                  <span className="text-sm text-slate-400">/100</span>
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                <div
                  className="bg-[#F5A623] h-2 rounded-full transition-all"
                  style={{ width: `${readiness.totalScore}%` }}
                />
              </div>

              <p className="text-sm font-medium text-slate-600 mb-2">
                {t.careerRoadmap}
              </p>

              {readiness?.tips && readiness.tips.length > 0 && (
                <ul className="flex flex-col gap-1.5">
                  {readiness.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="text-sm text-slate-600 flex gap-2"
                    >
                      <span className="text-[#0D9488]">→</span> {tip}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="bg-white border border-[#0F172A]/10 rounded-xl p-5 sm:p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-600 mb-3">
              {t.loginHistory}
            </p>

            {loginHistory.length === 0 && (
              <p className="text-sm text-slate-500">
                {t.noLoginHistory}
              </p>
            )}

            <div className="flex flex-col gap-2">
              {loginHistory.map((entry) => (
                <div
                  key={entry._id}
                  className="text-sm text-slate-600 border-b border-[#0F172A]/5 pb-2 last:border-0"
                >
                  <span className="font-medium text-[#0F172A]">
                    {entry.browser}
                  </span>{" "}
                  on {entry.os} ({entry.deviceType}) — {entry.ipAddress}
                  <br />
                  <span className="text-xs text-slate-400">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
