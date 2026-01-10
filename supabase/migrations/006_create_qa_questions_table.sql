-- Q&A 질문 테이블 생성
CREATE TABLE IF NOT EXISTS qa_questions (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('account', 'taste', 'payment', 'content', 'technical', 'other')),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  views INTEGER NOT NULL DEFAULT 0,
  is_solved BOOLEAN NOT NULL DEFAULT false,
  is_urgent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_qa_questions_category ON qa_questions(category);
CREATE INDEX IF NOT EXISTS idx_qa_questions_author_id ON qa_questions(author_id);
CREATE INDEX IF NOT EXISTS idx_qa_questions_created_at ON qa_questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qa_questions_is_solved ON qa_questions(is_solved);

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_qa_questions_updated_at
  BEFORE UPDATE ON qa_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책 설정
ALTER TABLE qa_questions ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 질문을 읽을 수 있도록 정책 설정
CREATE POLICY "QA questions are viewable by everyone"
  ON qa_questions FOR SELECT
  USING (true);

-- 인증된 사용자만 질문을 작성할 수 있도록 정책 설정
CREATE POLICY "QA questions are insertable by authenticated users"
  ON qa_questions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

-- 작성자만 자신의 질문을 업데이트할 수 있도록 정책 설정
CREATE POLICY "Users can update their own questions"
  ON qa_questions FOR UPDATE
  USING (auth.uid() = author_id);

-- 작성자만 자신의 질문을 삭제할 수 있도록 정책 설정
CREATE POLICY "Users can delete their own questions"
  ON qa_questions FOR DELETE
  USING (auth.uid() = author_id);
