"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../lib/LanguageContext";
import { translations } from "../../lib/translations";
import { API_URL } from "../../lib/apiConfig";

export default function AdminProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    phone?: string;
  } | null>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [loginHistory, setLoginHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
      return;
    }

    if (user) {
      fetch(`${API_URL}/api/users/${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
          setForm({
            name: data.name || "",
            phone: data.phone || "",
            email: data.email || "",
          });
        });

      fetch(`${API_URL}/api/login-tracking/history/${user.uid}`)
        .then((res) => res.json())
        .then((data) =>
          setLoginHistory(Array.isArray(data) ? data : [])
        )
        .catch((err) => console.error(err));
    }
  }, [user, loading, router]);

  const handleSave = async () => {
    if (!user || !userData) return;

    setSaving(true);

    try {
      const res = await fetch(`${API_URL}/api/users/${user.uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
        }),
      });

      const updated = await res.json();

      if (form.email !== userData.email) {
        await fetch(`${API_URL}/api/users/${user.uid}/email`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newEmail: form.email,
          }),
        });
      }

      setUserData({
        ...updated,
        email: form.email,
      });

      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !userData) {
    return (
      <div className="px-4 sm:px-8 py-10 max-w-2xl mx-auto text-center">
        <p className="text-slate-600">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-10 max-w-5xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-6">
        {t.myProfile}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-[#0F172A]/10 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
            {editing ? (
              <>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    {t.nameLabel}
                  </label>

                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    {t.phoneLabel}
                  </label>

                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    {t.emailLabel}
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#F5A623] text-[#0F172A] rounded-lg px-5 py-2 font-semibold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {saving ? t.saving || "Saving..." : t.save}
                  </button>

                  <button
                    onClick={() => setEditing(false)}
                    className="border border-[#0F172A]/15 rounded-lg px-5 py-2 font-medium"
                  >
                    {t.cancel}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-slate-500">{t.nameLabel}</p>
                  <p className="text-base font-medium text-[#0F172A]">
                    {userData.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">{t.emailLabel}</p>
                  <p className="text-base font-medium text-[#0F172A]">
                    {userData.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">{t.phoneLabel}</p>
                  <p className="text-base font-medium text-[#0F172A]">
                    {userData.phone || "Not added"}
                  </p>
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="mt-2 w-full sm:w-auto bg-[#F5A623] text-[#0F172A] rounded-lg px-6 py-2.5 font-semibold hover:opacity-90 transition"
                >
                  {t.editProfile}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-[#0F172A]/10 rounded-xl p-5 sm:p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-600 mb-3">
              {t.loginHistory}
            </p>

            {loginHistory.length === 0 && (
              <p className="text-sm text-slate-500">
                {t.noLoginHistory}
              </p>
            )}

            <div className="flex flex-col gap-2">
              {loginHistory.map((entry) => (
                <div
                  key={entry._id}
                  className="text-sm text-slate-600 border-b border-[#0F172A]/5 pb-2 last:border-0"
                >
                  <span className="font-medium text-[#0F172A]">
                    {entry.browser}
                  </span>{" "}
                  on {entry.os} ({entry.deviceType}) — {entry.ipAddress}
                  <br />
                  <span className="text-xs text-slate-400">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}