import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function GuidePage() {
  const guides = [
    {
      id: 1,
      title: "TASTE 신청 방법",
      icon: "📝",
      steps: [
        "원하는 작품의 상세 페이지로 이동합니다",
        "'TASTE 신청하기' 버튼을 클릭합니다",
        "공유 조건을 확인하고 공유를 진행합니다",
        "공유 조건을 달성하면 연재가 시작됩니다",
      ],
    },
    {
      id: 2,
      title: "공유 방법",
      icon: "🔗",
      steps: [
        "작품 상세 페이지 하단의 공유 버튼을 클릭합니다",
        "원하는 SNS 플랫폼을 선택합니다 (카카오톡, 페이스북, 트위터 등)",
        "또는 링크를 복사하여 공유할 수 있습니다",
        "공유 횟수는 실시간으로 반영됩니다",
      ],
    },
    {
      id: 3,
      title: "검색 기능 사용법",
      icon: "🔍",
      steps: [
        "상단 메뉴의 '검색' 버튼을 클릭합니다",
        "검색어를 입력합니다 (제목, 태그, 내용 검색 가능)",
        "태그를 클릭하면 해당 태그의 모든 작품을 볼 수 있습니다",
        "검색 결과에서 원하는 작품을 선택합니다",
      ],
    },
    {
      id: 4,
      title: "커뮤니티 이용 방법",
      icon: "💬",
      steps: [
        "커뮤니티 페이지에서 카테고리를 선택합니다",
        "게시글을 읽거나 '글쓰기' 버튼을 클릭합니다",
        "제목과 내용을 작성하고 게시합니다",
        "다른 사용자들과 소통할 수 있습니다",
      ],
    },
    {
      id: 5,
      title: "Q&A 이용 방법",
      icon: "❓",
      steps: [
        "Q&A 페이지에서 자주 묻는 질문을 확인합니다",
        "질문하기 버튼을 클릭하여 새 질문을 작성합니다",
        "카테고리를 선택하고 질문을 등록합니다",
        "다른 사용자나 관리자의 답변을 확인할 수 있습니다",
      ],
    },
    {
      id: 6,
      title: "유료 연재 구매 방법",
      icon: "💳",
      steps: [
        "유료연재코너의 작품을 선택합니다",
        "상세 페이지에서 결제 버튼을 클릭합니다",
        "결제 수단을 선택합니다 (신용카드, 계좌이체 등)",
        "결제 완료 후 작품을 열람할 수 있습니다",
      ],
    },
  ];

  const faqs = [
    {
      question: "TASTE 신청은 무료인가요?",
      answer: "네, TASTE 신청은 완전 무료입니다. 다만 공유 조건을 달성해야 연재가 시작됩니다.",
    },
    {
      question: "공유 조건을 달성하지 못하면 어떻게 되나요?",
      answer: "공유 조건을 달성하지 못하면 연재가 시작되지 않습니다. 마감일까지 조건을 달성해주세요.",
    },
    {
      question: "유료 연재는 환불이 가능한가요?",
      answer: "결제 후 7일 이내, 3화 미만 열람 시 환불이 가능합니다. 고객센터로 문의해주세요.",
    },
    {
      question: "작품을 추천하고 싶어요",
      answer: "커뮤니티의 '작품 추천' 카테고리에 글을 작성하시면 됩니다.",
    },
    {
      question: "태그는 어떻게 사용하나요?",
      answer: "작품의 태그를 클릭하면 해당 태그가 포함된 모든 작품을 한 번에 볼 수 있습니다.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">이용 가이드</h1>
          <p className="text-gray-600">
            Creative Crowdfunding을 처음 이용하시는 분들을 위한 안내입니다.
          </p>
        </div>

        {/* 주요 기능 가이드 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            주요 기능 안내
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{guide.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {guide.title}
                  </h3>
                </div>
                <ol className="space-y-2">
                  {guide.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* 자주 묻는 질문 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Q. {faq.question}
                </h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 문의하기 */}
        <section className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            추가 도움이 필요하신가요?
          </h2>
          <p className="text-gray-700 mb-4">
            더 궁금한 점이 있으시다면 Q&A 페이지에서 질문해주세요.
          </p>
          <a
            href="/qa"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Q&A로 이동하기
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}

