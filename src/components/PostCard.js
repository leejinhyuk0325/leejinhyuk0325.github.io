"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getShareCount } from "@/utils/posts";

export default function PostCard({ post, variant = "default" }) {
  const router = useRouter();
  const [shareCount, setShareCount] = useState(post.shareCount || 0);

  const variantStyles = {
    default: "bg-white",
    urgent: "bg-white border-l-4 border-orange-500",
    paid: "bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200",
  };

  const deadlineColors = {
    default: "text-red-600",
    urgent: "text-orange-600",
    paid: "text-purple-600",
  };

  const badgeColors = {
    default: "bg-blue-100 text-blue-800",
    urgent: "bg-blue-100 text-blue-800",
    paid: "bg-purple-100 text-purple-800",
  };

  const tagList =
    post.tagList || post.tags.split(" ").filter((tag) => tag.trim());

  // 컴포넌트 마운트 시 최신 공유 수 가져오기
  useEffect(() => {
    const fetchLatestShareCount = async () => {
      try {
        const latestCount = await getShareCount(post.id);
        setShareCount(latestCount);
      } catch (error) {
        console.error("공유 수 가져오기 실패:", error);
      }
    };

    fetchLatestShareCount();
  }, [post.id]);

  const handleTagClick = (e, tag) => {
    e.preventDefault();
    e.stopPropagation();
    const tagName = tag.replace("#", "");
    router.push(`/search?tag=${encodeURIComponent(tagName)}`);
  };

  return (
    <div
      className={`${variantStyles[variant]} rounded-lg shadow-md hover:shadow-lg transition-shadow p-6`}
    >
      <Link href={`/detail/${post.id}`} className="block cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${deadlineColors[variant]}`}>
            {post.deadline}
          </span>
          <div className="flex items-center space-x-2">
            <span
              className={`text-xs ${badgeColors[variant]} px-2 py-1 rounded`}
            >
              {post.apply}
            </span>
            <span className="text-xs text-gray-500">{shareCount} 공유</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {post.title}
        </h3>
      </Link>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {tagList.map((tag, index) => {
          const tagText = tag.trim();
          if (!tagText) return null;
          return (
            <button
              key={index}
              onClick={(e) => handleTagClick(e, tagText)}
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              {tagText}
            </button>
          );
        })}
      </div>
    </div>
  );
}
