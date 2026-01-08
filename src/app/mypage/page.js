"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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

    // 인증 상태 변경 감지
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

  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.user_name ||
    user.email?.split("@")[0] ||
    "사용자";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* 페이지 제목 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              마이페이지
            </h1>
            <p className="text-gray-600">원하는 페이지를 선택하세요.</p>
          </div>

          {/* 사용자 정보 카드 */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 md:p-8 mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {userName}
              </h2>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* 페이지 선택 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 독자 페이지 */}
            <Link
              href="/mypage/reader"
              className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 hover:shadow-lg transition-all transform hover:scale-105"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-700 transition-colors">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  독자페이지
                </h3>
                <p className="text-gray-600 text-sm">
                  공유한 게시글과 관심있는 글을 모아서 볼 수 있습니다.
                </p>
              </div>
            </Link>

            {/* 작가 페이지 */}
            <Link
              href="/mypage/author"
              className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 hover:shadow-lg transition-all transform hover:scale-105"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-700 transition-colors">
                  <svg
                    className="w-8 h-8 text-white"
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
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  작가페이지
                </h3>
                <p className="text-gray-600 text-sm">
                  연재도전에 연재하고 작품을 관리할 수 있습니다.
                </p>
              </div>
            </Link>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/");
                router.refresh();
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              로그아웃
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              홈으로 이동
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
