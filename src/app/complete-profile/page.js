"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

export default function CompleteProfilePage() {
  const [instagramId, setInstagramId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserAndProfile = async () => {
      try {
        // 세션 확인
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login");
          return;
        }

        // 사용자 프로필 확인
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("instagram_id")
          .eq("id", session.user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          // PGRST116은 "no rows returned" 에러
          console.error("프로필 확인 오류:", profileError);
        }

        // 이미 인스타그램 아이디가 있으면 마이페이지로 리다이렉트
        if (profile && profile.instagram_id) {
          router.push("/mypage");
          return;
        }

        setChecking(false);
      } catch (err) {
        console.error("사용자 확인 오류:", err);
        setError("사용자 정보를 확인하는 중 오류가 발생했습니다.");
        setChecking(false);
      }
    };

    checkUserAndProfile();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 세션 확인
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      // 인스타그램 아이디 저장
      const { error: updateError } = await supabase.from("users").upsert({
        id: session.user.id,
        instagram_id: instagramId.trim(),
        updated_at: new Date().toISOString(),
      });

      if (updateError) throw updateError;

      // 성공 시 마이페이지로 리다이렉트
      router.push("/mypage");
      router.refresh();
    } catch (err) {
      console.error("프로필 저장 오류:", err);
      setError(err.message || "프로필 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">확인 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Creative Crowdfunding
            </h1>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              추가 정보 입력
            </h2>
            <p className="text-gray-600 text-sm">
              서비스를 이용하기 위해 추가 정보를 입력해주세요.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="instagramId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                인스타그램 아이디
              </label>
              <input
                type="text"
                id="instagramId"
                placeholder="@username 또는 username"
                value={instagramId}
                onChange={(e) => setInstagramId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
                disabled={loading}
              />
              <p className="mt-2 text-xs text-gray-500">
                @ 기호는 입력하지 않아도 됩니다.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              {loading ? "저장 중..." : "저장하고 계속하기"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
