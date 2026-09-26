"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import { useOtpGuard } from "../lib/useOtpGuard";
import { API_URL } from "../lib/apiConfig";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checkingRole, setCheckingRole] = useState(true);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  const publicPaths = ["/recruiter/login", "/recruiter/signup"];

  const { checked, blocked } = useOtpGuard("/recruiter/login");

  useEffect(() => {
    if (publicPaths.includes(pathname)) {
      setCheckingRole(false);
      return;
    }

    if (!loading && !user) {
      router.push("/recruiter/login");
      return;
    }

    if (user) {
      fetch(`${API_URL}/api/users/role/${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.role !== "recruiter") {
            router.push("/recruiter/login");
          } else {
            setIsRecruiter(true);
          }
          setCheckingRole(false);
        });
    }
  }, [user, loading, pathname, router]);

  if (!checked || blocked) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-slate-600">{t.loading}</p>
      </div>
    );
  }

  if (loading || checkingRole) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-slate-600">{t.loading}</p>
      </div>
    );
  }

  if (publicPaths.includes(pathname)) return <>{children}</>;
  if (!isRecruiter) return null;

  return <>{children}</>;
}