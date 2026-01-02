"use client";

import { useState } from "react";
import PostCard from "./PostCard";

export default function PostSection({
  title,
  posts,
  variant = "default",
  gridCols = "md:grid-cols-2 lg:grid-cols-3",
  initialCount = 3,
}) {
  const [displayCount, setDisplayCount] = useState(initialCount);
  const displayedPosts = posts.slice(0, displayCount);
  const hasMore = posts.length > displayCount;

  const handleShowMore = () => {
    setDisplayCount((prev) => Math.min(prev + 3, posts.length));
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
        {displayedPosts.map((post, index) => (
          <PostCard key={post.id || index} post={post} variant={variant} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={handleShowMore}
            className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            더보기 ({posts.length - displayCount}개 더)
          </button>
        </div>
      )}
    </section>
  );
}
