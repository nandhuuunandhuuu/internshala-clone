"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/AuthContext";
import { useLanguage } from "../../lib/LanguageContext";
import { translations } from "../../lib/translations";
import SkillsInput from "../../components/SkillsInput";
import { API_URL } from "../../lib/apiConfig";

export default function RecruiterPostPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];

  const [listingType, setListingType] = useState("internship");
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    duration: "",
    description: "",
    skills: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch(`${API_URL}/api/skills`)
      .then((res) => res.json())
      .then((data) => setSkillOptions(data))
      .catch((err) => console.error("Error fetching skills list:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError("");

    try {
      const userRes = await fetch(`${API_URL}/api/users/${user.uid}`);
      const userData = await userRes.json();

      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const endpoint =
        listingType === "internship"
          ? `${API_URL}/api/internships`
          : `${API_URL}/api/jobs`;

      const basePayload = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        description: formData.description,
        skills: skillsArray,
        postedBy: userData._id,
        companyId: userData.companyId,
      };

      const payload =
        listingType === "internship"
          ? { ...basePayload, duration: formData.duration }
          : { ...basePayload, type: formData.duration };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to post listing");

      router.push("/recruiter/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 sm:px-8 py-10 max-w-3xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-6">
        {t.postListingTitle}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white border border-[#0F172A]/10 rounded-xl p-5 sm:p-6 shadow-sm"
      >
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="listingType"
              value="internship"
              checked={listingType === "internship"}
              onChange={() => setListingType("internship")}
            />
            {t.internship}
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="listingType"
              value="job"
              checked={listingType === "job"}
              onChange={() => setListingType("job")}
            />
            {t.job}
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t.titleLabel}
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t.companyLabel}
          </label>
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.locationLabel}
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.durationLabel}
            </label>
            <input
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder={t.durationPlaceholder}
              required
              className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t.descriptionLabel}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t.requiredSkills}
          </label>
          <SkillsInput
            value={formData.skills}
            onChange={(val) => setFormData({ ...formData, skills: val })}
            suggestions={skillOptions}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#F5A623] text-[#0F172A] rounded-lg px-6 py-2.5 font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {submitting ? t.posting : t.postListingBtn}
        </button>
      </form>
    </div>
  );
}