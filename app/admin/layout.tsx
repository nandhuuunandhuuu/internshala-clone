"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import { useOtpGuard } from "../lib/useOtpGuard";
import { API_URL } from "../lib/apiConfig";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checkingRole, setCheckingRole] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const { checked, blocked } = useOtpGuard("/admin/login");

  useEffect(() => {
    if (pathname === "/admin/login"  || pathname === "/admin/demo-access") {
      setCheckingRole(false);
      return;
    }

    if (!loading && !user) {
      router.push("/admin/login");
      return;
    }

    if (user) {
      fetch(`${API_URL}/api/users/role/${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.role !== "admin") {
            router.push("/admin/login");
          } else {
            setIsAdmin(true);
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
        <p className="text-zinc-600 dark:text-zinc-400">{t.loading}</p>
      </div>
    );
  }

  if (pathname === "/admin/login" || pathname === "/admin/demo-access") return <>{children}</>;
  if (!isAdmin) return null;

  return <>{children}</>;
}