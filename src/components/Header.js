"use client";

import Link from "next/link";

export default function Header() {
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
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              로그인
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
