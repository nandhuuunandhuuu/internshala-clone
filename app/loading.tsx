"use client";

import { useLanguage } from "./lib/LanguageContext";
import { translations } from "./lib/translations";

export default function Loading() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="px-4 py-20 text-center">
      <p className="text-slate-600">{t.loading}</p>
    </div>
  );
}