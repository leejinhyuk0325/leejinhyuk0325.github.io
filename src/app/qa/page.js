"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getQuestions } from "@/utils/qa";

export default function QAPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "all";
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([
    { id: "all", name: "전체", count: 0 },
    { id: "account", name: "계정/로그인", count: 0 },
    { id: "taste", name: "TASTE 신청", count: 0 },
    { id: "payment", name: "결제/환불", count: 0 },
    { id: "content", name: "콘텐츠 관련", count: 0 },
    { id: "technical", name: "기술 지원", count: 0 },
    { id: "other", name: "기타", count: 0 },
  ]);

  const faqs = [
    {
      id: 1,
      question: "TASTE 신청은 어떻게 하나요?",
      answer:
        "원하는 작품의 상세 페이지에서 'TASTE 신청하기' 버튼을 클릭하시면 됩니다. 신청 후 공유 조건을 달성하면 연재가 시작됩니다.",
      category: "TASTE 신청",
      views: 1234,
      helpful: 89,
    },
    {
      id: 2,
      question: "공유는 어떻게 하나요?",
      answer:
        "작품 상세 페이지 하단의 공유 버튼을 클릭하시면 SNS나 링크 공유가 가능합니다. 공유 횟수는 실시간으로 반영됩니다.",
      category: "TASTE 신청",
      views: 987,
      helpful: 76,
    },
    {
      id: 3,
      question: "로그인은 필수인가요?",
      answer:
        "작품을 보는 것은 로그인 없이도 가능하지만, TASTE 신청이나 댓글 작성 등 일부 기능은 로그인이 필요합니다.",
      category: "계정/로그인",
      views: 856,
      helpful: 54,
    },
    {
      id: 4,
      question: "유료 연재는 어떻게 구매하나요?",
      answer:
        "유료 연재 코너의 작품은 결제 후 열람이 가능합니다. 결제는 신용카드, 계좌이체 등 다양한 방법을 지원합니다.",
      category: "결제/환불",
      views: 743,
      helpful: 42,
    },
  ];

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      const result = await getQuestions(category);
      if (result.success) {
        setQuestions(result.data || []);
      }

      // 카테고리별 개수 가져오기
      const categoryCounts = {};
      for (const cat of categories) {
        if (cat.id !== "all") {
          const catResult = await getQuestions(cat.id);
          if (catResult.success) {
            categoryCounts[cat.id] = catResult.count || 0;
          }
        }
      }

      // 전체 개수
      const allResult = await getQuestions("all");
      if (allResult.success) {
        categoryCounts.all = allResult.count || 0;
      }

      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          count: categoryCounts[cat.id] || 0,
        }))
      );

      setLoading(false);
    };

    loadQuestions();
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Q&A</h1>
          <p className="text-gray-600">
            궁금한 점을 질문하고 답변을 받아보세요.
          </p>
        </div>

        {/* 자주 묻는 질문 섹션 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            자주 묻는 질문
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {faq.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>조회 {faq.views}</span>
                    <span>•</span>
                    <span>도움 {faq.helpful}</span>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
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
                      href={`/qa?category=${category.id}`}
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
                  href="/qa/ask"
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  질문하기
                </Link>
              </div>
            </div>
          </aside>

          {/* 메인 컨텐츠 - 질문 목록 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* 질문 목록 헤더 */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                  <div className="col-span-1 text-center">상태</div>
                  <div className="col-span-6">제목</div>
                  <div className="col-span-2 text-center">작성자</div>
                  <div className="col-span-2 text-center">작성일</div>
                  <div className="col-span-1 text-center">답변</div>
                </div>
              </div>

              {/* 질문 목록 */}
              {loading ? (
                <div className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">로딩 중...</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-600">질문이 없습니다.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {questions.map((question) => {
                    const categoryName =
                      categories.find((c) => c.id === question.category)?.name ||
                      question.category;
                    const authorName =
                      question.author?.email?.split("@")[0] || "익명";
                    const date = new Date(question.created_at).toLocaleDateString(
                      "ko-KR"
                    );

                    return (
                      <Link
                        key={question.id}
                        href={`/qa/${question.id}`}
                        className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-1 text-center">
                            <div className="flex flex-col items-center gap-1">
                              {question.is_solved ? (
                                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                                  해결
                                </span>
                              ) : (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                                  대기
                                </span>
                              )}
                              {question.is_urgent && (
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                  긴급
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="col-span-6">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                {categoryName}
                              </span>
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {question.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-500">
                                조회 {question.views || 0}
                              </span>
                            </div>
                          </div>
                          <div className="col-span-2 text-center text-sm text-gray-600">
                            {authorName}
                          </div>
                          <div className="col-span-2 text-center text-sm text-gray-500">
                            {date}
                          </div>
                          <div className="col-span-1 text-center">
                            <span className="text-sm font-medium text-blue-600">
                              {question.answers || 0}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* 페이지네이션 */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    총 {questions.length}개의 질문
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

