import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function NoticePage() {
  const notices = [
    {
      id: 1,
      title: "[공지] 시스템 점검 안내 (2024-01-20)",
      category: "시스템",
      date: "2024-01-15",
      views: 1234,
      isImportant: true,
      content:
        "더 나은 서비스 제공을 위해 2024년 1월 20일 오전 2시부터 오전 6시까지 시스템 점검이 진행됩니다.\n\n점검 시간 동안 서비스 이용이 제한될 수 있으니 양해 부탁드립니다.",
    },
    {
      id: 2,
      title: "[이벤트] 신규 작품 등록 이벤트 진행",
      category: "이벤트",
      date: "2024-01-14",
      views: 987,
      isImportant: false,
      content:
        "신규 작품을 등록하시는 모든 작가분들께 특별 혜택을 드립니다!\n\n- 등록 작품 1개당 포인트 1000P 지급\n- 인기 작품 선정 시 추가 보너스 지급\n- 이벤트 기간: 2024년 1월 15일 ~ 1월 31일",
    },
    {
      id: 3,
      title: "[업데이트] 검색 기능 개선 안내",
      category: "업데이트",
      date: "2024-01-12",
      views: 856,
      isImportant: false,
      content:
        "검색 기능이 개선되었습니다.\n\n- 태그 검색 기능 추가\n- 검색 결과 정확도 향상\n- 검색 전용 페이지 신설\n\n더욱 편리하게 원하는 작품을 찾아보세요!",
    },
    {
      id: 4,
      title: "[공지] 커뮤니티 이용 규칙 안내",
      category: "공지",
      date: "2024-01-10",
      views: 743,
      isImportant: true,
      content:
        "모든 사용자가 쾌적한 커뮤니티를 이용할 수 있도록 다음 사항을 준수해주세요.\n\n- 타인에 대한 비방 및 욕설 금지\n- 스팸 및 광고성 게시글 금지\n- 저작권 침해 게시글 금지\n\n위 규칙을 위반할 경우 게시글이 삭제되거나 계정이 제재될 수 있습니다.",
    },
    {
      id: 5,
      title: "[이벤트] 추천 작품 리뷰 이벤트",
      category: "이벤트",
      date: "2024-01-08",
      views: 678,
      isImportant: false,
      content:
        "작품을 읽고 리뷰를 작성하시면 추첨을 통해 소정의 상품을 드립니다!\n\n- 리뷰 작성 시 자동 응모\n- 매주 10명 추첨\n- 상품: 문화상품권 1만원권",
    },
    {
      id: 6,
      title: "[업데이트] 모바일 앱 출시 안내",
      category: "업데이트",
      date: "2024-01-05",
      views: 1456,
      isImportant: true,
      content:
        "Creative Crowdfunding 모바일 앱이 출시되었습니다!\n\n- iOS 및 Android 지원\n- 오프라인 읽기 기능\n- 푸시 알림 기능\n\n앱스토어에서 'Creative Crowdfunding'을 검색하여 다운로드 받으세요.",
    },
    {
      id: 7,
      title: "[공지] 결제 시스템 개선 안내",
      category: "시스템",
      date: "2024-01-03",
      views: 567,
      isImportant: false,
      content:
        "결제 시스템이 개선되어 더욱 안전하고 편리하게 이용하실 수 있습니다.\n\n- 다양한 결제 수단 추가 (카카오페이, 네이버페이)\n- 결제 보안 강화\n- 환불 처리 시간 단축",
    },
    {
      id: 8,
      title: "[이벤트] 신규 회원 가입 이벤트",
      category: "이벤트",
      date: "2024-01-01",
      views: 2345,
      isImportant: false,
      content:
        "신규 회원 가입 시 특별 혜택을 드립니다!\n\n- 가입 즉시 포인트 5000P 지급\n- 첫 작품 신청 시 추가 포인트 2000P\n- 이벤트 기간: 2024년 1월 1일 ~ 1월 31일",
    },
  ];

  const categories = [
    { id: "all", name: "전체", count: notices.length },
    { id: "notice", name: "공지", count: notices.filter((n) => n.category === "공지").length },
    { id: "event", name: "이벤트", count: notices.filter((n) => n.category === "이벤트").length },
    { id: "update", name: "업데이트", count: notices.filter((n) => n.category === "업데이트").length },
    { id: "system", name: "시스템", count: notices.filter((n) => n.category === "시스템").length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">공지사항</h1>
          <p className="text-gray-600">
            Creative Crowdfunding의 주요 공지사항과 업데이트 소식을 확인하세요.
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
                      href={`/notice?category=${category.id}`}
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
            </div>
          </aside>

          {/* 메인 컨텐츠 - 공지사항 목록 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* 공지사항 목록 헤더 */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                  <div className="col-span-1 text-center">중요</div>
                  <div className="col-span-6">제목</div>
                  <div className="col-span-2 text-center">카테고리</div>
                  <div className="col-span-2 text-center">작성일</div>
                  <div className="col-span-1 text-center">조회</div>
                </div>
              </div>

              {/* 공지사항 목록 */}
              <div className="divide-y divide-gray-200">
                {notices.map((notice) => (
                  <Link
                    key={notice.id}
                    href={`/notice/${notice.id}`}
                    className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1 text-center">
                        {notice.isImportant && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                            중요
                          </span>
                        )}
                      </div>
                      <div className="col-span-6">
                        <span className="text-sm font-medium text-gray-900">
                          {notice.title}
                        </span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {notice.category}
                        </span>
                      </div>
                      <div className="col-span-2 text-center text-sm text-gray-500">
                        {notice.date}
                      </div>
                      <div className="col-span-1 text-center text-sm text-gray-500">
                        {notice.views}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* 페이지네이션 */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    총 {notices.length}개의 공지사항
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

