"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/utils/supabase";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 이미 로그인한 사용자인지 확인
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          router.push("/mypage");
          return;
        }
      } catch (err) {
        console.error("세션 확인 오류:", err);
      }
    };

    checkSession();

    const errorParam = searchParams.get("error");
    if (errorParam) {
      const errorMessages = {
        auth_failed: "인증에 실패했습니다. 다시 시도해주세요.",
        no_session: "세션이 만료되었습니다. 다시 로그인해주세요.",
        callback_failed: "로그인 처리 중 오류가 발생했습니다.",
      };
      setError(errorMessages[errorParam] || "로그인 중 오류가 발생했습니다.");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // 사용자 생성 시간 확인 (최근 1시간 이내 생성된 사용자만 신규 사용자로 간주)
        const userCreatedAt = new Date(data.user.created_at);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const isNewUser = userCreatedAt > oneHourAgo;

        // 신규 사용자인 경우에만 프로필 확인
        if (isNewUser) {
          const { data: profile, error: profileError } = await supabase
            .from("users")
            .select("instagram_id")
            .eq("id", data.user.id)
            .single();

          if (profileError && profileError.code !== "PGRST116") {
            // PGRST116은 "no rows returned" 에러
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
      }
    } catch (err) {
      // 이메일 확인 오류 처리
      if (err.message && err.message.includes("Email not confirmed")) {
        setError(
          "이메일 인증이 완료되지 않았습니다. 이메일을 확인하여 인증 링크를 클릭해주세요."
        );
      } else {
        setError(err.message || "로그인에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    setError(null);

    // 환경 변수 체크
    if (!isSupabaseConfigured()) {
      setError(
        "Supabase 환경 변수가 설정되지 않았습니다. GitHub Secrets를 확인하고 다시 배포해주세요."
      );
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err.message || "깃허브 로그인에 실패했습니다.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    // 환경 변수 체크
    if (!isSupabaseConfigured()) {
      setError(
        "Supabase 환경 변수가 설정되지 않았습니다. GitHub Secrets를 확인하고 다시 배포해주세요."
      );
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err.message || "구글 로그인에 실패했습니다.");
      setLoading(false);
    }
  };

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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인</h2>
            <p className="text-gray-600 text-sm">
              CCW 계정으로 로그인하고 펀딩을 시작해 보세요.
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
            <div className="space-y-4">
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
                disabled={loading}
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
                disabled={loading}
              />
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-600">로그인 상태 유지</span>
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  이메일 찾기
                </button>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  비밀번호 재설정
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              {loading ? "로그인 중..." : "이메일로 로그인"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">간편 로그인</p>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg border-2 border-gray-300 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {loading ? "연결 중..." : "구글로 로그인"}
              </button>
              <button
                type="button"
                onClick={handleGithubLogin}
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                {loading ? "연결 중..." : "깃허브로 로그인"}
              </button>
            </div>
          </div>

          {/* Signup Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              아직 CCF 계정이 없나요?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
