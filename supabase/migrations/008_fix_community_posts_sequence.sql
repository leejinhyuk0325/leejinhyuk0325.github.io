-- 커뮤니티 게시글 시퀀스 수정
-- 기존 데이터 삽입 시 명시적으로 ID를 지정했기 때문에 시퀀스가 업데이트되지 않았을 수 있음
-- 시퀀스를 현재 최대 ID 값으로 설정

SELECT setval(
  pg_get_serial_sequence('public.community_posts', 'id'),
  COALESCE((SELECT MAX(id) FROM public.community_posts), 1),
  true
);
