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
          const user = data.session.user;
          
          // 이메일 인증이 방금 완료된 신규 사용자인지 확인
          const userCreatedAt = new Date(user.created_at);
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
          const isNewUser = userCreatedAt > oneHourAgo;
          const isEmailJustConfirmed = user.email_confirmed_at && 
            new Date(user.email_confirmed_at) > new Date(Date.now() - 5 * 60 * 1000); // 5분 이내

          // 신규 사용자이고 이메일이 방금 인증된 경우 프로필 완성 페이지로
          if (isNewUser && isEmailJustConfirmed) {
            const { data: profile, error: profileError } = await supabase
              .from("users")
              .select("instagram_id")
              .eq("id", user.id)
              .single();

            if (profileError && profileError.code !== "PGRST116") {
              console.error("프로필 확인 오류:", profileError);
            }

            // 인스타그램 아이디가 없으면 추가 정보 입력 페이지로 리다이렉트
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
