-- requirement 컬럼을 TEXT에서 INTEGER로 변경
-- 기존 값들을 모두 30으로 설정

-- 1. 새로운 INTEGER 컬럼 추가 (임시)
ALTER TABLE posts ADD COLUMN requirement_new INTEGER;

-- 2. 기존 requirement 텍스트 데이터를 숫자로 변환하여 새 컬럼에 저장
-- "30공유" -> 30, "50공유" -> 50 등
UPDATE posts
SET requirement_new = CASE
  WHEN requirement ~ '^[0-9]+' THEN CAST(REGEXP_REPLACE(requirement, '[^0-9]', '', 'g') AS INTEGER)
  ELSE 30  -- 기본값 30
END;

-- 3. 기존 requirement 컬럼 삭제
ALTER TABLE posts DROP COLUMN requirement;

-- 4. 새 컬럼 이름을 requirement로 변경
ALTER TABLE posts RENAME COLUMN requirement_new TO requirement;

-- 5. NOT NULL 제약 조건 추가 (기본값 30)
ALTER TABLE posts ALTER COLUMN requirement SET DEFAULT 30;
ALTER TABLE posts ALTER COLUMN requirement SET NOT NULL;

-- 6. requirement가 NULL인 경우 기본값으로 설정
UPDATE posts SET requirement = 30 WHERE requirement IS NULL;
