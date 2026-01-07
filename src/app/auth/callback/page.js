"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("인증 오류:", error);
          router.push("/login?error=auth_failed");
          return;
        }

        if (data.session) {
          // 사용자 생성 시간 확인 (최근 1시간 이내 생성된 사용자만 신규 사용자로 간주)
          const userCreatedAt = new Date(data.session.user.created_at);
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
          const isNewUser = userCreatedAt > oneHourAgo;

          // 신규 사용자인 경우에만 프로필 확인
          if (isNewUser) {
            const { data: profile, error: profileError } = await supabase
              .from("users")
              .select("instagram_id")
              .eq("id", data.session.user.id)
              .single();

            if (profileError && profileError.code !== "PGRST116") {
              // PGRST116은 "no rows returned" 에러 (프로필이 없는 경우)
              console.error("프로필 확인 오류:", profileError);
            }

            // 신규 사용자이고 인스타그램 아이디가 없으면 추가 정보 입력 페이지로 리다이렉트
            if (!profile || !profile.instagram_id) {
              router.push("/complete-profile");
              return;
            }
          }

          // 기존 사용자이거나 프로필이 완성된 경우 마이페이지로 리다이렉트
          router.push("/mypage");
          router.refresh();
        } else {
          // 세션이 없음
          router.push("/login?error=no_session");
        }
      } catch (err) {
        console.error("콜백 처리 오류:", err);
        router.push("/login?error=callback_failed");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}
