-- Q&A 답변 테이블 생성
CREATE TABLE IF NOT EXISTS qa_answers (
  id BIGSERIAL PRIMARY KEY,
  question_id BIGINT NOT NULL REFERENCES qa_questions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_accepted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_qa_answers_question_id ON qa_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_qa_answers_author_id ON qa_answers(author_id);
CREATE INDEX IF NOT EXISTS idx_qa_answers_created_at ON qa_answers(created_at DESC);

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_qa_answers_updated_at
  BEFORE UPDATE ON qa_answers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책 설정
ALTER TABLE qa_answers ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 답변을 읽을 수 있도록 정책 설정
CREATE POLICY "QA answers are viewable by everyone"
  ON qa_answers FOR SELECT
  USING (true);

-- 인증된 사용자만 답변을 작성할 수 있도록 정책 설정
CREATE POLICY "QA answers are insertable by authenticated users"
  ON qa_answers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

-- 작성자만 자신의 답변을 업데이트할 수 있도록 정책 설정
CREATE POLICY "Users can update their own answers"
  ON qa_answers FOR UPDATE
  USING (auth.uid() = author_id);

-- 작성자만 자신의 답변을 삭제할 수 있도록 정책 설정
CREATE POLICY "Users can delete their own answers"
  ON qa_answers FOR DELETE
  USING (auth.uid() = author_id);
