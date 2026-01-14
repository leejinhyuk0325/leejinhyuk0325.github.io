-- post_id를 serial_id로 변경
-- shares와 favorites 테이블의 post_id 컬럼을 serial_id로 변경

-- 1. shares 테이블의 post_id를 serial_id로 변경
ALTER TABLE shares RENAME COLUMN post_id TO serial_id;

-- 2. shares 테이블의 인덱스 이름 변경
DROP INDEX IF EXISTS idx_shares_post_id;
CREATE INDEX IF NOT EXISTS idx_shares_serial_id ON shares(serial_id);
DROP INDEX IF EXISTS idx_shares_post_user;
CREATE INDEX IF NOT EXISTS idx_shares_serial_user ON shares(serial_id, user_id);

-- 3. favorites 테이블의 post_id를 serial_id로 변경
ALTER TABLE favorites RENAME COLUMN post_id TO serial_id;

-- 4. favorites 테이블의 인덱스 이름 변경
DROP INDEX IF EXISTS idx_favorites_post_id;
CREATE INDEX IF NOT EXISTS idx_favorites_serial_id ON public.favorites(serial_id);
DROP INDEX IF EXISTS idx_favorites_post_user;
CREATE INDEX IF NOT EXISTS idx_favorites_serial_user ON public.favorites(serial_id, user_id);

-- 5. 외래키 제약조건 이름 업데이트 (이미 serials를 참조하도록 변경됨)
-- 제약조건 이름만 업데이트 (이미 올바른 이름이면 스킵)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- shares 테이블의 외래키 제약조건 이름 변경
    FOR r IN (
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'shares' 
        AND constraint_type = 'FOREIGN KEY'
        AND constraint_name LIKE '%serial%'
        AND constraint_name != 'shares_serial_id_fkey'
    ) LOOP
        EXECUTE 'ALTER TABLE shares RENAME CONSTRAINT ' || quote_ident(r.constraint_name) || ' TO shares_serial_id_fkey';
    END LOOP;
    
    -- favorites 테이블의 외래키 제약조건 이름 변경
    FOR r IN (
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'favorites' 
        AND constraint_type = 'FOREIGN KEY'
        AND constraint_name LIKE '%serial%'
        AND constraint_name != 'favorites_serial_id_fkey'
    ) LOOP
        EXECUTE 'ALTER TABLE favorites RENAME CONSTRAINT ' || quote_ident(r.constraint_name) || ' TO favorites_serial_id_fkey';
    END LOOP;
END $$;

-- 6. UNIQUE 제약조건 업데이트
-- shares 테이블
ALTER TABLE shares DROP CONSTRAINT IF EXISTS shares_post_id_user_id_key;
ALTER TABLE shares DROP CONSTRAINT IF EXISTS shares_serial_id_user_id_key;
ALTER TABLE shares ADD CONSTRAINT shares_serial_id_user_id_key UNIQUE(serial_id, user_id);

-- favorites 테이블
ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_post_id_user_id_key;
ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_serial_id_user_id_key;
ALTER TABLE favorites ADD CONSTRAINT favorites_serial_id_user_id_key UNIQUE(serial_id, user_id);
