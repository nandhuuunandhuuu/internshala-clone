"use client";

import { useState } from "react";
import {
  User,
  Search,
  ClipboardList,
  AlertTriangle,
  Wrench,
  HelpCircle,
  Mail,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { contactPageContent } from "../lib/translations/contact.content";

const TOPIC_ICONS = [
  User,
  Search,
  ClipboardList,
  AlertTriangle,
  Wrench,
  HelpCircle,
];

export default function ContactPage() {
  const { language } = useLanguage();

  const t =
    contactPageContent[language as keyof typeof contactPageContent] ??
    contactPageContent.en;

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const formHeading = selectedTopic
    ? t.formHeadingWithTopic.replace("{topic}", selectedTopic)
    : t.formHeading;

  return (
    <div className="bg-[#FAFAF9]">
      <div className="px-4 sm:px-8 pt-16 pb-6 max-w-5xl mx-auto text-center">
        <p className="text-xs font-semibold text-[#F5A623] uppercase tracking-wide mb-2">
          {t.eyebrow}
        </p>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-3">
          {t.heading}
        </h1>

        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          {t.subheading}
        </p>
      </div>

      <div className="px-4 sm:px-8 pb-20 max-w-5xl mx-auto grid md:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar: topics + direct contact */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-[#0F172A]/10 rounded-xl p-2 shadow-sm">
            {t.topics.map((topic, i) => {
              const Icon = TOPIC_ICONS[i % TOPIC_ICONS.length];
              const active = selectedTopic === topic.title;

              return (
                <button
                  key={topic.title}
                  onClick={() => setSelectedTopic(topic.title)}
                  className={`w-full flex items-start gap-3 text-left rounded-lg p-3 transition ${
                    active ? "bg-[#F5A623]/10" : "hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`mt-0.5 shrink-0 ${
                      active ? "text-[#F5A623]" : "text-slate-400"
                    }`}
                  />

                  <span>
                    <span className="block text-sm font-semibold text-[#0F172A]">
                      {topic.title}
                    </span>

                    <span className="block text-xs text-slate-500 mt-0.5">
                      {topic.desc}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="bg-[#0F172A] rounded-xl p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#F5A623] mb-3">
              {t.sidebar.heading}
            </p>

            <div className="flex items-start gap-3 mb-3">
              <Mail
                size={16}
                className="mt-0.5 shrink-0 text-slate-300"
              />

              <div>
                <p className="text-xs text-slate-400">
                  {t.sidebar.emailLabel}
                </p>

                <p className="text-sm">
                  {t.sidebar.emailValue}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock
                size={16}
                className="mt-0.5 shrink-0 text-slate-300"
              />

              <div>
                <p className="text-xs text-slate-400">
                  {t.sidebar.responseTimeLabel}
                </p>

                <p className="text-sm">
                  {t.sidebar.responseTimeValue}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
            {formHeading}
          </h2>

          {submitted ? (
            <div className="bg-[#0D9488]/10 border border-[#0D9488]/30 rounded-xl p-6 flex flex-col items-center text-center gap-2">
              <CheckCircle2
                className="text-[#0D9488]"
                size={28}
              />

              <p className="text-sm font-semibold text-[#0D9488]">
                {t.successTitle}
              </p>

              <p className="text-sm text-[#0D9488]/80">
                {t.successBody}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 bg-white border border-[#0F172A]/10 rounded-xl p-6 shadow-sm"
            >
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder={t.namePlaceholder}
                required
                className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg text-sm"
              />

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                placeholder={t.emailPlaceholder}
                required
                className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg text-sm"
              />

              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    message: e.target.value,
                  })
                }
                placeholder={t.messagePlaceholder}
                rows={5}
                required
                className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg text-sm"
              />

              <button
                type="submit"
                className="bg-[#F5A623] text-[#0F172A] rounded-lg py-2.5 font-semibold hover:opacity-90 transition text-sm"
              >
                {t.submitButton}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}