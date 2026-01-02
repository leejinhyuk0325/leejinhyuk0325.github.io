import { createClient } from "@supabase/supabase-js";

// 환경 변수 가져오기 (빌드 타임에 번들에 포함됨)
// Next.js는 NEXT_PUBLIC_ 접두사가 있는 환경 변수를 빌드 타임에 번들에 포함시킴
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 빌드 타임에 환경 변수가 없어도 에러가 나지 않도록 안전한 기본값 사용
// 하지만 실제 사용 시에는 환경 변수가 필요함
const getSupabaseClient = () => {
  // 환경 변수가 없거나 placeholder인 경우
  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl === "https://placeholder.supabase.co" ||
    supabaseUrl.includes("placeholder") ||
    supabaseUrl.trim() === ""
  ) {
    // 빌드 타임에는 에러를 던지지 않고 placeholder 클라이언트 반환
    // 런타임에 실제로 사용할 때는 에러가 발생할 것
    if (typeof window !== "undefined") {
      console.error(
        "❌ Supabase 환경 변수가 설정되지 않았습니다. GitHub Secrets를 확인하고 재배포해주세요."
      );
      console.error("현재 URL:", supabaseUrl || "undefined");
    }
    return createClient(
      "https://placeholder.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder"
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

// 클라이언트 생성 (빌드 타임에도 안전)
export const supabase = getSupabaseClient();

// 환경 변수 검증 함수
export const isSupabaseConfigured = () => {
  return (
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://placeholder.supabase.co" &&
    !supabaseUrl.includes("placeholder") &&
    supabaseUrl.trim() !== "" &&
    supabaseAnonKey.trim() !== ""
  );
};
