import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function CommunityPage() {
  const categories = [
    { id: "all", name: "전체", count: 128 },
    { id: "free", name: "자유게시판", count: 45 },
    { id: "review", name: "작품 리뷰", count: 32 },
    { id: "recommend", name: "작품 추천", count: 28 },
    { id: "question", name: "질문하기", count: 23 },
  ];

  const posts = [
    {
      id: 1,
      category: "자유게시판",
      title: "너의 췌장을 먹고싶어 정말 재밌네요!",
      author: "독서왕",
      date: "2024-01-15",
      views: 234,
      likes: 18,
      comments: 5,
      isHot: true,
    },
    {
      id: 2,
      category: "작품 리뷰",
      title: "부드러운 밤 후기 - 요리 소설의 새로운 지평",
      author: "요리사",
      date: "2024-01-14",
      views: 189,
      likes: 25,
      comments: 8,
      isHot: false,
    },
    {
      id: 3,
      category: "작품 추천",
      title: "판타지 좋아하시는 분들 꼭 보세요! 아침엔 새, 밤엔 나무",
      author: "판타지러버",
      date: "2024-01-13",
      views: 312,
      likes: 42,
      comments: 12,
      isHot: true,
    },
    {
      id: 4,
      category: "질문하기",
      title: "TASTE 신청은 어떻게 하나요?",
      author: "초보자",
      date: "2024-01-12",
      views: 156,
      likes: 8,
      comments: 3,
      isHot: false,
    },
    {
      id: 5,
      category: "자유게시판",
      title: "좀비 소설 추천 받습니다!",
      author: "좀비매니아",
      date: "2024-01-11",
      views: 278,
      likes: 31,
      comments: 15,
      isHot: true,
    },
    {
      id: 6,
      category: "작품 리뷰",
      title: "사마귀 인간 - 독특한 컨셉의 스릴러",
      author: "리뷰어",
      date: "2024-01-10",
      views: 201,
      likes: 19,
      comments: 6,
      isHot: false,
    },
    {
      id: 7,
      category: "작품 추천",
      title: "경영 소설 좋아하시는 분들 추천드려요",
      author: "비즈니스맨",
      date: "2024-01-09",
      views: 167,
      likes: 14,
      comments: 4,
      isHot: false,
    },
    {
      id: 8,
      category: "질문하기",
      title: "공유는 어떻게 하나요?",
      author: "궁금이",
      date: "2024-01-08",
      views: 145,
      likes: 7,
      comments: 2,
      isHot: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">커뮤니티</h1>
          <p className="text-gray-600">
            작품에 대한 이야기를 나누고 소통하는 공간입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 - 카테고리 */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                카테고리
              </h2>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/community?category=${category.id}`}
                      className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 transition-colors group"
                    >
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {category.name}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                        {category.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="/community/write"
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  글쓰기
                </Link>
              </div>
            </div>
          </aside>

          {/* 메인 컨텐츠 - 게시글 목록 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* 게시글 목록 헤더 */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                  <div className="col-span-1 text-center">번호</div>
                  <div className="col-span-5">제목</div>
                  <div className="col-span-2 text-center">작성자</div>
                  <div className="col-span-2 text-center">작성일</div>
                  <div className="col-span-2 text-center">조회수</div>
                </div>
              </div>

              {/* 게시글 목록 */}
              <div className="divide-y divide-gray-200">
                {posts.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/community/${post.id}`}
                    className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1 text-center text-sm text-gray-500">
                        {posts.length - index}
                      </div>
                      <div className="col-span-5">
                        <div className="flex items-center gap-2">
                          {post.isHot && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                              HOT
                            </span>
                          )}
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {post.category}
                          </span>
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {post.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500">
                            좋아요 {post.likes}
                          </span>
                          <span className="text-xs text-gray-500">
                            댓글 {post.comments}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-2 text-center text-sm text-gray-600">
                        {post.author}
                      </div>
                      <div className="col-span-2 text-center text-sm text-gray-500">
                        {post.date}
                      </div>
                      <div className="col-span-2 text-center text-sm text-gray-500">
                        {post.views}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* 페이지네이션 */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    총 {posts.length}개의 게시글
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors">
                      이전
                    </button>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
                      1
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors">
                      2
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors">
                      3
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors">
                      다음
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 검색 바 */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-2">
                <select className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>제목</option>
                  <option>내용</option>
                  <option>작성자</option>
                  <option>제목+내용</option>
                </select>
                <input
                  type="text"
                  placeholder="검색어를 입력하세요..."
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                  검색
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

