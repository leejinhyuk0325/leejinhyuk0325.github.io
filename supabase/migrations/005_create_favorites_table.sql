-- Favorites 테이블 생성 (관심있는 글)
CREATE TABLE IF NOT EXISTS favorites (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id) -- 한 사용자가 같은 post를 중복으로 favorite할 수 없도록
);

-- Favorites 테이블 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_favorites_post_id ON favorites(post_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_post_user ON favorites(post_id, user_id);

-- Favorites 테이블 RLS 정책 설정
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 favorite 수를 읽을 수 있도록 정책 설정
CREATE POLICY "Favorites are viewable by everyone"
  ON favorites FOR SELECT
  USING (true);

-- 인증된 사용자만 자신의 favorite를 삽입할 수 있도록 정책 설정
CREATE POLICY "Users can insert their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 인증된 사용자만 자신의 favorite를 삭제할 수 있도록 정책 설정
CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

