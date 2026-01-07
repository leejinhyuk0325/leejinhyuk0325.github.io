-- ============================================
-- 테이블 초기화 (모든 데이터 및 테이블 삭제)
-- ============================================
-- 주의: 이 섹션을 실행하면 모든 posts와 shares 데이터가 삭제됩니다!
-- 필요시 아래 주석을 해제하고 실행하세요:

/*
-- RLS 정책 삭제
DROP POLICY IF EXISTS "Users can delete their own shares" ON shares;
DROP POLICY IF EXISTS "Users can insert their own shares" ON shares;
DROP POLICY IF EXISTS "Shares are viewable by everyone" ON shares;
DROP POLICY IF EXISTS "Posts are deletable by authenticated users" ON posts;
DROP POLICY IF EXISTS "Posts are updatable by authenticated users" ON posts;
DROP POLICY IF EXISTS "Posts are insertable by authenticated users" ON posts;
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;

-- 트리거 삭제
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;

-- 함수 삭제 (선택사항)
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 테이블 삭제 (외래 키 제약 때문에 shares를 먼저 삭제)
DROP TABLE IF EXISTS shares CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
*/

-- ============================================
-- 기존 posts 테이블에서 meta 컬럼 제거 (이미 테이블이 생성된 경우)
-- 주의: 이 마이그레이션은 기존 테이블이 있는 경우에만 실행하세요
-- ============================================

-- meta 컬럼이 존재하는 경우에만 제거
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'meta'
  ) THEN
    ALTER TABLE posts DROP COLUMN meta;
  END IF;
END $$;

-- Share 테이블 생성 (이미 존재하지 않는 경우)
CREATE TABLE IF NOT EXISTS shares (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id) -- 한 사용자가 같은 post를 중복으로 share할 수 없도록
);

-- Share 테이블 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_shares_post_id ON shares(post_id);
CREATE INDEX IF NOT EXISTS idx_shares_user_id ON shares(user_id);
CREATE INDEX IF NOT EXISTS idx_shares_post_user ON shares(post_id, user_id);

-- Share 테이블 RLS 정책 설정
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 share 수를 읽을 수 있도록 정책 설정
CREATE POLICY "Shares are viewable by everyone"
  ON shares FOR SELECT
  USING (true);

-- 인증된 사용자만 자신의 share를 삽입할 수 있도록 정책 설정
CREATE POLICY "Users can insert their own shares"
  ON shares FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 인증된 사용자만 자신의 share를 삭제할 수 있도록 정책 설정
CREATE POLICY "Users can delete their own shares"
  ON shares FOR DELETE
  USING (auth.uid() = user_id);

