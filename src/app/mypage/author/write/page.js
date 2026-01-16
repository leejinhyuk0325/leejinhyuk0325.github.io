"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { createSerial } from "@/utils/serials";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AuthorWritePage() {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("30");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("popular");
  const [intro, setIntro] = useState("");
  const [requirement, setRequirement] = useState("30");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  // 작가는 마이페이지에서 연재도전 카테고리만 작성 가능
  const categories = [{ id: "popular", name: "연재도전" }];

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

      // 태그 리스트 생성
      const tagList = tags
        .split(" ")
        .map((tag) => tag.trim())
        .filter((tag) => tag && tag.startsWith("#"));

      // deadline을 숫자로 변환
      const deadlineDays = parseInt(deadline.trim()) || 30;
      if (isNaN(deadlineDays) || deadlineDays < 0) {
        setError("마감일은 0 이상의 숫자여야 합니다.");
        setLoading(false);
        return;
      }

      // 게시글 데이터 준비
      const postData = {
        title: title.trim(),
        deadline: deadlineDays,
        apply: "신청",
        tags: tags.trim() || "#작품",
        category: category,
        intro: intro.trim(),
        requirement: parseInt(requirement.trim()) || 30,
        tagList: tagList.length > 0 ? tagList : ["#작품"],
      };

      // 유효성 검사
      if (!postData.title) {
        setError("제목을 입력해주세요.");
        setLoading(false);
        return;
      }

      if (!postData.intro) {
        setError("소개글을 입력해주세요.");
        setLoading(false);
        return;
      }

      // Supabase에 연재 저장
      const newSerial = await createSerial(postData);

      if (newSerial) {
        // 성공 시 작가 페이지로 이동
        router.push("/mypage/author");
      } else {
        setError("작품 작성에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      console.error("작품 작성 오류:", err);
      setError(
        err.message || "작품 작성에 실패했습니다. 다시 시도해주세요."
      );
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">작품 작성</h1>

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
                카테고리 (마이페이지에서는 연재도전만 작성 가능)
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
                placeholder="작품 제목을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  마감일 (일수)
                </label>
                <input
                  type="number"
                  id="deadline"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="예: 30"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={loading}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  작성일로부터 마감까지의 일수를 입력하세요 (0일 = 오늘 마감)
                </p>
              </div>

              <div>
                <label
                  htmlFor="requirement"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  공유 조건
                </label>
                <input
                  type="number"
                  id="requirement"
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="예: 30"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={loading}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  필요한 공유 개수를 숫자로 입력하세요
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                태그 (공백으로 구분, #으로 시작)
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="예: #판타지 #로맨스 #액션"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                태그는 공백으로 구분하며, #으로 시작해야 합니다.
              </p>
            </div>

            <div>
              <label
                htmlFor="intro"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                소개글
              </label>
              <textarea
                id="intro"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="작품 소개글을 입력하세요"
                rows={10}
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
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
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
