"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import { useOtpGuard } from "../lib/useOtpGuard";
import { API_URL } from "../lib/apiConfig";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const { checked, blocked } = useOtpGuard("/login");

  const { user, loading } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const PLAN_LIST = [
    {
      key: "free",
      label: t.freePlanLabel,
      price: 0,
      tagline: t.freePlanTagline,
      features: [
        t.oneApplicationPerMonth,
        t.browseInternshipsAndJobs,
        t.personalizedForYouMatches,
        t.careerReadiness,
        t.interviewPrepQuestionsFeature,
        t.publicSpaceCommunityAccess,
      ],
    },
    {
      key: "bronze",
      label: t.bronzePlanLabel,
      price: 100,
      tagline: t.bronzePlanTagline,
      features: [
        t.threeApplicationsPerMonth,
        t.everythingInFree,
        t.priorityVisibilityApplicantLists,
        t.careerProgressDashboard,
        t.skillGapDetectionEveryMatch,
      ],
    },
    {
      key: "silver",
      label: t.silverPlanLabel,
      price: 300,
      tagline: t.silverPlanTagline,
      features: [
        t.fiveApplicationsPerMonth,
        t.everythingInBronze,
        t.earlyAccessNewListings,
        t.extendedInterviewPrepQuestionSets,
        t.fasterSupportResponse,
      ],
    },
    {
      key: "gold",
      label: t.goldPlanLabel,
      price: 1000,
      tagline: t.goldPlanTagline,
      features: [
        t.unlimitedApplications,
        t.everythingInSilver,
        t.topPlacementRecruiterSearches,
        t.fullCareerRoadmapGuidance,
        t.dedicatedPrioritySupport,
      ],
      highlight: true,
    },
  ];

  const [currentPlan, setCurrentPlan] = useState("free");
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      fetch(`${API_URL}/api/payments/plan/${user.uid}`)
        .then((res) => res.json())
        .then((data) => setCurrentPlan(data.plan))
        .catch((err) => console.error(err));
    }
  }, [user, loading, router]);

  const handleSubscribe = async (planKey: string) => {
    if (!user || planKey === "free") return;
    setError("");
    setSuccess("");
    setProcessing(planKey);

    try {
      const orderRes = await fetch(`${API_URL}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setError(orderData.error);
        setProcessing(null);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: "INR",
        name: "CareerLaunch",
        description: `${orderData.plan.label} Plan Subscription`,
        order_id: orderData.order.id,
        handler: async (response: any) => {
          const verifyRes = await fetch(`${API_URL}/api/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firebaseUid: user.uid,
              planKey,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            setCurrentPlan(planKey);
            setSuccess(t.subscriptionActivated);
          } else {
            setError(verifyData.error);
          }
          setProcessing(null);
        },
        modal: {
          ondismiss: () => setProcessing(null),
        },
        theme: { color: "#F5A623" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(t.genericError);
      setProcessing(null);
    }
  };

  if (!checked || blocked) {
    return (
      <div className="px-4 sm:px-8 py-10 max-w-5xl mx-auto text-center">
        <p className="text-slate-600">{t.loading}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-8 py-10 max-w-4xl mx-auto text-center">
        <p className="text-slate-600">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-10 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-1">
        {t.choosePlan}
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        {t.upgradeSubtitle}
      </p>

      <div className="bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-lg p-3 text-sm text-[#B7791F] mb-6">
        {t.paymentNotice}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-[#0D9488]/10 border border-[#0D9488]/30 rounded-lg p-3 text-sm text-[#0D9488] mb-6">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        {PLAN_LIST.map((plan) => (
          <div
            key={plan.key}
            className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col h-full relative ${
              currentPlan === plan.key
                ? "border-[#F5A623] ring-2 ring-[#F5A623]/30"
                : plan.highlight
                ? "border-[#0F172A]/20 shadow-md"
                : "border-[#0F172A]/10"
            }`}
          >
            {plan.highlight && currentPlan !== plan.key && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold bg-[#0F172A] text-white px-3 py-1 rounded-full">
                {t.bestValue}
              </span>
            )}

            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              {plan.label}
            </p>
            <p className="text-3xl font-bold text-[#0F172A] mt-2">
              {plan.price === 0 ? plan.label : `₹${plan.price}`}
              {plan.price > 0 && <span className="text-sm text-slate-400 font-normal">{t.perMonth}</span>}
            </p>
            <p className="text-sm text-slate-500 mt-1 mb-4">{plan.tagline}</p>

            <ul className="flex flex-col gap-2.5 flex-1 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0D9488"
                    strokeWidth="3"
                    className="shrink-0 mt-0.5"
                  >
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {currentPlan === plan.key ? (
              <span className="text-center text-sm font-medium text-[#F5A623] border border-[#F5A623]/40 rounded-lg py-2.5">
                {t.currentPlan}
              </span>
            ) : plan.key === "free" ? (
              <span className="text-center text-sm text-slate-400 border border-[#0F172A]/10 rounded-lg py-2.5">
                {t.defaultPlan}
              </span>
            ) : (
              <button
                onClick={() => handleSubscribe(plan.key)}
                disabled={processing === plan.key}
                className={`rounded-lg py-2.5 font-semibold transition disabled:opacity-50 ${
                  plan.highlight
                    ? "bg-[#0F172A] text-white hover:opacity-90"
                    : "bg-[#F5A623] text-[#0F172A] hover:opacity-90"
                }`}
              >
                {processing === plan.key ? t.processing : t.subscribe}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}