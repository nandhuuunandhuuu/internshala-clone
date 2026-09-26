"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import { useOtpGuard } from "../lib/useOtpGuard";
import { API_URL } from "../lib/apiConfig";

type SearchResult = { _id: string; name: string; email: string };
type FriendRequestItem = {
  _id: string;
  from: { _id: string; name: string; email: string };
};
type Friend = { _id: string; name: string; email: string };

export default function FriendsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const { checked, blocked } = useOtpGuard("/login");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [requests, setRequests] = useState<FriendRequestItem[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [sentTo, setSentTo] = useState<string[]>([]);

  const loadData = () => {
    if (!user) return;
    fetch(`${API_URL}/api/friends/requests/${user.uid}`)
      .then((res) => res.json())
      .then(setRequests)
      .catch((err) => console.error(err));

    fetch(`${API_URL}/api/friends/list/${user.uid}`)
      .then((res) => res.json())
      .then(setFriends)
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    loadData();
  }, [user, loading, router]);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (!q || !user) {
      setResults([]);
      return;
    }
    const res = await fetch(
      `${API_URL}/api/friends/search?q=${encodeURIComponent(q)}&excludeUid=${user.uid}`
    );
    const data = await res.json();
    setResults(Array.isArray(data) ? data : []);
  };

  const sendRequest = async (toUserId: string) => {
    if (!user) return;
    try {
      await fetch(`${API_URL}/api/friends/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromFirebaseUid: user.uid, toUserId }),
      });
      setSentTo((prev) => [...prev, toUserId]);
    } catch (err) {
      console.error(err);
    }
  };

  const respondToRequest = async (id: string, action: "accept" | "reject") => {
    try {
      await fetch(`${API_URL}/api/friends/request/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      loadData();
    } catch (err) {
      console.error(err);
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
      <div className="px-4 sm:px-8 py-10 max-w-2xl mx-auto text-center">
        <p className="text-slate-600">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-6">
        {t.friendsTitle}
      </h1>

      <div className="bg-white border border-[#0F172A]/10 rounded-xl p-5 shadow-sm mb-6">
        <p className="text-sm font-medium text-slate-600 mb-2">
          {t.findPeople}
        </p>
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t.searchByName}
          className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg"
        />
        <div className="flex flex-col gap-2 mt-3">
          {results.map((r) => (
            <div
              key={r._id}
              className="flex items-center justify-between text-sm"
            >
              <div>
                <p className="font-medium text-[#0F172A]">{r.name}</p>
                <p className="text-slate-500">{r.email}</p>
              </div>
              <button
                onClick={() => sendRequest(r._id)}
                disabled={sentTo.includes(r._id)}
                className="text-xs font-medium bg-[#F5A623] text-[#0F172A] px-3 py-1.5 rounded-lg disabled:opacity-50"
              >
                {sentTo.includes(r._id) ? t.sent : t.addFriend}
              </button>
            </div>
          ))}
        </div>
      </div>

      {requests.length > 0 && (
        <div className="bg-white border border-[#0F172A]/10 rounded-xl p-5 shadow-sm mb-6">
          <p className="text-sm font-medium text-slate-600 mb-3">
            {t.friendRequests}
          </p>
          <div className="flex flex-col gap-3">
            {requests.map((r) => (
              <div
                key={r._id}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-medium text-[#0F172A]">
                    {r.from?.name}
                  </p>
                  <p className="text-slate-500">{r.from?.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => respondToRequest(r._id, "accept")}
                    className="text-xs font-medium bg-[#0D9488]/10 text-[#0D9488] px-3 py-1.5 rounded-lg"
                  >
                    {t.accept}
                  </button>
                  <button
                    onClick={() => respondToRequest(r._id, "reject")}
                    className="text-xs font-medium bg-red-50 text-red-600 px-3 py-1.5 rounded-lg"
                  >
                    {t.reject}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-[#0F172A]/10 rounded-xl p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-600 mb-3">
          {t.yourFriends} ({friends.length})
        </p>
        {friends.length === 0 && (
          <p className="text-sm text-slate-500">{t.noFriendsYet}</p>
        )}
        <div className="flex flex-col gap-2">
          {friends.map((f) => (
            <div key={f._id} className="text-sm">
              <p className="font-medium text-[#0F172A]">{f.name}</p>
              <p className="text-slate-500">{f.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}