"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SkillsInput from "../../components/SkillsInput";
import { useLanguage } from "../../lib/LanguageContext";
import { translations } from "../../lib/translations";
import { API_URL } from "../../lib/apiConfig";

export default function PostListingPage() {
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
  const { language } = useLanguage();
  const t = translations[language];

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
    setSubmitting(true);
    setError("");

    const endpoint =
      listingType === "internship"
        ? `${API_URL}/api/internships`
        : `${API_URL}/api/jobs`;

    const skillsArray = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload =
      listingType === "internship"
        ? { ...formData, skills: skillsArray }
        : {
            title: formData.title,
            company: formData.company,
            location: formData.location,
            type: formData.duration,
            description: formData.description,
            skills: skillsArray,
          };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to post listing");

      router.push(listingType === "internship" ? "/internships" : "/jobs");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 sm:px-8 py-10 max-w-3xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        {t.postListingTitle}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <input
              type="radio"
              name="listingType"
              value="internship"
              checked={listingType === "internship"}
              onChange={() => setListingType("internship")}
            />
            {t.internship}
          </label>

          <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
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
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            {t.titleLabel}
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            {t.companyLabel}
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {t.locationLabel}
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {t.durationLabel}
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder={t.durationPlaceholder}
              required
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            {t.descriptionLabel}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

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

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-md px-6 py-2 font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {submitting ? t.posting : t.postListingBtn}
        </button>
      </form>
    </div>
  );
}