"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../lib/LanguageContext";
import { translations } from "../../lib/translations";
import { API_URL } from "../../lib/apiConfig";

type Company = {
  _id: string;
  name: string;
  website: string;
  industry: string;
  description: string;
  verified: boolean;
};

type LoginHistory = {
  _id: string;
  browser: string;
  os: string;
  deviceType: string;
  createdAt: string;
};

export default function RecruiterProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const { language } = useLanguage();
  const t = translations[language];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState<Company | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    companyName: "",
    website: "",
    industry: "",
    description: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/recruiter/login");
      return;
    }

    if (user) {
      fetch(`${API_URL}/api/users/${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          setName(data.name || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");

          setForm((prev) => ({
            ...prev,
            name: data.name || "",
            phone: data.phone || "",
            email: data.email || "",
          }));
        });

      fetch(`${API_URL}/api/companies/by-user/${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          setCompany(data);

          setForm((prev) => ({
            ...prev,
            companyName: data.name || "",
            website: data.website || "",
            industry: data.industry || "",
            description: data.description || "",
          }));
        })
        .catch((err) => console.error(err));

      fetch(`${API_URL}/api/login-tracking/history/${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          setLoginHistory(data);
        })
        .catch((err) => console.error(err));
    }
  }, [user, loading, router]);

  const handleSave = async () => {
    if (!user || !company) return;

    setSaving(true);

    try {
      await fetch(`${API_URL}/api/users/${user.uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
        }),
      });

      await fetch(`${API_URL}/api/companies/${company._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.companyName,
          website: form.website,
          industry: form.industry,
          description: form.description,
        }),
      });

      if (form.email !== email) {
        await fetch(`${API_URL}/api/users/${user.uid}/email`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newEmail: form.email,
          }),
        });
      }

      setName(form.name);
      setPhone(form.phone);
      setEmail(form.email);

      setCompany({
        ...company,
        name: form.companyName,
        website: form.website,
        industry: form.industry,
        description: form.description,
      });

      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setDeleting(true);

    try {
      await fetch(`${API_URL}/api/users/${user.uid}`, {
        method: "DELETE",
      });

      router.push("/recruiter/login");
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  if (loading || !company) {
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

                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    {t.companyLabel}
                  </label>

                  <input
                    value={form.companyName}
                    onChange={(e) =>
                      setForm({ ...form, companyName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    {t.websiteLabel}
                  </label>

                  <input
                    value={form.website}
                    onChange={(e) =>
                      setForm({ ...form, website: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    {t.industryLabel}
                  </label>

                  <input
                    value={form.industry}
                    onChange={(e) =>
                      setForm({ ...form, industry: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    {t.companyDescLabel}
                  </label>

                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#F5A623] text-[#0F172A] rounded-lg px-5 py-2 font-semibold hover:opacity-90 transition"
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
                    {name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">{t.emailLabel}</p>
                  <p className="text-base font-medium text-[#0F172A]">
                    {email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">{t.phoneLabel}</p>
                  <p className="text-base font-medium text-[#0F172A]">
                    {phone || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">{t.companyLabel}</p>
                  <p className="text-base font-medium text-[#0F172A]">
                    {company.name}{" "}
                    {company.verified && (
                      <span className="text-xs text-[#0D9488] font-medium">
                        ✓ {t.verified}
                      </span>
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">{t.industryLabel}</p>
                  <p className="text-base font-medium text-[#0F172A]">
                    {company.industry || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">{t.websiteLabel}</p>
                  <p className="text-base font-medium text-[#0F172A]">
                    {company.website || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">{t.companyDescLabel}</p>
                  <p className="text-sm text-slate-600">
                    {company.description || "—"}
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
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
              {t.loginHistory}
            </h2>

            {loginHistory.length === 0 ? (
              <p className="text-sm text-slate-500">
                {t.noLoginHistory}
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {loginHistory.map((login) => (
                  <div
                    key={login._id}
                    className="border border-[#0F172A]/10 rounded-lg p-4"
                  >
                    <p className="text-sm font-medium text-[#0F172A]">
                      {login.deviceType || t.unknownDevice}
                    </p>

                    <p className="text-sm text-slate-600 mt-1">
                      {login.browser || t.unknownBrowser} •{" "}
                      {login.os || t.unknownOS}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(login.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-sm text-red-600 hover:underline"
          >
            {t.deleteAccount}
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-sm mx-auto">
            <p className="text-sm text-red-700 mb-3">
              {t.deleteRecruiterConfirm}
            </p>

            <div className="flex gap-2 justify-center">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="text-sm font-medium bg-red-600 text-white px-4 py-1.5 rounded-lg disabled:opacity-50"
              >
                {deleting ? t.deleting : t.yesDelete}
              </button>

              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-sm font-medium border border-[#0F172A]/15 px-4 py-1.5 rounded-lg"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
