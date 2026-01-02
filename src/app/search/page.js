"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import { allPosts } from "@/data/posts";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tagParam = searchParams.get("tag") || "";
  const queryParam = searchParams.get("q") || "";
  const initialQuery = tagParam ? `#${tagParam}` : queryParam;
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const isTagSearch = query.startsWith("#");
    const searchTerm = isTagSearch ? query.substring(1) : query;

    return allPosts.filter((post) => {
      if (isTagSearch) {
        // 태그 검색: 정확한 태그 매칭
        return (
          post.tagList &&
          post.tagList.some(
            (tag) => tag.toLowerCase().replace("#", "") === searchTerm
          )
        );
      } else {
        // 일반 검색: 제목, 태그, 소개글에서 검색
        return (
          post.title.toLowerCase().includes(query) ||
          post.tags.toLowerCase().includes(query) ||
          post.intro.toLowerCase().includes(query) ||
          (post.tagList &&
            post.tagList.some((tag) => tag.toLowerCase().includes(query)))
        );
      }
    });
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // URL 업데이트
    if (query.startsWith("#")) {
      const tagName = query.substring(1);
      if (tagName) {
        router.replace(`/search?tag=${encodeURIComponent(tagName)}`, {
          scroll: false,
        });
      } else {
        router.replace("/search", { scroll: false });
      }
    } else if (query) {
      router.replace(`/search?q=${encodeURIComponent(query)}`, {
        scroll: false,
      });
    } else {
      router.replace("/search", { scroll: false });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (searchQuery.startsWith("#")) {
        const tagName = searchQuery.substring(1);
        router.replace(`/search?tag=${encodeURIComponent(tagName)}`, {
          scroll: false,
        });
      } else {
        router.replace(`/search?q=${encodeURIComponent(searchQuery)}`, {
          scroll: false,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">검색</h1>
          <form onSubmit={handleSearchSubmit} className="max-w-2xl">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="검색어를 입력하세요..."
                className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                검색
              </button>
            </div>
          </form>
        </div>

        {searchQuery.trim() ? (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {tagParam ? (
                  <>태그 검색 결과: &quot;{searchQuery}&quot;</>
                ) : (
                  <>검색 결과: &quot;{searchQuery}&quot;</>
                )}
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                {filteredPosts.length}개의 결과를 찾았습니다.
              </p>
            </div>
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} variant="default" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xs text-gray-500">
                  검색 결과가 없습니다. 다른 검색어를 시도해보세요.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xs text-gray-500">
              검색어를 입력하여 원하는 콘텐츠를 찾아보세요.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <p className="text-xs text-gray-500">로딩 중...</p>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
