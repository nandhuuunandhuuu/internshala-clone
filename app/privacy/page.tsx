"use client";

import { useState } from "react";
import { useLanguage } from "../lib/LanguageContext";
import { privacyPageContent } from "../lib/translations/privacy.content";

export default function PrivacyPage() {
  const { language } = useLanguage();

  const t =
    privacyPageContent[language as keyof typeof privacyPageContent] ??
    privacyPageContent.en;

  const [activeId, setActiveId] = useState(t.sections[0]?.id);

  const scrollTo = (id: string) => {
    setActiveId(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-[#FAFAF9] px-4 sm:px-8 py-14">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold text-[#F5A623] uppercase tracking-wide mb-2">
          {t.eyebrow}
        </p>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">
          {t.heading}
        </h1>

        <p className="text-xs text-slate-400 mb-10">
          {t.lastUpdatedLabel}: {t.lastUpdatedDate}
        </p>

        <div className="grid md:grid-cols-[220px_1fr] gap-10">
          {/* Table of contents */}
          <nav className="hidden md:block sticky top-8 self-start">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              {t.tocLabel}
            </p>

            <ul className="flex flex-col gap-1">
              {t.sections.map((section, index) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollTo(section.id)}
                    className={`text-left w-full text-sm px-3 py-1.5 rounded-md transition ${
                      activeId === section.id
                        ? "bg-[#F5A623]/10 text-[#0F172A] font-semibold"
                        : "text-slate-500 hover:text-[#0F172A] hover:bg-slate-100"
                    }`}
                  >
                    {index + 1}. {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="flex flex-col gap-10 max-w-2xl">
            {t.sections.map((section, index) => (
              <div
                key={section.id}
                id={section.id}
                className="scroll-mt-8"
              >
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-xs font-semibold text-[#F5A623]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h2 className="text-lg font-semibold text-[#0F172A]">
                    {section.title}
                  </h2>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {section.body}
                </p>
              </div>
            ))}
         </div>
        </div>
      </div>
    </div>
  );
}