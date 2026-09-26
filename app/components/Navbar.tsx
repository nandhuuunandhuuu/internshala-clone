"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuth } from "../lib/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import { API_URL } from "../lib/apiConfig";

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>(() => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("userRole");
  });
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
  if (!user) {
    setRole(null);
    sessionStorage.removeItem("userRole");
    return;
  }
  let cancelled = false;
  fetch(`${API_URL}/api/users/role/${user.uid}`)
    .then((res) => res.json())
    .then((data) => {
      if (!cancelled) {
        setRole(data.role);
        sessionStorage.setItem("userRole", data.role);
      }
    })
    .catch((err) => console.error(err));
  return () => {
    cancelled = true;
  };
  }, [user?.uid, pathname]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const enteringFlow =
      (href.startsWith("/admin") || href.startsWith("/recruiter")) &&
      !pathname.startsWith("/admin") &&
      !pathname.startsWith("/recruiter");

    if (enteringFlow) {
      e.preventDefault();
      window.history.replaceState(null, "", "/");
      router.push(href);
      setMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setMenuOpen(false);
    router.push("/login");
  };

  const studentLinks = [
    { href: "/", label: t.home },
    { href: "/for-you", label: t.forYou },
    { href: "/internships", label: t.internships },
    { href: "/jobs", label: t.jobs },
    { href: "/career-progress", label: t.progress },
    { href: "/pricing", label: t.pricing },
    { href: "/resume-builder", label: t.resumeBuilder },
    { href: "/friends", label: t.friends },
    { href: "/public-space", label: t.publicSpace },
    { href: "/profile", label: t.profile },
  ];

  const recruiterLinks = [
    { href: "/recruiter/dashboard", label: t.dashboardLabel },
    { href: "/recruiter/post", label: t.postListingLabel },
    { href: "/recruiter/applicants", label: t.applicantsLabel },
    { href: "/recruiter/profile", label: t.profile },
  ];

  const adminLinks = [
    { href: "/admin/dashboard", label: t.dashboardLabel },
    { href: "/admin/post", label: t.postListingLabel },
    { href: "/admin/applicants", label: t.applicantsLabel },
    { href: "/admin/manage", label: t.managePlatform },
    { href: "/admin/profile", label: t.profile },
  ];

  const loggedOutLinks = [
    { href: "/admin/demo-access", label: t.admin },
    { href: "/", label: t.home },
    { href: "/internships", label: t.internships },
    { href: "/jobs", label: t.jobs },
  ];

  const links =
  role === "recruiter"
    ? recruiterLinks
    : role === "admin"
    ? adminLinks
    : role === "user"
    ? studentLinks
    : user
    ? []            
    : loggedOutLinks;

  return (
    <nav className="bg-white border-b border-[#0F172A]/10 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 sm:px-8 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623]" />
          <span className="text-xl font-bold text-[#0F172A]">
            CareerLaunch
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-8 text-sm font-medium text-slate-600">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`transition ${
                  isActive
                    ? "text-[#0F172A] font-semibold"
                    : "hover:text-[#0F172A]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <LanguageSwitcher />

          {user ? (
            <button
              onClick={handleLogout}
              className="text-[#0F172A] font-semibold border border-[#0F172A]/15 px-4 py-1.5 rounded-md hover:bg-[#0F172A]/5 transition"
            >
              {t.logout}
            </button>
          ) : (
            <Link
              href="/login"
              className="text-[#0F172A] font-semibold border border-[#0F172A]/15 px-4 py-1.5 rounded-md hover:bg-[#0F172A]/5 transition"
            >
              {t.login}
            </Link>
          )}
        </div>

        <button
          className="sm:hidden text-[#0F172A]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-4 px-4 pb-4 text-sm font-medium text-slate-600">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  handleNavClick(e, link.href);
                  setMenuOpen(false);
                }}
                className={
                  isActive ? "text-[#0F172A] font-semibold" : ""
                }
              >
                {link.label}
              </Link>
            );
          })}

          {user ? (
            <button
              onClick={handleLogout}
              className="text-left text-[#0F172A] font-semibold"
            >
              {t.logout}
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-[#0F172A] font-semibold"
            >
              {t.login}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}