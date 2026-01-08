"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import { publishToPopular, getAllPosts } from "@/utils/posts";
import Link from "next/link";

export default function AuthorPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myPosts, setMyPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [activeTab, setActiveTab] = useState("my"); // "my" or "popular"
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("세션 가져오기 오류:", error);
          router.push("/login");
          return;
        }

        if (!session) {
          router.push("/login");
          return;
        }

        setUser(session.user);
      } catch (err) {
        console.error("사용자 정보 가져오기 오류:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        router.push("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user, activeTab]);

  const loadPosts = async () => {
    if (!user) return;

    setLoadingPosts(true);
    try {
      if (activeTab === "my") {
        // 내가 작성한 게시글 가져오기 (현재는 모든 게시글에서 필터링)
        // 실제로는 posts 테이블에 author_id 컬럼이 있어야 함
        const all = await getAllPosts();
        // 임시로 모든 게시글을 표시 (나중에 author_id로 필터링 가능)
        setMyPosts(all);
      } else {
        // 인기글 목록 가져오기
        const all = await getAllPosts();
        const popular = all.filter((post) => post.category === "popular");
        setAllPosts(popular);
      }
    } catch (error) {
      console.error("게시글 로드 오류:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handlePublishToPopular = async (postId) => {
    if (!user) return;

    if (
      !confirm(
        "이 게시글을 연재도전에 연재하시겠습니까? 연재도전에 연재하면 더 많은 독자들이 볼 수 있습니다."
      )
    ) {
      return;
    }

    const result = await publishToPopular(postId, user.id);
    if (result.success) {
      alert("연재도전에 연재되었습니다!");
      loadPosts();
    } else {
      alert("연재에 실패했습니다. 다시 시도해주세요.");
      console.error("연재 오류:", result.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentPosts = activeTab === "my" ? myPosts : allPosts;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/mypage"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            마이페이지로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">작가페이지</h1>
          <p className="text-gray-600">
            내 작품을 관리하고 연재도전에 연재할 수 있습니다.
          </p>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("my")}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                  activeTab === "my"
                    ? "border-b-2 border-purple-500 text-purple-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                내 작품 ({myPosts.length})
              </button>
              <button
                onClick={() => setActiveTab("popular")}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                  activeTab === "popular"
                    ? "border-b-2 border-purple-500 text-purple-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                연재도전 연재 ({allPosts.length})
              </button>
            </nav>
          </div>
        </div>

        {/* 게시글 목록 */}
        {loadingPosts ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        ) : activeTab === "my" && myPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <p className="text-gray-600 text-lg mb-4">
              아직 작성한 작품이 없습니다.
            </p>
            <Link
              href="/"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              작품 작성하기 →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post) => (
              <div key={post.id} className="relative">
                <PostCard post={post} variant="default" />
                {activeTab === "my" && post.category !== "popular" && (
                  <button
                    onClick={() => handlePublishToPopular(post.id)}
                    className="absolute top-4 right-4 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition-colors text-xs font-medium"
                    title="연재도전에 연재하기"
                  >
                    연재도전 연재
                  </button>
                )}
                {activeTab === "popular" && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      연재도전
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

