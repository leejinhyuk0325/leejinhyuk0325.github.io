'use client';

import Link from 'next/link';

export default function MyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Creative Crowdfunding
            </Link>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              홈으로
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">마이페이지</h1>
          <p className="text-lg text-gray-600">원하시는 페이지를 선택해주세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 독자 페이지 */}
          <Link
            href="/mypage/reader"
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-8 text-center group"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
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
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">독자 페이지</h2>
            <p className="text-gray-600 mb-4">
              관심있는 작품을 저장하고 관리하세요
            </p>
            <div className="text-sm text-blue-600 font-medium group-hover:text-blue-700">
              독자 페이지로 이동 →
            </div>
          </Link>

          {/* 작가 페이지 */}
          <Link
            href="/mypage/author"
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-8 text-center group"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">작가 페이지</h2>
            <p className="text-gray-600 mb-4">
              작품을 작성하고 관리하세요
            </p>
            <div className="text-sm text-purple-600 font-medium group-hover:text-purple-700">
              작가 페이지로 이동 →
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}

