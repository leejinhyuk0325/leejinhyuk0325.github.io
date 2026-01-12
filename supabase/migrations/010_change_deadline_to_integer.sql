-- deadline 컬럼을 TEXT에서 INTEGER로 변경
-- 기존 텍스트 데이터를 숫자로 변환

-- 1. 새로운 INTEGER 컬럼 추가 (임시)
ALTER TABLE posts ADD COLUMN deadline_days INTEGER;

-- 2. 기존 deadline 텍스트 데이터를 숫자로 변환하여 새 컬럼에 저장
-- "25일 남음" -> 25, "오늘 마감" -> 0, "마감" -> 0 등
UPDATE posts
SET deadline_days = CASE
  WHEN deadline LIKE '%오늘%' OR deadline LIKE '%마감%' THEN 0
  WHEN deadline ~ '^[0-9]+일' THEN CAST(REGEXP_REPLACE(deadline, '[^0-9]', '', 'g') AS INTEGER)
  WHEN deadline ~ '^[0-9]+' THEN CAST(REGEXP_REPLACE(deadline, '[^0-9]', '', 'g') AS INTEGER)
  ELSE 30  -- 기본값 30일
END;

-- 3. 기존 deadline 컬럼 삭제
ALTER TABLE posts DROP COLUMN deadline;

-- 4. 새 컬럼 이름을 deadline으로 변경
ALTER TABLE posts RENAME COLUMN deadline_days TO deadline;

-- 5. NOT NULL 제약 조건 추가 (기본값 30일)
ALTER TABLE posts ALTER COLUMN deadline SET DEFAULT 30;
ALTER TABLE posts ALTER COLUMN deadline SET NOT NULL;

-- 6. deadline이 NULL인 경우 기본값으로 설정
UPDATE posts SET deadline = 30 WHERE deadline IS NULL;
