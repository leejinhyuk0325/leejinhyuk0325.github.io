import { supabase } from "./supabase";

/**
 * 마감일 계산 및 표시 형식 변환 헬퍼 함수
 * @param {Date} createdAt - 게시글 생성일
 * @param {number} deadlineDays - 마감까지 일수
 * @param {string} category - 카테고리 ('popular', 'deadline', 'paid', 'serial')
 * @returns {string} - 표시할 마감일 문자열
 */
export function formatDeadline(createdAt: string | Date, deadlineDays: number | null | undefined, category: string): string {
  if (!createdAt || deadlineDays === null || deadlineDays === undefined) {
    return "마감일 정보 없음";
  }

  const created = new Date(createdAt);
  const deadlineDate = new Date(created);
  deadlineDate.setDate(deadlineDate.getDate() + deadlineDays);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(deadlineDate);
  deadline.setHours(0, 0, 0, 0);

  // 오늘 마감인 경우
  if (category === "deadline") {
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "오늘 마감";
    } else if (diffDays < 0) {
      return "마감됨";
    } else {
      return `${diffDays}일 남음`;
    }
  }

  // 연재도전인 경우: 마감일까지 남은 일수 표시
  if (category === "popular") {
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "마감됨";
    } else if (diffDays === 0) {
      return "오늘 마감";
    } else {
      return `${diffDays}일 남음`;
    }
  }

  // 연재시작코너인 경우: 연재도전과 동일하게 처리
  if (category === "serial") {
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "마감됨";
    } else if (diffDays === 0) {
      return "오늘 마감";
    } else {
      return `${diffDays}일 남음`;
    }
  }

  // 유료연재코너인 경우
  if (category === "paid") {
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "마감됨";
    } else if (diffDays === 0) {
      return "오늘 마감";
    } else {
      return `${diffDays}일 남음`;
    }
  }

  // 기본값
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? `${diffDays}일 남음` : "마감됨";
}

/**
 * Serial의 share 개수 가져오기
 */
export async function getShareCount(serialId: number): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("shares")
      .select("*", { count: "exact", head: true })
      .eq("serial_id", serialId);

    if (error) {
      console.error("Share count 가져오기 오류:", error);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error("Share count 가져오기 예외:", err);
    return 0;
  }
}

/**
 * 여러 Serial의 share 개수 가져오기 (배치)
 */
async function getShareCounts(serialIds: number[]): Promise<Record<number, number>> {
  try {
    const { data, error } = await supabase
      .from("shares")
      .select("serial_id")
      .in("serial_id", serialIds);

    if (error) {
      console.error("Share counts 가져오기 오류:", error);
      return {};
    }

    // serial_id별로 개수 세기
    const counts: Record<number, number> = {};
    serialIds.forEach((id) => {
      counts[id] = 0;
    });
    data?.forEach((share) => {
      counts[share.serial_id] = (counts[share.serial_id] || 0) + 1;
    });

    return counts;
  } catch (err) {
    console.error("Share counts 가져오기 예외:", err);
    return {};
  }
}

/**
 * 모든 serials 가져오기
 */
export async function getAllSerials() {
  try {
    const { data, error } = await supabase
      .from("serials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Serials 가져오기 오류:", error);
      return [];
    }

    // share 개수 가져오기
    const serialIds = data.map((serial) => serial.id);
    const shareCounts = await getShareCounts(serialIds);

    // tagList를 배열로 변환하고 shareCount 추가, deadline 표시 형식 계산
    return data.map((serial) => ({
      ...serial,
      tagList: serial.tag_list || [],
      shareCount: shareCounts[serial.id] || 0,
      deadlineDisplay: formatDeadline(
        serial.created_at,
        serial.deadline,
        serial.category
      ),
    }));
  } catch (err) {
    console.error("Serials 가져오기 예외:", err);
    return [];
  }
}

/**
 * 특정 작가(author_id)의 serials 가져오기
 */
export async function getSerialsByAuthor(authorId: string) {
  try {
    if (!authorId) {
      return [];
    }

    const { data, error } = await supabase
      .from("serials")
      .select("*")
      .eq("author_id", authorId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("작가별 Serials 가져오기 오류:", error);
      return [];
    }

    const serialIds = data.map((serial) => serial.id);
    const shareCounts = await getShareCounts(serialIds);

    return data.map((serial) => ({
      ...serial,
      tagList: serial.tag_list || [],
      shareCount: shareCounts[serial.id] || 0,
      deadlineDisplay: formatDeadline(
        serial.created_at,
        serial.deadline,
        serial.category
      ),
    }));
  } catch (err) {
    console.error("작가별 Serials 가져오기 예외:", err);
    return [];
  }
}

/**
 * ID로 serial 가져오기
 */
export async function getSerialById(id: number | string) {
  try {
    const { data, error } = await supabase
      .from("serials")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Serial 가져오기 오류:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    // share 개수 가져오기
    const shareCount = await getShareCount(data.id);

    return {
      ...data,
      tagList: data.tag_list || [],
      shareCount,
      deadlineDisplay: formatDeadline(
        data.created_at,
        data.deadline,
        data.category
      ),
    };
  } catch (err) {
    console.error("Serial 가져오기 예외:", err);
    return null;
  }
}

/**
 * 카테고리별 serials 가져오기
 */
export async function getSerialsByCategory(category: string) {
  try {
    const { data, error } = await supabase
      .from("serials")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("카테고리별 serials 가져오기 오류:", error);
      return [];
    }

    // null이나 undefined 데이터 필터링
    if (!data || data.length === 0) {
      return [];
    }

    // share 개수 가져오기
    const serialIds = data
      .map((serial) => serial.id)
      .filter((id) => id != null);
    const shareCounts = await getShareCounts(serialIds);

    return data
      .filter((serial) => serial != null && serial.id != null) // null 체크
      .map((serial) => ({
        ...serial,
        tagList: serial.tag_list || [],
        shareCount: shareCounts[serial.id] || 0,
        deadlineDisplay: formatDeadline(
          serial.created_at,
          serial.deadline,
          serial.category
        ),
      }));
  } catch (err) {
    console.error("카테고리별 serials 가져오기 예외:", err);
    return [];
  }
}

/**
 * 연재도전 가져오기
 */
export async function getPopularSerials() {
  return getSerialsByCategory("popular");
}

/**
 * 오늘 마감 serials 가져오기
 * category와 상관없이 created_at + deadline이 오늘인 것만 필터링
 * timezone을 고려하여 date만 비교
 */
export async function getTodayDeadlineSerials() {
  try {
    // 오늘 날짜 문자열 (YYYY-MM-DD 형식, 로컬 타임존 기준)
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // 모든 serials 가져오기 (category 필터 없음)
    const { data, error } = await supabase
      .from("serials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("오늘 마감 serials 가져오기 오류:", error);
      return [];
    }

    // null이나 undefined 데이터 필터링
    if (!data || data.length === 0) {
      return [];
    }

    // 클라이언트 측에서 마감일이 오늘인 것만 필터링
    const filtered = data.filter((serial) => {
      // null 체크
      if (!serial || !serial.id) {
        return false;
      }

      if (
        !serial.created_at ||
        serial.deadline === null ||
        serial.deadline === undefined
      ) {
        return false;
      }

      // created_at을 Date 객체로 변환 (자동으로 로컬 타임존으로 변환됨)
      const created = new Date(serial.created_at);

      // 로컬 타임존 기준으로 날짜 추출 (년, 월, 일)
      const createdYear = created.getFullYear();
      const createdMonth = created.getMonth();
      const createdDay = created.getDate();

      // deadline 일수를 더한 마감일 계산 (로컬 타임존 기준)
      const deadlineDate = new Date(createdYear, createdMonth, createdDay);
      deadlineDate.setDate(deadlineDate.getDate() + serial.deadline);

      // 마감일을 YYYY-MM-DD 형식으로 변환 (로컬 타임존 기준)
      const deadlineYear = deadlineDate.getFullYear();
      const deadlineMonth = String(deadlineDate.getMonth() + 1).padStart(
        2,
        "0"
      );
      const deadlineDay = String(deadlineDate.getDate()).padStart(2, "0");
      const deadlineStr = `${deadlineYear}-${deadlineMonth}-${deadlineDay}`;

      // 오늘 날짜와 비교 (문자열 비교로 timezone 문제 방지)
      return deadlineStr === todayStr;
    });

    // share 개수 가져오기
    const serialIds = filtered
      .map((serial) => serial.id)
      .filter((id) => id != null);
    const shareCounts = await getShareCounts(serialIds);

    return filtered
      .filter((serial) => serial != null && serial.id != null) // 추가 null 체크
      .map((serial) => ({
        ...serial,
        tagList: serial.tag_list || [],
        shareCount: shareCounts[serial.id] || 0,
        deadlineDisplay: formatDeadline(
          serial.created_at,
          serial.deadline,
          serial.category
        ),
      }));
  } catch (err) {
    console.error("오늘 마감 serials 가져오기 예외:", err);
    return [];
  }
}

/**
 * 유료연재 serials 가져오기
 */
export async function getPaidSeriesSerials() {
  return getSerialsByCategory("paid");
}

/**
 * 연재시작코너 serials 가져오기
 */
export async function getSerialPosts() {
  return getSerialsByCategory("serial");
}

/**
 * 공유 조건 가져오기 (requirement는 이제 INTEGER)
 * @param {number} requirement - 공유 조건 숫자
 * @returns {number|null} - 필요한 공유 개수 또는 null
 */
export function parseRequirement(requirement: number | null | undefined): number | null {
  if (requirement === null || requirement === undefined) return null;
  // requirement가 이미 숫자이므로 그대로 반환
  return typeof requirement === "number"
    ? requirement
    : parseInt(String(requirement), 10) || null;
}

/**
 * 연재도전 게시글 중 공유 조건이 충족된 것을 연재시작코너로 이동
 */
export async function movePopularToSerial() {
  try {
    // 연재도전 게시글 가져오기
    const popularPosts = await getPopularSerials();

    if (popularPosts.length === 0) {
      return { moved: 0, errors: [] };
    }

    let movedCount = 0;
    const errors: Array<{ postId?: number; error?: any }> = [];

    // 각 게시글의 공유 조건 확인
    for (const post of popularPosts) {
      const requiredShareCount = post.requirement;

      if (requiredShareCount === null || requiredShareCount === undefined) {
        continue; // 공유 조건이 없으면 스킵
      }

      // 현재 공유 개수가 조건을 충족하는지 확인
      if (post.shareCount >= requiredShareCount) {
        // 카테고리를 serial로 변경
        const { error } = await supabase
          .from("serials")
          .update({ category: "serial" })
          .eq("id", post.id);

        if (error) {
          console.error(`게시글 ${post.id} 이동 실패:`, error);
          errors.push({ postId: post.id, error });
        } else {
          movedCount++;
        }
      }
    }

    return { moved: movedCount, errors };
  } catch (err) {
    console.error("연재도전 → 연재시작코너 이동 예외:", err);
    return { moved: 0, errors: [{ error: err }] };
  }
}

/**
 * 연재시작코너 게시글 중 공유 1회 이상, 게시글 2개 이상인 것을 유료연재코너로 이동
 */
export async function moveSerialToPaid() {
  try {
    // 연재시작코너 게시글 가져오기
    const serialPosts = await getSerialPosts();

    if (serialPosts.length === 0) {
      console.log("연재시작코너 게시글이 없습니다.");
      return { moved: 0, errors: [] };
    }

    console.log(`연재시작코너 게시글 ${serialPosts.length}개 확인 중...`);

    let movedCount = 0;
    const errors: Array<{ postId?: number; error?: any }> = [];

    // 각 게시글의 조건 확인
    for (const post of serialPosts) {
      // 공유 개수 확인 (최신 데이터로 다시 가져오기)
      const shareCount = await getShareCount(post.id);

      // 게시글(posts) 개수 확인
      const { getPostsBySerialId } = await import("./posts");
      const posts = await getPostsBySerialId(post.id);
      const postCount = posts ? posts.length : 0;

      console.log(
        `Serial ${post.id}: 공유 ${shareCount}회, 게시글 ${postCount}개`
      );

      // 공유 1회 이상 확인
      if (shareCount < 1) {
        console.log(`Serial ${post.id}: 공유 조건 미달 (${shareCount} < 1)`);
        continue;
      }

      // 게시글 2개 이상 확인
      if (postCount < 2) {
        console.log(`Serial ${post.id}: 게시글 조건 미달 (${postCount} < 2)`);
        continue;
      }

      // 카테고리를 paid로 변경
      console.log(
        `Serial ${post.id}: 조건 충족! 유료연재코너로 이동 중... (공유: ${shareCount}회, 게시글: ${postCount}개)`
      );

      const { error } = await supabase
        .from("serials")
        .update({ category: "paid" })
        .eq("id", post.id);

      if (error) {
        console.error(`게시글 ${post.id} 유료연재코너 이동 실패:`, error);
        errors.push({ postId: post.id, error });
      } else {
        movedCount++;
        console.log(
          `✓ 게시글 ${post.id}가 유료연재코너로 이동되었습니다. (공유: ${shareCount}회, 게시글: ${postCount}개)`
        );
      }
    }

    console.log(`총 ${movedCount}개 게시글이 유료연재코너로 이동되었습니다.`);
    return { moved: movedCount, errors };
  } catch (err) {
    console.error("연재시작코너 → 유료연재코너 이동 예외:", err);
    return { moved: 0, errors: [{ error: err }] };
  }
}

/**
 * 검색어로 serials 검색
 */
export async function searchSerials(query: string) {
  try {
    if (!query || !query.trim()) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const isTagSearch = searchTerm.startsWith("#");
    const tagName = isTagSearch ? searchTerm.substring(1) : searchTerm;

    let queryBuilder = supabase.from("serials").select("*");

    if (isTagSearch) {
      // 태그 검색: tag_list 배열에서 검색
      // 배열의 요소 중 하나가 검색어를 포함하는지 확인
      const { data, error } = await queryBuilder.order("created_at", {
        ascending: false,
      });

      if (error) {
        console.error("Serials 검색 오류:", error);
        return [];
      }

      // 클라이언트 측에서 태그 필터링 (Supabase의 배열 검색 제한으로 인해)
      const filtered = data?.filter((serial) => {
        const tagList = serial.tag_list || [];
        return tagList.some(
          (tag: string) =>
            tag.toLowerCase().replace("#", "") === tagName ||
            tag.toLowerCase().includes(tagName)
        );
      }) || [];

      // share 개수 가져오기
      const serialIds = filtered.map((serial) => serial.id);
      const shareCounts = await getShareCounts(serialIds);

      return filtered.map((serial) => ({
        ...serial,
        tagList: serial.tag_list || [],
        shareCount: shareCounts[serial.id] || 0,
        deadlineDisplay: formatDeadline(
          serial.created_at,
          serial.deadline,
          serial.category
        ),
      }));
    } else {
      // 일반 검색: 제목, 태그, 소개글에서 검색
      queryBuilder = queryBuilder.or(
        `title.ilike.%${searchTerm}%,tags.ilike.%${searchTerm}%,intro.ilike.%${searchTerm}%`
      );

      const { data, error } = await queryBuilder.order("created_at", {
        ascending: false,
      });

      if (error) {
        console.error("Serials 검색 오류:", error);
        return [];
      }

      // share 개수 가져오기
      const serialIds = (data || []).map((serial) => serial.id);
      const shareCounts = await getShareCounts(serialIds);

      return (data || []).map((serial) => ({
        ...serial,
        tagList: serial.tag_list || [],
        shareCount: shareCounts[serial.id] || 0,
        deadlineDisplay: formatDeadline(
          serial.created_at,
          serial.deadline,
          serial.category
        ),
      }));
    }
  } catch (err) {
    console.error("Serials 검색 예외:", err);
    return [];
  }
}

/**
 * Serial 생성 (연재 생성)
 */
export async function createSerial(postData: {
  title: string;
  deadline: number;
  apply?: string;
  tags: string;
  category: string;
  intro: string;
  requirement: number;
  tagList?: string[];
}) {
  try {
    // 현재 사용자 세션 가져오기
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { data, error } = await supabase
      .from("serials")
      .insert([
        {
          title: postData.title,
          deadline: postData.deadline,
          apply: postData.apply || "신청",
          tags: postData.tags,
          category: postData.category,
          intro: postData.intro,
          requirement: postData.requirement,
          tag_list: postData.tagList || [],
          author_id: session?.user?.id || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Serial 생성 오류:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Serial 생성 예외:", err);
    throw err;
  }
}

/**
 * 모든 serial ID 가져오기 (정적 생성용)
 */
export async function getAllSerialIds() {
  try {
    const { data, error } = await supabase.from("serials").select("id");

    if (error) {
      console.error("Serial IDs 가져오기 오류:", error);
      return [];
    }

    return (data || []).map((serial) => serial.id);
  } catch (err) {
    console.error("Serial IDs 가져오기 예외:", err);
    return [];
  }
}

/**
 * Post에 share 추가
 */
export async function addShare(serialId: number, userId: string) {
  try {
    const { data, error } = await supabase
      .from("shares")
      .insert({
        serial_id: serialId,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      console.error("Share 추가 오류:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Share 추가 예외:", err);
    return { success: false, error: err };
  }
}

/**
 * Post에서 share 제거
 */
export async function removeShare(serialId: number, userId: string) {
  try {
    const { error } = await supabase
      .from("shares")
      .delete()
      .eq("serial_id", serialId)
      .eq("user_id", userId);

    if (error) {
      console.error("Share 제거 오류:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error("Share 제거 예외:", err);
    return { success: false, error: err };
  }
}

/**
 * 사용자가 특정 Post를 share했는지 확인
 */
export async function hasUserShared(serialId: number, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("shares")
      .select("id")
      .eq("serial_id", serialId)
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Share 확인 오류:", error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error("Share 확인 예외:", err);
    return false;
  }
}

/**
 * 사용자가 공유한 serials 목록 가져오기
 */
export async function getUserSharedSerials(userId: string) {
  try {
    const { data, error } = await supabase
      .from("shares")
      .select(
        `
        serial_id,
        created_at,
        serials (*)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("공유한 연재 가져오기 오류:", error);
      return [];
    }

    // share 개수 가져오기
    const serialIds = (data || []).map((share: any) => share.serial_id);
    const shareCounts = await getShareCounts(serialIds);

    return (data || [])
      .filter((share: any) => share.serials)
      .map((share: any) => ({
        ...share.serials,
        tagList: share.serials.tag_list || [],
        shareCount: shareCounts[share.serial_id] || 0,
        sharedAt: share.created_at,
        deadlineDisplay: formatDeadline(
          share.serials.created_at,
          share.serials.deadline,
          share.serials.category
        ),
      }));
  } catch (err) {
    console.error("공유한 serials 가져오기 예외:", err);
    return [];
  }
}

/**
 * 관심있는 글 추가
 */
export async function addFavorite(serialId: number, userId: string) {
  try {
    const { data, error } = await supabase
      .from("favorites")
      .insert({
        serial_id: serialId,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      // 테이블이 없는 경우 (404 또는 PGRST205 에러)
      if (
        error.code === "PGRST205" ||
        error.code === "42P01" ||
        error.message?.includes("Could not find the table")
      ) {
        console.warn(
          "favorites 테이블이 아직 생성되지 않았습니다. migration을 실행해주세요."
        );
        return {
          success: false,
          error: { message: "favorites 테이블이 아직 생성되지 않았습니다." },
        };
      }
      console.error("관심있는 글 추가 오류:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("관심있는 글 추가 예외:", err);
    return { success: false, error: err };
  }
}

/**
 * 관심있는 글 제거
 */
export async function removeFavorite(serialId: number, userId: string) {
  try {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("serial_id", serialId)
      .eq("user_id", userId);

    if (error) {
      // 테이블이 없는 경우 (404 또는 PGRST205 에러)
      if (
        error.code === "PGRST205" ||
        error.code === "42P01" ||
        error.message?.includes("Could not find the table")
      ) {
        console.warn(
          "favorites 테이블이 아직 생성되지 않았습니다. migration을 실행해주세요."
        );
        return {
          success: false,
          error: { message: "favorites 테이블이 아직 생성되지 않았습니다." },
        };
      }
      console.error("관심있는 글 제거 오류:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error("관심있는 글 제거 예외:", err);
    return { success: false, error: err };
  }
}

/**
 * 사용자가 관심있는 글 목록 가져오기
 */
export async function getUserFavorites(userId: string) {
  try {
    const { data, error } = await supabase
      .from("favorites")
      .select(
        `
        serial_id,
        created_at,
        serials (*)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      // 테이블이 없는 경우 (404 또는 PGRST205 에러)
      if (
        error.code === "PGRST205" ||
        error.code === "42P01" ||
        error.message?.includes("Could not find the table")
      ) {
        console.warn(
          "favorites 테이블이 아직 생성되지 않았습니다. migration을 실행해주세요."
        );
        return [];
      }
      console.error("관심있는 연재 가져오기 오류:", error);
      return [];
    }

    // share 개수 가져오기
    const serialIds = (data || []).map((fav: any) => fav.serial_id);
    const shareCounts = await getShareCounts(serialIds);

    return (data || [])
      .filter((fav: any) => fav.serials)
      .map((fav: any) => ({
        ...fav.serials,
        tagList: fav.serials.tag_list || [],
        shareCount: shareCounts[fav.serial_id] || 0,
        favoritedAt: fav.created_at,
        deadlineDisplay: formatDeadline(
          fav.serials.created_at,
          fav.serials.deadline,
          fav.serials.category
        ),
      }));
  } catch (err) {
    console.error("관심있는 글 가져오기 예외:", err);
    return [];
  }
}

/**
 * 사용자가 특정 Post를 관심있는 글에 추가했는지 확인
 */
export async function hasUserFavorited(serialId: number, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("serial_id", serialId)
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (error) {
      // 테이블이 없는 경우 (404 또는 PGRST205 에러) 조용히 false 반환
      if (
        error.code === "PGRST205" ||
        error.code === "42P01" ||
        error.message?.includes("Could not find the table")
      ) {
        console.warn(
          "favorites 테이블이 아직 생성되지 않았습니다. migration을 실행해주세요."
        );
        return false;
      }
      console.error("관심있는 글 확인 오류:", error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error("관심있는 글 확인 예외:", err);
    return false;
  }
}

/**
 * 연재도전에 연재하기 (카테고리를 popular로 변경)
 */
export async function publishSerialToPopular(serialId: number, userId: string) {
  try {
    // 먼저 해당 serial이 현재 사용자의 것인지 확인 (선택사항)
    const { data: serial, error: serialError } = await supabase
      .from("serials")
      .select("id, category")
      .eq("id", serialId)
      .single();

    if (serialError || !serial) {
      console.error("Serial 찾기 오류:", serialError);
      return {
        success: false,
        error: serialError || new Error("Serial을 찾을 수 없습니다."),
      };
    }

    // 카테고리를 popular로 변경
    const { data, error } = await supabase
      .from("serials")
      .update({ category: "popular" })
      .eq("id", serialId)
      .select()
      .single();

    if (error) {
      console.error("연재도전 연재 오류:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("연재도전 연재 예외:", err);
    return { success: false, error: err };
  }
}

/**
 * 연재(serial) 삭제
 * 관리자만 삭제 가능
 */
export async function deleteSerial(serialId: number, userEmail: string | null | undefined) {
  try {
    if (!serialId) {
      return { success: false, error: new Error("잘못된 요청입니다.") };
    }

    // 관리자 체크
    const { isAdminEmail } = await import("./posts");
    if (!isAdminEmail(userEmail)) {
      return {
        success: false,
        error: new Error("관리자만 연재를 삭제할 수 있습니다."),
      };
    }

    // 연재에 속한 모든 글(posts) 삭제
    const { getPostsBySerialId } = await import("./posts");
    const posts = await getPostsBySerialId(serialId);
    
    if (posts && posts.length > 0) {
      const { error: postsError } = await supabase
        .from("posts")
        .delete()
        .eq("serial_id", serialId);

      if (postsError) {
        console.error("연재 글 삭제 오류:", postsError);
        // 글 삭제 실패해도 연재 삭제는 계속 진행
      }
    }

    // 연재(serial) 삭제
    const { error } = await supabase
      .from("serials")
      .delete()
      .eq("id", serialId);

    if (error) {
      console.error("연재 삭제 오류:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error("연재 삭제 예외:", err);
    return { success: false, error: err };
  }
}
