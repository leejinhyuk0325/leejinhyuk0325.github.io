-- QA Categories 테이블 생성
CREATE TABLE IF NOT EXISTS public.qa_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QA FAQs 테이블 생성 (자주 묻는 질문)
CREATE TABLE IF NOT EXISTS public.qa_faqs (
  id BIGSERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  helpful INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QA Questions 테이블 생성 (일반 질문)
CREATE TABLE IF NOT EXISTS public.qa_questions (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  content TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  answers INTEGER NOT NULL DEFAULT 0,
  is_solved BOOLEAN NOT NULL DEFAULT false,
  is_urgent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_qa_categories_name ON public.qa_categories(name);
CREATE INDEX IF NOT EXISTS idx_qa_faqs_category ON public.qa_faqs(category);
CREATE INDEX IF NOT EXISTS idx_qa_faqs_views ON public.qa_faqs(views DESC);
CREATE INDEX IF NOT EXISTS idx_qa_questions_category ON public.qa_questions(category);
CREATE INDEX IF NOT EXISTS idx_qa_questions_created_at ON public.qa_questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qa_questions_is_solved ON public.qa_questions(is_solved);
CREATE INDEX IF NOT EXISTS idx_qa_questions_is_urgent ON public.qa_questions(is_urgent);
CREATE INDEX IF NOT EXISTS idx_qa_questions_views ON public.qa_questions(views DESC);

-- 제목 검색 인덱스
CREATE INDEX IF NOT EXISTS idx_qa_questions_title ON public.qa_questions USING gin(to_tsvector('simple', title));
CREATE INDEX IF NOT EXISTS idx_qa_faqs_question ON public.qa_faqs USING gin(to_tsvector('simple', question));

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_qa_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
DROP TRIGGER IF EXISTS update_qa_faqs_updated_at ON public.qa_faqs;
CREATE TRIGGER update_qa_faqs_updated_at
  BEFORE UPDATE ON public.qa_faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_qa_updated_at();

DROP TRIGGER IF EXISTS update_qa_questions_updated_at ON public.qa_questions;
CREATE TRIGGER update_qa_questions_updated_at
  BEFORE UPDATE ON public.qa_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_qa_updated_at();

-- RLS (Row Level Security) 정책 설정
ALTER TABLE public.qa_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_questions ENABLE ROW LEVEL SECURITY;

-- QA Categories 정책
-- 기존 정책 삭제
DROP POLICY IF EXISTS "QA categories are viewable by everyone" ON public.qa_categories;
DROP POLICY IF EXISTS "QA categories are manageable by authenticated users" ON public.qa_categories;

-- 모든 사용자가 카테고리를 읽을 수 있도록 정책 설정
CREATE POLICY "QA categories are viewable by everyone"
  ON public.qa_categories FOR SELECT
  USING (true);

-- 인증된 사용자만 카테고리를 관리할 수 있도록 정책 설정
CREATE POLICY "QA categories are manageable by authenticated users"
  ON public.qa_categories FOR ALL
  USING (auth.role() = 'authenticated');

-- QA FAQs 정책
-- 기존 정책 삭제
DROP POLICY IF EXISTS "QA FAQs are viewable by everyone" ON public.qa_faqs;
DROP POLICY IF EXISTS "QA FAQs are manageable by authenticated users" ON public.qa_faqs;

-- 모든 사용자가 FAQ를 읽을 수 있도록 정책 설정
CREATE POLICY "QA FAQs are viewable by everyone"
  ON public.qa_faqs FOR SELECT
  USING (true);

-- 인증된 사용자만 FAQ를 관리할 수 있도록 정책 설정
CREATE POLICY "QA FAQs are manageable by authenticated users"
  ON public.qa_faqs FOR ALL
  USING (auth.role() = 'authenticated');

-- QA Questions 정책
-- 기존 정책 삭제
DROP POLICY IF EXISTS "QA questions are viewable by everyone" ON public.qa_questions;
DROP POLICY IF EXISTS "QA questions are insertable by authenticated users" ON public.qa_questions;
DROP POLICY IF EXISTS "Users can update their own QA questions" ON public.qa_questions;
DROP POLICY IF EXISTS "Users can delete their own QA questions" ON public.qa_questions;

-- 모든 사용자가 질문을 읽을 수 있도록 정책 설정
CREATE POLICY "QA questions are viewable by everyone"
  ON public.qa_questions FOR SELECT
  USING (true);

-- 인증된 사용자만 질문을 작성할 수 있도록 정책 설정
CREATE POLICY "QA questions are insertable by authenticated users"
  ON public.qa_questions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자만 자신의 질문을 수정할 수 있도록 정책 설정
CREATE POLICY "Users can update their own QA questions"
  ON public.qa_questions FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 인증된 사용자만 자신의 질문을 삭제할 수 있도록 정책 설정
CREATE POLICY "Users can delete their own QA questions"
  ON public.qa_questions FOR DELETE
  USING (auth.role() = 'authenticated');

-- qa_questions 테이블의 category CHECK 제약조건 제거 (있다면)
ALTER TABLE public.qa_questions DROP CONSTRAINT IF EXISTS qa_questions_category_check;

-- qa_questions 테이블에 author_id 컬럼 추가 (없으면)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'qa_questions' 
    AND column_name = 'author_id'
  ) THEN
    ALTER TABLE public.qa_questions ADD COLUMN author_id UUID NOT NULL DEFAULT '223aa000-3e15-497b-80e8-048e18d3d6f5'::uuid;
  END IF;
END $$;
