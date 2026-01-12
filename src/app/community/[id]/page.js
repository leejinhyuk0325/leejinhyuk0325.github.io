import { getCommunityPostById } from "@/utils/community";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default async function CommunityPostPage({ params }) {
  const { id } = await params;
  const post = await getCommunityPostById(id);

  if (!post) {
    notFound();
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
