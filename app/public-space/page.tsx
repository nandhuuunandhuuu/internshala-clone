"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "../lib/LanguageContext";
import { translations } from "../lib/translations";
import { useOtpGuard } from "../lib/useOtpGuard";
import { API_URL } from "../lib/apiConfig";

const CLOUDINARY_CLOUD_NAME = "tz6kh7li";
const CLOUDINARY_UPLOAD_PRESET = "resume_uploads"; // reusing the same unsigned preset

type Comment = { _id: string; user: { name: string }; text: string; createdAt: string };
type Post = {
  _id: string;
  user: { name: string };
  mediaUrl: string;
  mediaType: "image" | "video";
  caption: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
};

export default function PublicSpacePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const { checked, blocked } = useOtpGuard("/login");

  const [posts, setPosts] = useState<Post[]>([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [limitInfo, setLimitInfo] = useState<{
    friendCount: number;
    limit: number | "unlimited";
    postsToday: number;
    canPost: boolean;
  } | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  const loadFeed = () => {
    fetch(`${API_URL}/api/posts`)
      .then((res) => res.json())
      .then(setPosts)
      .catch((err) => console.error(err));
  };

  const loadLimit = () => {
    if (!user) return;
    fetch(`${API_URL}/api/posts/limit/${user.uid}`)
      .then((res) => res.json())
      .then(setLimitInfo)
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    loadFeed();
    loadLimit();
  }, [user, loading, router]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    setError("");

    try {
      const isVideo = file.type.startsWith("video");
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${isVideo ? "video" : "image"}/upload`,
        { method: "POST", body: uploadData }
      );
      const cloudData = await cloudRes.json();
      if (!cloudData.secure_url) throw new Error("Upload failed");

      const res = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: user.uid,
          mediaUrl: cloudData.secure_url,
          mediaType: isVideo ? "video" : "image",
          caption,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post");
      }

      setCaption("");
      loadFeed();
      loadLimit();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    try {
      await fetch(`${API_URL}/api/posts/${postId}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseUid: user.uid }),
      });
      loadFeed();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (postId: string) => {
    if (!user) return;
    const text = commentDrafts[postId];
    if (!text?.trim()) return;
    try {
      await fetch(`${API_URL}/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseUid: user.uid, text }),
      });
      setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
      loadFeed();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = (postId: string) => {
    const url = `${window.location.origin}/public-space#${postId}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
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
    <div className="px-4 sm:px-8 py-10 max-w-3xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-1">{t.publicSpaceTitle}</h1>
      <p className="text-sm text-slate-500 mb-6">{t.publicSpaceSubtitle}</p>

      <div className="bg-white border border-[#0F172A]/10 rounded-xl p-5 shadow-sm mb-6">
        {limitInfo && (
  <p className="text-xs text-slate-500 mb-3">
    {limitInfo.limit === "unlimited"
      ? t.publicSpaceUnlimited.replace(
          "{friends}",
          String(limitInfo.friendCount)
        )
      : t.publicSpaceUsage
          .replace("{friends}", String(limitInfo.friendCount))
          .replace("{posts}", String(limitInfo.postsToday))
          .replace("{limit}", String(limitInfo.limit))}
        </p>
      )}

      {limitInfo && !limitInfo.canPost && (
        <div className="bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-lg p-3 text-sm text-[#B7791F] mb-3">
       {limitInfo.friendCount === 0
             ? t.addFriendToPost
         : t.postingLimitReached}
          </div>
      )}

        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={t.writeCaption}
          className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg mb-3"
        />

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <label
          className={`inline-block cursor-pointer text-sm font-medium text-[#0F172A] border border-[#0F172A]/15 rounded-lg px-4 py-2 hover:bg-[#0F172A]/5 transition ${
            limitInfo && !limitInfo.canPost ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {uploading ? t.posting : t.uploadMedia}
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleUpload}
            disabled={uploading || (limitInfo ? !limitInfo.canPost : false)}
            className="hidden"
          />
        </label>
      </div>

      <div className="flex flex-col gap-5">
        {posts.map((post) => (
          <div
            key={post._id}
            id={post._id}
            className="bg-white border border-[#0F172A]/10 rounded-xl overflow-hidden shadow-sm"
          >
            <div className="p-4 pb-2">
              <p className="font-medium text-[#0F172A]">{post.user?.name}</p>
              <p className="text-xs text-slate-400">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>

            {post.mediaType === "image" ? (
              <img src={post.mediaUrl} alt="" className="w-full max-h-96 object-cover" />
            ) : (
              <video src={post.mediaUrl} controls className="w-full max-h-96" />
            )}

            {post.caption && (
              <p className="px-4 pt-3 text-sm text-slate-700">{post.caption}</p>
            )}

            <div className="flex items-center gap-4 px-4 py-3 text-sm">
              <button
                onClick={() => handleLike(post._id)}
                className={`font-medium ${
                  user && post.likes.includes(user.uid) ? "text-[#F5A623]" : "text-slate-500"
                }`}
              >
                ♥ {post.likes.length}
              </button>
              <span className="text-slate-500">💬 {post.comments.length}</span>
              <button onClick={() => handleShare(post._id)} className="text-slate-500 font-medium">
                {t.share}
              </button>
            </div>

            {post.comments.length > 0 && (
              <div className="px-4 pb-2 flex flex-col gap-1.5 border-t border-[#0F172A]/5 pt-2">
                {post.comments.map((c) => (
                  <p key={c._id} className="text-sm text-slate-600">
                    <span className="font-medium text-[#0F172A]">{c.user?.name}:</span> {c.text}
                  </p>
                ))}
              </div>
            )}

            <div className="flex gap-2 px-4 pb-4">
              <input
                value={commentDrafts[post._id] || ""}
                onChange={(e) =>
                  setCommentDrafts((prev) => ({ ...prev, [post._id]: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && handleComment(post._id)}
                placeholder={t.addComment}
                className="flex-1 px-3 py-1.5 text-sm border border-[#0F172A]/15 rounded-lg"
              />
              <button
                onClick={() => handleComment(post._id)}
                className="text-sm font-medium text-[#0D9488]"
              >
                {t.post}
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-slate-500 text-sm text-center">{t.noPostsYet}</p>
        )}
      </div>
    </div>
  );
}