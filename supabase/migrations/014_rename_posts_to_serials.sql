-- posts 테이블을 serials 테이블로 이름 변경
-- 연재 도메인에 맞게 테이블 이름 변경

-- 1. 테이블 이름 변경
ALTER TABLE IF EXISTS posts RENAME TO serials;

-- 2. 시퀀스 이름 변경 (id 시퀀스)
ALTER SEQUENCE IF EXISTS posts_id_seq RENAME TO serials_id_seq;
ALTER TABLE serials ALTER COLUMN id SET DEFAULT nextval('serials_id_seq'::regclass);

-- 3. 인덱스 이름 변경
ALTER INDEX IF EXISTS idx_posts_category RENAME TO idx_serials_category;
ALTER INDEX IF EXISTS idx_posts_title RENAME TO idx_serials_title;
ALTER INDEX IF EXISTS idx_posts_tags RENAME TO idx_serials_tags;
ALTER INDEX IF EXISTS idx_posts_author_id RENAME TO idx_serials_author_id;

-- 4. 트리거 이름 변경
ALTER TRIGGER update_posts_updated_at ON serials RENAME TO update_serials_updated_at;

-- 5. CHECK 제약조건 이름 변경
ALTER TABLE serials DROP CONSTRAINT IF EXISTS posts_category_check;
ALTER TABLE serials ADD CONSTRAINT serials_category_check 
  CHECK (category IN ('popular', 'deadline', 'paid', 'serial'));

-- 6. RLS 정책 이름 변경
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON serials;
CREATE POLICY "Serials are viewable by everyone"
  ON serials FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Posts are insertable by authenticated users" ON serials;
CREATE POLICY "Serials are insertable by authenticated users"
  ON serials FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Posts are updatable by authenticated users" ON serials;
CREATE POLICY "Serials are updatable by authenticated users"
  ON serials FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Posts are deletable by authenticated users" ON serials;
CREATE POLICY "Serials are deletable by authenticated users"
  ON serials FOR DELETE
  USING (auth.role() = 'authenticated');

-- 7. 외래키 참조 업데이트 (shares 테이블)
-- 기존 외래키 제약조건 찾기 및 삭제
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'shares' 
        AND constraint_type = 'FOREIGN KEY'
        AND constraint_name LIKE '%post%'
    ) LOOP
        EXECUTE 'ALTER TABLE shares DROP CONSTRAINT IF EXISTS ' || quote_ident(r.constraint_name);
    END LOOP;
END $$;

-- 새로운 외래키 제약조건 추가 (post_id는 015번 마이그레이션에서 serial_id로 변경됨)
-- 여기서는 일단 post_id로 참조하도록 설정
ALTER TABLE shares ADD CONSTRAINT shares_serial_id_fkey 
  FOREIGN KEY (post_id) REFERENCES serials(id) ON DELETE CASCADE;

-- 8. 외래키 참조 업데이트 (favorites 테이블)
-- 기존 외래키 제약조건 찾기 및 삭제
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'favorites' 
        AND constraint_type = 'FOREIGN KEY'
        AND constraint_name LIKE '%post%'
    ) LOOP
        EXECUTE 'ALTER TABLE favorites DROP CONSTRAINT IF EXISTS ' || quote_ident(r.constraint_name);
    END LOOP;
END $$;

-- 새로운 외래키 제약조건 추가 (post_id는 015번 마이그레이션에서 serial_id로 변경됨)
ALTER TABLE favorites ADD CONSTRAINT favorites_serial_id_fkey 
  FOREIGN KEY (post_id) REFERENCES serials(id) ON DELETE CASCADE;

-- 참고: post_id 컬럼은 015번 마이그레이션에서 serial_id로 변경됩니다
