"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import Link from "next/link";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [isVerified, setIsVerified] = useState(false);
  const [checking, setChecking] = useState(true);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    // 현재 세션 확인
    const checkVerification = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user?.email_confirmed_at) {
          setIsVerified(true);
          // 인증 완료 후 프로필 완성 페이지로 이동
          setTimeout(() => {
            router.push("/complete-profile");
          }, 2000);
        } else {
          setIsVerified(false);
        }
      } catch (error) {
        console.error("인증 확인 오류:", error);
        setIsVerified(false);
      } finally {
        setChecking(false);
      }
    };

    checkVerification();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user?.email_confirmed_at) {
        setIsVerified(true);
        setTimeout(() => {
          router.push("/complete-profile");
        }, 2000);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleResendEmail = async () => {
    if (!email) return;

    setResending(true);
    setResendSuccess(false);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) throw error;

      setResendSuccess(true);
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("이메일 재전송 오류:", error);
      alert("이메일 재전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setResending(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">확인 중...</p>
        </div>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              이메일 인증 완료!
            </h2>
            <p className="text-gray-600 mb-6">
              이메일 인증이 완료되었습니다. 잠시 후 프로필 설정 페이지로 이동합니다.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
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
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              이메일 인증이 필요합니다
            </h2>
            <p className="text-gray-600 text-sm">
              회원가입을 완료하려면 이메일 인증이 필요합니다.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              다음 단계를 따라주세요:
            </h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="font-bold text-blue-600 mr-2">1.</span>
                <span>
                  <strong>{email}</strong>로 전송된 이메일을 확인해주세요.
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-600 mr-2">2.</span>
                <span>이메일 내의 "이메일 인증하기" 버튼을 클릭해주세요.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-600 mr-2">3.</span>
                <span>
                  인증이 완료되면 자동으로 프로필 설정 페이지로 이동합니다.
                </span>
              </li>
            </ol>
          </div>

          {/* Resend Email */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3 text-center">
              이메일을 받지 못하셨나요?
            </p>
            <button
              onClick={handleResendEmail}
              disabled={resending || resendSuccess}
              className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {resending
                ? "전송 중..."
                : resendSuccess
                ? "이메일이 재전송되었습니다!"
                : "인증 이메일 다시 보내기"}
            </button>
          </div>

          {/* Check Status */}
          <div className="mb-6">
            <button
              onClick={async () => {
                setChecking(true);
                const {
                  data: { session },
                } = await supabase.auth.getSession();
                if (session?.user?.email_confirmed_at) {
                  setIsVerified(true);
                  setTimeout(() => {
                    router.push("/complete-profile");
                  }, 2000);
                } else {
                  alert("아직 이메일 인증이 완료되지 않았습니다.");
                }
                setChecking(false);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              인증 상태 확인하기
            </button>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              이미 인증하셨나요?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                로그인하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

