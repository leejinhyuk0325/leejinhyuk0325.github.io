-- posts 테이블에 author_id 컬럼 추가
-- 게시글 작성자를 추적하기 위한 컬럼

-- 1. author_id 컬럼 추가 (NULL 허용, 기존 데이터를 위해)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. 인덱스 생성 (작성자별 게시글 조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);

-- 3. 기존 게시글의 author_id는 NULL로 유지 (기존 데이터는 작성자 정보 없음)
