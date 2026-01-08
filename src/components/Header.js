"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
      } catch (error) {
        console.error("세션 확인 오류:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsLoggedIn(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("로그아웃 오류:", err);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Creative Crowdfunding
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/search"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              검색
            </Link>
            <Link
              href="/community"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              커뮤니티
            </Link>
            <Link
              href="/qa"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Q&A
            </Link>
            <Link
              href="/guide"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              이용가이드
            </Link>
            {loading ? (
              <div className="w-16 h-8"></div>
            ) : isLoggedIn ? (
              <>
                <Link
                  href="/mypage"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-[28px] font-bold"
                >
                  마이페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
