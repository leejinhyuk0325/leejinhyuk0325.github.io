"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCommunityPostById } from "@/utils/community";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function CommunityPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) {
        setError("게시글 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const postData = await getCommunityPostById(id);
        if (postData) {
          setPost(postData);
        } else {
          setError("게시글을 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("게시글 로드 오류:", err);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-gray-600 mb-6">
              {error || "게시글을 찾을 수 없습니다."}
            </p>
            <Link
              href="/community"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              커뮤니티 목록으로
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Link
            href="/community"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← 커뮤니티 목록으로
          </Link>
        </div>

        {/* 게시글 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            {post.isHot && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                HOT
              </span>
            )}
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {post.category}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 border-b border-gray-200 pb-4">
            <span>작성자: {post.author}</span>
            <span>작성일: {post.date}</span>
            <span>조회수: {post.views}</span>
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <span>좋아요 {post.likes}</span>
            <span>댓글 {post.comments}</span>
          </div>
        </div>

        {/* 게시글 내용 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-800">
              {post.content || "내용이 없습니다."}
            </div>
          </div>
        </div>

        {/* 댓글 영역 (향후 구현) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            댓글 ({post.comments})
          </h2>
          <div className="text-center py-8 text-gray-500">
            <p>댓글 기능은 곧 추가될 예정입니다.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
