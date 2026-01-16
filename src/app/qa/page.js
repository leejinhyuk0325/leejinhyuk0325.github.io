"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getQACategories, getQAFaqs, getQAQuestions } from "@/utils/qa";

function QAContent() {
  const searchParams = useSearchParams();
  const category = searchParams?.get("category") || "all";
  
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesData, faqsData, questionsData] = await Promise.all([
          getQACategories(),
          getQAFaqs(4),
          getQAQuestions({ category, limit: 20 }),
        ]);
        setCategories(categoriesData);
        setFaqs(faqsData);
        setQuestions(questionsData);
      } catch (error) {
        console.error("데이터 로드 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">로딩 중...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            {faqs && faqs.length > 0 ? (
              faqs.map((faq) => (
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
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500 py-8">
                등록된 FAQ가 없습니다.
              </div>
            )}
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
              <div className="divide-y divide-gray-200">
                {questions && questions.length > 0 ? (
                  questions.map((question, index) => (
                    <Link
                      key={question.id}
                      href={`/qa/${question.id}`}
                      className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1 text-center">
                          <div className="flex flex-col items-center gap-1">
                            {question.isSolved ? (
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                                해결
                              </span>
                            ) : (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                                대기
                              </span>
                            )}
                            {question.isUrgent && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                긴급
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-span-6">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                              {question.category}
                            </span>
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {question.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500">
                              조회 {question.views}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-2 text-center text-sm text-gray-600">
                          {question.author}
                        </div>
                        <div className="col-span-2 text-center text-sm text-gray-500">
                          {question.date}
                        </div>
                        <div className="col-span-1 text-center">
                          <span className="text-sm font-medium text-blue-600">
                            {question.answers}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center text-gray-500">
                    등록된 질문이 없습니다.
                  </div>
                )}
              </div>

              {/* 페이지네이션 */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    총 {questions?.length || 0}개의 질문
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

export default function QAPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">로딩 중...</p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <QAContent />
    </Suspense>
  );
}

