"use client";

import { useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

// Demo/evaluation-only entry point - signs in as Admin directly, skipping OTP.
// The real /admin/login flow (with OTP) is untouched and still fully enforced.
const DEMO_ADMIN_EMAIL = "careerlaunch@gmail.com";
const DEMO_ADMIN_PASSWORD = "admin@123";

export default function AdminDemoAccessPage() {
  const router = useRouter();

  useEffect(() => {
    signInWithEmailAndPassword(auth, "careerlaunch@gmail.com", "admin@123")
      .then(() => {
        router.push("/admin/dashboard");
      })
      .catch((err) => {
        console.error("Demo admin login failed:", err);
      });
  }, [router]);

  return (
    <div className="px-4 py-20 text-center">
      <p className="text-slate-600">Signing you in as Admin...</p>
    </div>
  );
}
