/**
 * Supabase에서 posts 데이터를 조회하는 스크립트
 *
 * 사용 방법:
 * 1. .env.local 파일에 Supabase 환경 변수 설정
 * 2. node scripts/migrate-posts-to-supabase.js 실행
 */

require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Supabase 환경 변수가 설정되지 않았습니다.");
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 확인해주세요."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migratePosts() {
  console.log("🚀 Posts 데이터 조회 시작...\n");

  // 기존 데이터 확인
  const { data: existingPosts, error: checkError } = await supabase
    .from("posts")
    .select("id");

  if (checkError) {
    console.error("❌ 기존 데이터 확인 중 오류:", checkError);
    return;
  }

  if (existingPosts && existingPosts.length > 0) {
    console.log(`✅ DB에 ${existingPosts.length}개의 posts가 존재합니다.`);
  } else {
    console.log("⚠️  DB에 posts 데이터가 없습니다.");
  }

  // DB에서 모든 posts 데이터 조회
  const { data: allPostsFromDB, error: fetchError } = await supabase
    .from("posts")
    .select("*");

  if (fetchError) {
    console.error("❌ 데이터 조회 중 오류:", fetchError);
    return;
  }

  if (allPostsFromDB && allPostsFromDB.length > 0) {
    console.log(
      `✅ DB에서 ${allPostsFromDB.length}개의 posts를 조회했습니다.\n`
    );
  } else {
    console.log("⚠️  DB에 조회할 posts 데이터가 없습니다.\n");
  }
}

migratePosts().catch(console.error);
