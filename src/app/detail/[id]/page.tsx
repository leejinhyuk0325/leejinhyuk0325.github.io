'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface PostData {
  id: string;
  title: string;
  deadline: string;
  apply: string;
  meta: string;
  tags: string[];
  intro: string;
  requirement: string;
}

// 기존 작품 데이터 (예시)
const defaultPosts: Record<string, PostData> = {
  '1': {
    id: '1',
    title: '너의 췌장을 먹고싶어',
    deadline: '25일 남음',
    apply: '신청',
    meta: '3 / 30',
    tags: ['#좀비', '#스릴러', '#로맨틱호러'],
    intro: '좀비 아포칼립스 세계에서 펼쳐지는 로맨틱 호러 스토리.\n\n세상이 끝나가는 순간, 그들은 서로를 찾았습니다. 좀비 무리 속에서도 사랑은 살아남을 수 있을까요? 생존과 사랑 사이의 갈등을 그린 작품입니다.',
    requirement: '30공유',
  },
  '2': {
    id: '2',
    title: '부드러운 밤',
    deadline: '8일 남음',
    apply: '신청',
    meta: '110 / 30',
    tags: ['#요리', '#쉐프', '#드라마'],
    intro: '미슐랭 스타 쉐프의 성장 스토리.\n\n한 그릇의 요리에는 한 사람의 인생이 담겨 있습니다. 요리와 인생의 아름다운 조화를 그린 드라마입니다. 매일 밤 부드러운 한 끼가 여러분을 기다립니다.',
    requirement: '50공유',
  },
  '3': {
    id: '3',
    title: '아침엔 새, 밤엔 나무',
    deadline: '9일 남음',
    apply: '신청',
    meta: '2 / 30',
    tags: ['#키위새', '#판타지'],
    intro: '키위새로 변신하는 주인공의 판타지 모험담.\n\n아침이 되면 하늘을 나는 새가 되고, 밤이 되면 땅에 뿌리내린 나무가 됩니다. 아침과 밤이 바뀌는 신비로운 세계를 탐험합니다.',
    requirement: '25공유',
  },
};

export default function DetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<PostData | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // 먼저 작성한 작품에서 찾기
    const authorPosts = localStorage.getItem('authorPosts');
    let foundPost: PostData | null = null;
    
    if (authorPosts) {
      const posts: PostData[] = JSON.parse(authorPosts);
      foundPost = posts.find(p => p.id === id) || null;
    }

    // 없으면 기본 작품에서 찾기
    if (!foundPost && defaultPosts[id]) {
      foundPost = defaultPosts[id];
    }

    if (foundPost) {
      setPost(foundPost);
    }

    // 저장 여부 확인
    const savedPosts = localStorage.getItem('savedPosts');
    if (savedPosts) {
      const saved: PostData[] = JSON.parse(savedPosts);
      setIsSaved(saved.some(p => p.id === id));
    }
  }, [id]);

  const handleSave = () => {
    if (!post) return;

    const savedPosts = localStorage.getItem('savedPosts');
    let saved: any[] = savedPosts ? JSON.parse(savedPosts) : [];

    if (isSaved) {
      // 저장 취소
      saved = saved.filter((p: any) => p.id !== id);
      setIsSaved(false);
    } else {
      // 저장
      const postToSave = {
        id: post.id,
        title: post.title,
        deadline: post.deadline,
        apply: post.apply,
        meta: post.meta,
        tags: post.tags,
        savedAt: new Date().toISOString(),
      };
      saved.push(postToSave);
      setIsSaved(true);
    }

    localStorage.setItem('savedPosts', JSON.stringify(saved));
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">요청하신 포스트를 찾을 수 없습니다.</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Creative Crowdfunding
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                className={`p-2 rounded-md transition-colors ${
                  isSaved
                    ? 'text-red-600 hover:text-red-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={isSaved ? '저장 취소' : '저장하기'}
              >
                <svg
                  className="w-5 h-5"
                  fill={isSaved ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
              <Link
                href="/mypage/reader"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                마이페이지
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-red-100 text-red-700">
                  인기글
                </span>
                <span className="text-sm text-gray-500">{post.deadline}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-600">현재 신청: </span>
                <span className="text-sm font-semibold text-blue-600">{post.meta}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-blue-50 rounded-lg p-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">연재 시작 조건</p>
                <p className="text-lg font-bold text-blue-600">{post.requirement}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">도입부</h2>
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {post.intro}
            </div>
            <div className="text-center text-2xl text-yellow-400 mt-6">★</div>
          </div>
        </section>

        <section className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">참여 전 필수 확인사항</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                재밌으셨다면 <strong className="font-semibold">공유</strong> 해주세요.
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                여러분의 관심이 작가에게 <strong className="font-semibold">큰 힘</strong>이 됩니다.
              </span>
            </li>
          </ul>
        </section>

        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag, index) => (
            <Link
              key={index}
              href={`/search?tag=${encodeURIComponent(tag.replace('#', ''))}`}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer"
            >
              {tag}
            </Link>
          ))}
        </div>

        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] text-lg">
          TASTE 신청하기
        </button>
      </main>
    </div>
  );
}

