'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  deadline: string;
  apply: string;
  meta: string;
  tags: string[];
  intro: string;
  requirement: string;
  createdAt: string;
}

export default function AuthorMyPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    deadline: '',
    apply: '신청',
    meta: '0 / 30',
    tags: '',
    intro: '',
    requirement: '',
  });

  useEffect(() => {
    // 로컬 스토리지에서 작성한 글 불러오기
    const saved = localStorage.getItem('authorPosts');
    if (saved) {
      setPosts(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPost: Post = {
      id: Date.now().toString(),
      title: formData.title,
      deadline: formData.deadline,
      apply: formData.apply,
      meta: formData.meta,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      intro: formData.intro,
      requirement: formData.requirement,
      createdAt: new Date().toISOString(),
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('authorPosts', JSON.stringify(updated));
    
    // 폼 초기화
    setFormData({
      title: '',
      deadline: '',
      apply: '신청',
      meta: '0 / 30',
      tags: '',
      intro: '',
      requirement: '',
    });
    setShowForm(false);
    
    // 작성한 글 상세 페이지로 이동
    router.push(`/detail/${newPost.id}`);
  };

  const deletePost = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const updated = posts.filter(post => post.id !== id);
      setPosts(updated);
      localStorage.setItem('authorPosts', JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Creative Crowdfunding
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/mypage/reader"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                독자 페이지
              </Link>
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">작가 마이페이지</h1>
            <p className="text-gray-600">작품을 작성하고 관리하세요</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {showForm ? '작성 취소' : '+ 새 작품 작성'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">새 작품 작성</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="작품 제목을 입력하세요"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    마감일 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 9일 남음"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    신청 현황
                  </label>
                  <input
                    type="text"
                    value={formData.meta}
                    onChange={(e) => setFormData({ ...formData, meta: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 0 / 30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  태그 (쉼표로 구분) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: #판타지, #로맨스, #액션"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  연재 시작 조건 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.requirement}
                  onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 25공유"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  도입부 *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.intro}
                  onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="작품의 도입부를 작성하세요"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  작성하기
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">내가 작성한 작품</h2>
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">작성한 작품이 없습니다</h3>
              <p className="mt-2 text-sm text-gray-500">
                위의 "새 작품 작성" 버튼을 눌러 작품을 작성해보세요
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-red-600">{post.deadline}</span>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="삭제"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                  <Link href={`/detail/${post.id}`} className="block">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {post.apply}
                      </span>
                      <span className="text-xs text-gray-500">{post.meta}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h3>
                  </Link>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    작성일: {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

