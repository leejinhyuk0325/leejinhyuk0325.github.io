'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SavedPost {
  id: string;
  title: string;
  deadline: string;
  apply: string;
  meta: string;
  tags: string[];
  savedAt: string;
}

export default function ReaderMyPage() {
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);

  useEffect(() => {
    // 로컬 스토리지에서 저장된 작품 불러오기
    const saved = localStorage.getItem('savedPosts');
    if (saved) {
      setSavedPosts(JSON.parse(saved));
    }
  }, []);

  const removePost = (id: string) => {
    const updated = savedPosts.filter(post => post.id !== id);
    setSavedPosts(updated);
    localStorage.setItem('savedPosts', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Creative Crowdfunding
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/mypage/author"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                작가 페이지
              </Link>
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">독자 마이페이지</h1>
          <p className="text-gray-600">관심있는 작품을 저장하고 관리하세요</p>
        </div>

        {savedPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">저장된 작품이 없습니다</h3>
            <p className="mt-2 text-sm text-gray-500">
              작품 상세 페이지에서 관심있는 작품을 저장해보세요
            </p>
            <Link
              href="/"
              className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              작품 둘러보기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-red-600">{post.deadline}</span>
                  <button
                    onClick={() => removePost(post.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="저장 취소"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <Link href={`/detail/${post.id}`} className="block">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {post.apply}
                    </span>
                    <span className="text-xs text-gray-500">{post.meta}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h3>
                </Link>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  저장일: {new Date(post.savedAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

