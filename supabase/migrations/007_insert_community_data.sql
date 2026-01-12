-- 커뮤니티 카테고리 데이터 삽입
INSERT INTO public.community_categories (id, name) VALUES
('all', '전체'),
('free', '자유게시판'),
('review', '작품 리뷰'),
('recommend', '작품 추천'),
('question', '질문하기')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 커뮤니티 게시글 데이터 삽입
INSERT INTO public.community_posts (id, category_id, title, author, views, likes, comments, is_hot, created_at) VALUES
(1, 'free', '너의 췌장을 먹고싶어 정말 재밌네요!', '독서왕', 234, 18, 5, true, '2024-01-15'::timestamp),
(2, 'review', '부드러운 밤 후기 - 요리 소설의 새로운 지평', '요리사', 189, 25, 8, false, '2024-01-14'::timestamp),
(3, 'recommend', '판타지 좋아하시는 분들 꼭 보세요! 아침엔 새, 밤엔 나무', '판타지러버', 312, 42, 12, true, '2024-01-13'::timestamp),
(4, 'question', 'TASTE 신청은 어떻게 하나요?', '초보자', 156, 8, 3, false, '2024-01-12'::timestamp),
(5, 'free', '좀비 소설 추천 받습니다!', '좀비매니아', 278, 31, 15, true, '2024-01-11'::timestamp),
(6, 'review', '사마귀 인간 - 독특한 컨셉의 스릴러', '리뷰어', 201, 19, 6, false, '2024-01-10'::timestamp),
(7, 'recommend', '경영 소설 좋아하시는 분들 추천드려요', '비즈니스맨', 167, 14, 4, false, '2024-01-09'::timestamp),
(8, 'question', '공유는 어떻게 하나요?', '궁금이', 145, 7, 2, false, '2024-01-08'::timestamp)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  author = EXCLUDED.author,
  views = EXCLUDED.views,
  likes = EXCLUDED.likes,
  comments = EXCLUDED.comments,
  is_hot = EXCLUDED.is_hot,
  created_at = EXCLUDED.created_at;
