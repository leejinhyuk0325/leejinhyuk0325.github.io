"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [userType, setUserType] = useState(null); // null, "author", "reader"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    penName: "", // 작가용
    introduction: "", // 작가용
  });
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgreementChange = (name) => {
    setAgreements((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!agreements.terms || !agreements.privacy) {
      alert("필수 약관에 동의해주세요.");
      return;
    }

    if (userType === "author" && !formData.penName) {
      alert("필명을 입력해주세요.");
      return;
    }

    // 회원가입 로직 구현
    console.log("회원가입 시도:", { userType, formData, agreements });
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">회원가입</h2>
            <p className="text-gray-600 text-sm">
              CCF 계정을 만들고 펀딩을 시작해 보세요.
            </p>
          </div>

          {/* User Type Selection */}
          {!userType && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                회원 유형을 선택해주세요
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setUserType("author")}
                  className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="text-4xl mb-3">✍️</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                    작가 회원가입
                  </h4>
                  <p className="text-sm text-gray-600">
                    작품을 등록하고 연재를 시작하세요. 작가 전용 기능을 이용할
                    수 있습니다.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("reader")}
                  className="p-6 border-2 border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
                >
                  <div className="text-4xl mb-3">📖</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600">
                    독자 회원가입
                  </h4>
                  <p className="text-sm text-gray-600">
                    작품을 읽고 TASTE 신청을 하세요. 독자 전용 기능을 이용할 수
                    있습니다.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          {userType && (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => {
                  setUserType(null);
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    penName: "",
                    introduction: "",
                  });
                }}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                ← 회원 유형 다시 선택
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="이름"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
              {userType === "author" && (
                <input
                  type="text"
                  name="penName"
                  placeholder="필명 (작가 활동명)"
                  value={formData.penName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="이메일"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="비밀번호 확인"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
              {userType === "author" && (
                <textarea
                  name="introduction"
                  placeholder="작가 소개 (선택사항)"
                  value={formData.introduction}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
              )}
            </div>

            {/* Agreements */}
            <div className="space-y-3">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.terms}
                  onChange={() => handleAgreementChange("terms")}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <span className="ml-2 text-sm text-gray-700">
                  <span className="text-red-500">[필수]</span> 이용약관에
                  동의합니다
                </span>
              </label>
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.privacy}
                  onChange={() => handleAgreementChange("privacy")}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <span className="ml-2 text-sm text-gray-700">
                  <span className="text-red-500">[필수]</span> 개인정보
                  처리방침에 동의합니다
                </span>
              </label>
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.marketing}
                  onChange={() => handleAgreementChange("marketing")}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <span className="ml-2 text-sm text-gray-700">
                  <span className="text-gray-400">[선택]</span> 마케팅 정보
                  수신에 동의합니다
                </span>
              </label>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg ${
                userType === "author"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {userType === "author" ? "작가 회원가입" : "독자 회원가입"}
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

          {/* Social Signup */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">간편 가입</p>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                카카오로 가입
              </button>
              <button
                type="button"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                네이버로 가입
              </button>
              <button
                type="button"
                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg border-2 border-gray-300"
              >
                구글로 가입
              </button>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              이미 CCF 계정이 있나요?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
