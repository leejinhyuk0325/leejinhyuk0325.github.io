'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Post {
  id: string | number;
  title: string;
  deadline: string;
  apply: string;
  meta?: string;
  tags: string | string[];
  category?: string;
  intro?: string;
  requirement?: string;
  shareCount?: number;
  tagList?: string[];
}

interface PostListProps {
  title: string;
  posts: Post[];
  variant?: 'default' | 'urgent' | 'paid';
  gridCols?: string;
  initialCount?: number;
}

export default function PostList({
  title,
  posts,
  variant = 'default',
  gridCols = 'md:grid-cols-2 lg:grid-cols-3',
  initialCount = 3,
}: PostListProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const incrementCount = 3; // 한 번에 3개씩 더 보이도록

  const visiblePosts = posts.slice(0, visibleCount);
  const remainingCount = posts.length - visibleCount;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + incrementCount, posts.length));
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'urgent':
        return 'border-l-4 border-blue-500';
      case 'paid':
        return 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200';
      default:
        return '';
    }
  };

  const getDeadlineColor = () => {
    switch (variant) {
      case 'urgent':
        return 'text-blue-600';
      case 'paid':
        return 'text-purple-600';
      default:
        return 'text-red-600';
    }
  };

  const getApplyBadgeColor = () => {
    switch (variant) {
      case 'paid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const parseTags = (tags: string | string[]): string[] => {
    if (Array.isArray(tags)) {
      return tags;
    }
    return tags.split(' ').filter((tag) => tag.trim());
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
        {visiblePosts.map((post) => {
          const tags = parseTags(post.tags);
          return (
            <div
              key={post.id}
              className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 ${getVariantStyles()}`}
            >
              <Link href={`/detail/${post.id}`} className="block cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium ${getDeadlineColor()}`}>
                    {post.deadline}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${getApplyBadgeColor()} px-2 py-1 rounded`}>
                      {post.apply}
                    </span>
                    {post.shareCount !== undefined && (
                      <span className="text-xs text-gray-500">{post.shareCount} 공유</span>
                    )}
                    {post.meta && (
                      <span className="text-xs text-gray-500">{post.meta}</span>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
              </Link>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag, index) => (
                  <button
                    key={index}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {remainingCount > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={handleShowMore}
            className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            더보기 ({remainingCount}개 더)
          </button>
        </div>
      )}
    </section>
  );
}

