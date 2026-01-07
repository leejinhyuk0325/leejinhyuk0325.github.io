-- Users 테이블 생성
-- auth.users와 1:1 관계를 가지는 확장 프로필 테이블
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  instagram_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_instagram_id ON users(instagram_id);

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책 설정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 다른 사용자의 프로필을 읽을 수 있도록 정책 설정 (선택사항)
CREATE POLICY "Users are viewable by everyone"
  ON users FOR SELECT
  USING (true);

-- 인증된 사용자만 자신의 프로필을 업데이트할 수 있도록 정책 설정
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- 인증된 사용자만 자신의 프로필을 삽입할 수 있도록 정책 설정
CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 새 사용자가 생성될 때 자동으로 users 테이블에 레코드 생성하는 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- auth.users에 새 사용자가 생성될 때 트리거
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

