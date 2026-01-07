"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("로그아웃 오류:", err);
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

  // 사용자 이름 가져오기 (user_metadata 또는 email에서)
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">마이페이지</h1>
            <p className="text-gray-600">회원 정보를 확인하고 관리하세요.</p>
          </div>

          {/* 사용자 정보 카드 */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 md:p-8 mb-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  이름
                </label>
                <p className="text-lg font-semibold text-gray-900">{userName}</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  이메일
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {user.email}
                </p>
              </div>

              {user.user_metadata?.avatar_url && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    프로필 이미지
                  </label>
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="프로필"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleLogout}
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

