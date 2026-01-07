# Supabase Posts 테이블 설정 가이드

이 가이드는 posts 데이터를 Supabase 데이터베이스로 마이그레이션하는 방법을 설명합니다.

## 1. Supabase 대시보드에서 테이블 생성

### 방법 1: SQL Editor 사용 (권장)

1. Supabase 대시보드에 로그인
2. 왼쪽 사이드바에서 **SQL Editor** 클릭
3. **New query** 클릭
4. `supabase/migrations/001_create_posts_table.sql` 파일의 내용을 복사하여 붙여넣기
5. **Run** 버튼 클릭하여 실행

### 방법 2: Table Editor 사용

1. Supabase 대시보드에 로그인
2. 왼쪽 사이드바에서 **Table Editor** 클릭
3. **New table** 클릭
4. 테이블 이름: `posts`
5. 다음 컬럼들을 추가:

| 컬럼명 | 타입 | 설정 |
|--------|------|------|
| id | bigserial | Primary Key, Auto Increment |
| title | text | Not Null |
| deadline | text | Not Null |
| apply | text | Not Null, Default: `'신청'` |
| tags | text | Not Null |
| category | text | Not Null, Check: `category IN ('popular', 'deadline', 'paid')` |
| intro | text | Not Null |
| requirement | text | Not Null |
| tag_list | text[] | Not Null, Default: `'{}'` |
| created_at | timestamptz | Default: `now()` |
| updated_at | timestamptz | Default: `now()` |

6. **Save** 클릭

## 2. Share 테이블 생성

Share 테이블은 posts와 users 간의 many-to-many 관계를 나타냅니다. 여러 사용자가 각각의 post를 share할 수 있습니다.

`supabase/migrations/001_create_posts_table.sql` 파일에는 share 테이블 생성 SQL이 포함되어 있습니다.

또는 기존 테이블이 있는 경우 `supabase/migrations/002_remove_meta_add_shares.sql` 파일을 실행하여 meta 컬럼을 제거하고 share 테이블을 추가할 수 있습니다.

## 3. Row Level Security (RLS) 정책 설정

SQL Editor에서 다음 SQL을 실행하세요:

```sql
-- RLS 활성화
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
```

## 4. 기존 데이터 마이그레이션

### 방법 1: SQL 마이그레이션 사용 (권장)

1. Supabase 대시보드에서 **SQL Editor** 클릭
2. **New query** 클릭
3. `supabase/migrations/003_insert_initial_posts.sql` 파일의 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭하여 실행

이 방법이 가장 간단하고 빠릅니다. SQL Editor에서 직접 실행하면 됩니다.

### 방법 2: 마이그레이션 스크립트 사용

1. 프로젝트 루트에 `.env.local` 파일이 있는지 확인
2. 다음 환경 변수가 설정되어 있는지 확인:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (선택사항, RLS를 우회하려면 필요)
   ```

3. 마이그레이션 스크립트 실행:
   ```bash
   node scripts/migrate-posts-to-supabase.js
   ```

### 방법 3: Supabase 대시보드에서 직접 삽입

1. Supabase 대시보드에서 **Table Editor** 클릭
2. `posts` 테이블 선택
3. **Insert row** 클릭
4. `src/data/posts.js` 파일의 데이터를 참고하여 수동으로 입력

## 5. 인덱스 생성 (성능 향상)

SQL Editor에서 다음 SQL을 실행하세요:

```sql
-- 카테고리 인덱스
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- 제목 검색 인덱스 (simple은 기본 제공되는 텍스트 검색 설정)
CREATE INDEX IF NOT EXISTS idx_posts_title ON posts USING gin(to_tsvector('simple', title));

-- 태그 배열 검색 인덱스
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING gin(tag_list);
```

## 6. updated_at 자동 업데이트 트리거 설정

SQL Editor에서 다음 SQL을 실행하세요:

```sql
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
```

## 7. 확인

1. Supabase 대시보드에서 **Table Editor** 클릭
2. `posts` 테이블 선택
3. 데이터가 제대로 삽입되었는지 확인
4. 애플리케이션을 실행하여 posts가 제대로 표시되는지 확인

## 문제 해결

### RLS 정책 오류
- RLS 정책이 제대로 설정되지 않으면 데이터를 읽을 수 없습니다
- SQL Editor에서 정책을 다시 확인하고 실행하세요

### 데이터 삽입 오류
- `tag_list`는 배열 형식이어야 합니다: `['#태그1', '#태그2']`
- `category`는 반드시 `'popular'`, `'deadline'`, `'paid'` 중 하나여야 합니다
- `meta` 컬럼은 더 이상 사용되지 않습니다. share 테이블을 사용하여 공유 수를 관리합니다

### 검색이 작동하지 않음
- 인덱스가 제대로 생성되었는지 확인하세요
- `tag_list` 컬럼이 `text[]` 타입인지 확인하세요

## 추가 참고사항

- Service Role Key는 RLS를 우회하므로 개발 환경에서만 사용하세요
- 프로덕션 환경에서는 반드시 RLS 정책을 적절히 설정하세요
- 대량의 데이터를 삽입할 때는 배치 삽입을 사용하는 것이 좋습니다

