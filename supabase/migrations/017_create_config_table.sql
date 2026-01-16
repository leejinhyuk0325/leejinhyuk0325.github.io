-- Config 테이블 생성
-- key-value 형태의 설정값 저장용 테이블

CREATE TABLE IF NOT EXISTS config (
  id BIGSERIAL PRIMARY KEY, -- BIGSERIAL은 자동 증가(AUTO_INCREMENT)를 제공합니다
  key TEXT NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- key 컬럼에 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_config_key ON config(key);

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_config_updated_at
  BEFORE UPDATE ON config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책 설정
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽을 수 있도록 정책 설정
CREATE POLICY "Config is viewable by everyone"
  ON config FOR SELECT
  USING (true);

-- 인증된 사용자만 삽입할 수 있도록 정책 설정
CREATE POLICY "Config is insertable by authenticated users"
  ON config FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자만 업데이트할 수 있도록 정책 설정
CREATE POLICY "Config is updatable by authenticated users"
  ON config FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 인증된 사용자만 삭제할 수 있도록 정책 설정
CREATE POLICY "Config is deletable by authenticated users"
  ON config FOR DELETE
  USING (auth.role() = 'authenticated');
