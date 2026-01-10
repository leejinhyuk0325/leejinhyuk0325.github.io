"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { getQuestionById, createAnswer } from "@/utils/qa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function QADetailPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = params.id;
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answerContent, setAnswerContent] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [user, setUser] = useState(null);

  const categoryNames = {
    account: "계정/로그인",
    taste: "TASTE 신청",
    payment: "결제/환불",
    content: "콘텐츠 관련",
    technical: "기술 지원",
    other: "기타",
  };

  useEffect(() => {
    const loadQuestion = async () => {
      if (!questionId) return;

      setLoading(true);
      const result = await getQuestionById(questionId);

      if (result.success) {
        setQuestion(result.data);
      } else {
        setError(result.error || "질문을 불러올 수 없습니다.");
      }

      setLoading(false);
    };

    loadQuestion();

    // 사용자 세션 확인
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    checkUser();
  }, [questionId]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!user) {
      router.push("/login");
      return;
    }

    if (!answerContent.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    setSubmittingAnswer(true);

    try {
      const result = await createAnswer(questionId, answerContent, user.id);

      if (result.success) {
        setAnswerContent("");
        // 질문 다시 로드
        const questionResult = await getQuestionById(questionId);
        if (questionResult.success) {
          setQuestion(questionResult.data);
        }
      } else {
        alert(result.error || "답변 작성에 실패했습니다.");
      }
    } catch (err) {
      console.error("답변 작성 오류:", err);
      alert("답변 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-red-600">{error || "질문을 찾을 수 없습니다."}</p>
            <Link
              href="/qa"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Q&A 목록으로 돌아가기
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const authorName = question.author?.email?.split("@")[0] || "익명";
  const date = new Date(question.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 질문 */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {categoryNames[question.category] || question.category}
              </span>
              {question.is_solved && (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                  해결됨
                </span>
              )}
              {question.is_urgent && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                  긴급
                </span>
              )}
            </div>
            <Link
              href="/qa"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← 목록으로
            </Link>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {question.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span>{authorName}</span>
            <span>•</span>
            <span>{date}</span>
            <span>•</span>
            <span>조회 {question.views || 0}</span>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {question.content}
            </p>
          </div>
        </div>

        {/* 답변 목록 */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            답변 {question.answers?.length || 0}
          </h2>

          {question.answers && question.answers.length > 0 ? (
            <div className="space-y-6">
              {question.answers.map((answer) => {
                const answerAuthorName =
                  answer.author?.email?.split("@")[0] || "익명";
                const answerDate = new Date(
                  answer.created_at
                ).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

                return (
                  <div
                    key={answer.id}
                    className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-gray-900">
                        {answerAuthorName}
                      </span>
                      <span className="text-xs text-gray-500">{answerDate}</span>
                      {answer.is_accepted && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                          채택됨
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {answer.content}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              아직 답변이 없습니다. 첫 답변을 작성해보세요!
            </p>
          )}
        </div>

        {/* 답변 작성 */}
        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">답변 작성</h2>
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <textarea
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="답변을 입력하세요"
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                required
                disabled={submittingAnswer}
              />
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={submittingAnswer}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {submittingAnswer ? "작성 중..." : "답변 작성"}
                </button>
              </div>
            </form>
          </div>
        )}

        {!user && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">답변을 작성하려면 로그인이 필요합니다.</p>
            <Link
              href="/login"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              로그인하기
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
