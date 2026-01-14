-- 연재시작코너 카테고리 추가
-- posts 테이블의 category CHECK 제약조건에 'serial' 추가

-- 1. 기존 CHECK 제약조건 삭제
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_category_check;

-- 2. 새로운 CHECK 제약조건 추가 (serial 카테고리 포함)
ALTER TABLE posts ADD CONSTRAINT posts_category_check 
  CHECK (category IN ('popular', 'deadline', 'paid', 'serial'));
