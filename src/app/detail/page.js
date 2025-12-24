import Link from "next/link";

export default function DetailPage() {
  const tags = ["#이세계", "#성장물", "#서사물", "#헌터물", "#현대판타지"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Creative Crowdfunding
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                캠페인
              </button>
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                스토리
              </button>
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                맛집 보기
              </button>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900 p-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Campaign Info Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                누렁이가 너무 강함
              </h1>
            </div>
            <div className="flex items-center space-x-4 bg-blue-50 rounded-lg p-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  연재 시작 조건
                </p>
                <p className="text-lg font-bold text-blue-600">30공유</p>
              </div>
            </div>
          </div>
        </section>

        {/* Provide Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">도입부</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              누렁이가 우는 소리를 들어봤소?
            </p>
            <div className="text-center text-2xl text-yellow-400">★</div>
          </div>
        </section>

        {/* Notice Section */}
        <section className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            참여 전 필수 확인사항
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                재밌으셨다면 <strong className="font-semibold">공유</strong>{" "}
                해주세요.
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                여러분의 관심이 작가에게{" "}
                <strong className="font-semibold">큰 힘</strong>이 됩니다.
              </span>
            </li>
          </ul>
        </section>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Apply Button */}
        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] text-lg">
          TASTE 신청하기
        </button>
      </main>
    </div>
  );
}

