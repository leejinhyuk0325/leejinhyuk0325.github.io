"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CommunityWritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("free");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  const categories = [
    { id: "free", name: "자유게시판" },
    { id: "review", name: "작품 리뷰" },
    { id: "recommend", name: "작품 추천" },
    { id: "question", name: "질문하기" },
  ];

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login");
          return;
        }

        setChecking(false);
      } catch (err) {
        console.error("사용자 확인 오류:", err);
        setError("사용자 정보를 확인하는 중 오류가 발생했습니다.");
        setChecking(false);
      }
    };

    checkUser();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      // TODO: 실제 데이터베이스에 저장하는 로직 구현 필요
      // 현재는 임시로 alert만 표시
      alert("글이 작성되었습니다! (데이터베이스 연동 필요)");
      router.push("/community");
    } catch (err) {
      console.error("글 작성 오류:", err);
      setError(err.message || "글 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">확인 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">글 작성</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                카테고리
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
                disabled={loading}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                제목
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                내용
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                rows={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {loading ? "작성 중..." : "작성하기"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
