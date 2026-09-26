"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useOtpGuard(loginPath: string) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("otpPending") === "true") {
      setBlocked(true);
      router.push(loginPath);
    } else {
      setChecked(true);
    }
  }, [router, loginPath]);

  return { checked, blocked };
}