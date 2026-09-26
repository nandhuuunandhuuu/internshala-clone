"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL } from "../../../../lib/apiConfig";
import { useLanguage } from "../../../../lib/LanguageContext";
import { translations } from "../../../../lib/translations";
export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string; // "internship" or "job"
  const { language } = useLanguage();
  const t = translations[language];
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    duration: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const endpoint =
    type === "internship"
      ? `${API_URL}/api/internships/${params.id}`
      : `${API_URL}/api/jobs/${params.id}`;

  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          title: data.title || "",
          company: data.company || "",
          location: data.location || "",
          duration: data.duration || data.type || "",
          description: data.description || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading listing:", err);
        setLoading(false);
      });
  }, [endpoint]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload =
      type === "internship"
        ? formData
        : {
            title: formData.title,
            company: formData.company,
            location: formData.location,
            type: formData.duration,
            description: formData.description,
          };

    try {
      await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Error updating listing:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-8 py-10 max-w-2xl mx-auto text-center">
        <p className="text-slate-600">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-10 max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-6">
        Edit {type === "internship" ? "Internship" : "Job"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg bg-white text-[#0F172A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Company
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg bg-white text-[#0F172A]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg bg-white text-[#0F172A]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Duration / Type
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg bg-white text-[#0F172A]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg bg-white text-[#0F172A]"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto bg-[#F5A623] text-[#0F172A] rounded-lg px-6 py-2.5 font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}