-- Community Categories 테이블 생성
CREATE TABLE IF NOT EXISTS public.community_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Posts 테이블 생성
CREATE TABLE IF NOT EXISTS public.community_posts (
  id BIGSERIAL PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES public.community_categories(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  content TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  comments INTEGER NOT NULL DEFAULT 0,
  is_hot BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_community_posts_category_id ON public.community_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_is_hot ON public.community_posts(is_hot);
CREATE INDEX IF NOT EXISTS idx_community_posts_views ON public.community_posts(views DESC);

-- 제목 검색 인덱스
CREATE INDEX IF NOT EXISTS idx_community_posts_title ON public.community_posts USING gin(to_tsvector('simple', title));

-- updated_at 자동 업데이트 트리거 함수 (이미 존재할 수 있으므로 CREATE OR REPLACE 사용)
CREATE OR REPLACE FUNCTION update_community_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
DROP TRIGGER IF EXISTS update_community_posts_updated_at ON public.community_posts;
CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_community_posts_updated_at();

-- RLS (Row Level Security) 정책 설정
ALTER TABLE public.community_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Community Categories 정책
-- 모든 사용자가 카테고리를 읽을 수 있도록 정책 설정
CREATE POLICY "Community categories are viewable by everyone"
  ON public.community_categories FOR SELECT
  USING (true);

-- 인증된 사용자만 카테고리를 관리할 수 있도록 정책 설정 (선택사항)
CREATE POLICY "Community categories are manageable by authenticated users"
  ON public.community_categories FOR ALL
  USING (auth.role() = 'authenticated');

-- Community Posts 정책
-- 모든 사용자가 게시글을 읽을 수 있도록 정책 설정
CREATE POLICY "Community posts are viewable by everyone"
  ON public.community_posts FOR SELECT
  USING (true);

-- 인증된 사용자만 게시글을 작성할 수 있도록 정책 설정
CREATE POLICY "Community posts are insertable by authenticated users"
  ON public.community_posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자만 자신의 게시글을 수정할 수 있도록 정책 설정
CREATE POLICY "Users can update their own community posts"
  ON public.community_posts FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 인증된 사용자만 자신의 게시글을 삭제할 수 있도록 정책 설정
CREATE POLICY "Users can delete their own community posts"
  ON public.community_posts FOR DELETE
  USING (auth.role() = 'authenticated');
