"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SerialCard from "@/components/SerialCard";
import {
  getUserSharedSerials,
  getUserFavorites,
  removeFavorite,
} from "@/utils/serials";
import Link from "next/link";

export default function ReaderPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("shared"); // "shared" or "favorites"
  const [sharedSerials, setSharedSerials] = useState([]);
  const [favoriteSerials, setFavoriteSerials] = useState([]);
  const [loadingSerials, setLoadingSerials] = useState(false);
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

    setLoadingSerials(true);
    try {
      if (activeTab === "shared") {
        const serials = await getUserSharedSerials(user.id);
        setSharedSerials(serials);
      } else {
        const serials = await getUserFavorites(user.id);
        setFavoriteSerials(serials);
      }
    } catch (error) {
      console.error("게시글 로드 오류:", error);
    } finally {
      setLoadingSerials(false);
    }
  };

  const handleRemoveFavorite = async (postId) => {
    if (!user) return;

    const result = await removeFavorite(postId, user.id);
    if (result.success) {
      setFavoriteSerials((prev) => prev.filter((post) => post.id !== postId));
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

  const currentSerials =
    activeTab === "shared" ? sharedSerials : favoriteSerials;

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">독자페이지</h1>
          <p className="text-gray-600">
            공유한 게시글과 관심있는 글을 확인하세요.
          </p>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("shared")}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                  activeTab === "shared"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                공유한 게시글 ({sharedSerials.length})
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                  activeTab === "favorites"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                관심있는 글 ({favoriteSerials.length})
              </button>
            </nav>
          </div>
        </div>

        {/* 게시글 목록 */}
        {loadingSerials ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        ) : currentSerials.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-600 text-lg">
              {activeTab === "shared"
                ? "아직 공유한 게시글이 없습니다."
                : "아직 관심있는 글이 없습니다."}
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
            >
              게시글 둘러보기 →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSerials.map((serial) => (
              <div key={serial.id} className="relative">
                <SerialCard serial={serial} variant="default" />
                {activeTab === "favorites" && (
                  <button
                    onClick={() => handleRemoveFavorite(serial.id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    title="관심있는 글에서 제거"
                  >
                    <svg
                      className="w-5 h-5 text-red-600"
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
