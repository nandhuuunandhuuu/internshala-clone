"use client";

import { Target, TrendingUp, Users, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { aboutPageContent  } from "../lib/translations/about.content";

export default function AboutPage() {
  const { language } = useLanguage();
  const t = aboutPageContent [language];

  const icons = [Sparkles, TrendingUp, Users];

  return (
    <div className="bg-[#FAFAF9]">
      {/* Hero */}
      <div className="px-4 sm:px-8 pt-16 pb-14 max-w-4xl mx-auto text-center">
        <p className="text-xs font-semibold text-[#F5A623] uppercase tracking-wide mb-3">
          {t.eyebrow}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4 leading-tight">
          {t.heading}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t.subheading}
        </p>

        {/* Stat bar */}
        <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl mx-auto">
          {t.stats.map((s) => (
            <div key={s.label}>
              <p className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                {s.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="px-4 sm:px-8 max-w-4xl mx-auto pb-14">
        <div className="bg-[#0F172A] rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row gap-6 items-start">
          <Target className="text-[#F5A623] shrink-0" size={28} />
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              {t.mission.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t.mission.body}
            </p>
          </div>
        </div>
      </div>

      {/* Differentiators */}
      <div className="px-4 sm:px-8 max-w-4xl mx-auto pb-14">
        <h2 className="text-xl font-bold text-[#0F172A] mb-6">
          {t.differentiatorsHeading}
        </h2>

        <div className="grid sm:grid-cols-3 gap-5">
          {t.differentiators.map((d, i) => {
            const Icon = icons[i % icons.length];

            return (
              <div
                key={d.title}
                className="bg-white border border-[#0F172A]/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-[#F5A623]" />
                </div>

                <h3 className="text-sm font-semibold text-[#0F172A] mb-2">
                  {d.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {d.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* For Employers */}
      <div className="px-4 sm:px-8 max-w-4xl mx-auto pb-14">
        <div className="border border-[#0F172A]/10 rounded-2xl p-8 sm:p-10 bg-white shadow-sm">
          <p className="text-xs font-semibold text-[#F5A623] uppercase tracking-wide mb-2">
            {t.forEmployers.eyebrow}
          </p>

          <h2 className="text-lg font-semibold text-[#0F172A] mb-2">
            {t.forEmployers.title}
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
            {t.forEmployers.body}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 sm:px-8 max-w-4xl mx-auto pb-20">
        <div className="rounded-2xl p-8 sm:p-10 bg-gradient-to-br from-[#F5A623] to-[#f59e0b] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-1">
              {t.cta.heading}
            </h2>

            <p className="text-sm text-[#0F172A]/80">
              {t.cta.subtext}
            </p>
          </div>

          <button className="flex items-center gap-2 bg-[#0F172A] text-white text-sm font-semibold px-5 py-3 rounded-lg shrink-0 hover:bg-[#1e293b] transition-colors">
            {t.cta.button}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}