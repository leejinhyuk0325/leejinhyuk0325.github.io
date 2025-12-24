"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 로그인 로직 구현
    console.log("로그인 시도:", { email, password, rememberMe });
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
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              이메일로 로그인
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
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                카카오로 로그인
              </button>
              <button
                type="button"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                네이버로 로그인
              </button>
              <button
                type="button"
                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg border-2 border-gray-300"
              >
                구글로 로그인
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
