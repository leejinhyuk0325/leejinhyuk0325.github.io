-- Posts 테이블 생성
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  deadline TEXT NOT NULL,
  apply TEXT NOT NULL DEFAULT '신청',
  tags TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('popular', 'deadline', 'paid')),
  intro TEXT NOT NULL,
  requirement TEXT NOT NULL,
  tag_list TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
-- 제목 검색 인덱스 (simple은 기본 제공되는 텍스트 검색 설정)
CREATE INDEX IF NOT EXISTS idx_posts_title ON posts USING gin(to_tsvector('simple', title));
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING gin(tag_list);

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책 설정
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽을 수 있도록 정책 설정
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

-- 인증된 사용자만 삽입할 수 있도록 정책 설정 (선택사항)
CREATE POLICY "Posts are insertable by authenticated users"
  ON posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자만 업데이트할 수 있도록 정책 설정 (선택사항)
CREATE POLICY "Posts are updatable by authenticated users"
  ON posts FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 인증된 사용자만 삭제할 수 있도록 정책 설정 (선택사항)
CREATE POLICY "Posts are deletable by authenticated users"
  ON posts FOR DELETE
  USING (auth.role() = 'authenticated');

-- Share 테이블 생성 (Many-to-Many: posts와 users)
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
