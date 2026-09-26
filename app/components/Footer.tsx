"use client";

import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import { useAuth } from "../lib/AuthContext";
import Link from "next/link";

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language];
  const { user } = useAuth();

  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-8 py-6 text-sm text-zinc-600 dark:text-zinc-400">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          &copy; {new Date().getFullYear()} CareerLaunch.{" "}
          {t.allRightsReserved}
        </p>

        <div className="flex gap-4">
          <Link href="/about">{t.aboutLink}</Link>
          <Link href="/contact">{t.contactLink}</Link>
          <Link href="/privacy">{t.privacyLink}</Link>

          {!user && (
            <Link
              href="/recruiter/login"
              className="font-medium text-[#0F172A]"
            >
              {t.forEmployers}
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}