"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPostByPostId } from "@/utils/posts";
import { getSerialById } from "@/utils/serials";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function PostDetailContentWrapper() {
  const params = useParams();
  const router = useRouter();
  const serialId = params?.id;
  const postId = params?.postId;
  const [post, setPost] = useState(null);
  const [serial, setSerial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) {
        setError("글 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const postData = await getPostByPostId(parseInt(postId));
        if (postData) {
          setPost(postData);
          
          // 연재 정보도 가져오기
          if (serialId) {
            const serialData = await getSerialById(parseInt(serialId));
            if (serialData) {
              setSerial(serialData);
            }
          }
        } else {
          setError("글을 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("글 로드 오류:", err);
        setError("글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId, serialId]);

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
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">
              {error || "요청하신 글을 찾을 수 없습니다."}
            </p>
            {serialId && (
              <Link
                href={`/detail/${serialId}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                연재 페이지로 돌아가기
              </Link>
            )}
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
        {/* 연재 정보 및 뒤로가기 */}
        {serial && (
          <div className="mb-6">
            <Link
              href={`/detail/${serialId}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {serial.title}으로 돌아가기
            </Link>
          </div>
        )}

        {/* 글 내용 */}
        <article className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <time>
                {new Date(post.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </header>

          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {post.content}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
