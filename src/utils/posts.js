import { supabase } from "./supabase";

/**
 * 마감일 계산 및 표시 형식 변환 헬퍼 함수
 * @param {Date} createdAt - 게시글 생성일
 * @param {number} deadlineDays - 마감까지 일수
 * @param {string} category - 카테고리 ('popular', 'deadline', 'paid', 'serial')
 * @returns {string} - 표시할 마감일 문자열
 */
export function formatDeadline(createdAt, deadlineDays, category) {
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
    const diffTime = deadline - today;
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
    const diffTime = deadline - today;
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
    const diffTime = deadline - today;
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
    const diffTime = deadline - today;
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
  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? `${diffDays}일 남음` : "마감됨";
}

/**
 * Post의 share 개수 가져오기
 */
export async function getShareCount(postId) {
  try {
    const { count, error } = await supabase
      .from("shares")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);

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
 * 여러 Post의 share 개수 가져오기 (배치)
 */
async function getShareCounts(postIds) {
  try {
    const { data, error } = await supabase
      .from("shares")
      .select("post_id")
      .in("post_id", postIds);

    if (error) {
      console.error("Share counts 가져오기 오류:", error);
      return {};
    }

    // post_id별로 개수 세기
    const counts = {};
    postIds.forEach((id) => {
      counts[id] = 0;
    });
    data.forEach((share) => {
      counts[share.post_id] = (counts[share.post_id] || 0) + 1;
    });

    return counts;
  } catch (err) {
    console.error("Share counts 가져오기 예외:", err);
    return {};
  }
}

/**
 * 모든 posts 가져오기
 */
export async function getAllPosts() {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Posts 가져오기 오류:", error);
      return [];
    }

    // share 개수 가져오기
    const postIds = data.map((post) => post.id);
    const shareCounts = await getShareCounts(postIds);

    // tagList를 배열로 변환하고 shareCount 추가, deadline 표시 형식 계산
    return data.map((post) => ({
      ...post,
      tagList: post.tag_list || [],
      shareCount: shareCounts[post.id] || 0,
      deadlineDisplay: formatDeadline(
        post.created_at,
        post.deadline,
        post.category
      ),
    }));
  } catch (err) {
    console.error("Posts 가져오기 예외:", err);
    return [];
  }
}

/**
 * ID로 post 가져오기
 */
export async function getPostById(id) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Post 가져오기 오류:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    // share 개수 가져오기
    const shareCount = await getShareCount(id);

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
    console.error("Post 가져오기 예외:", err);
    return null;
  }
}

/**
 * 카테고리별 posts 가져오기
 */
export async function getPostsByCategory(category) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("카테고리별 posts 가져오기 오류:", error);
      return [];
    }

    // share 개수 가져오기
    const postIds = data.map((post) => post.id);
    const shareCounts = await getShareCounts(postIds);

    return data.map((post) => ({
      ...post,
      tagList: post.tag_list || [],
      shareCount: shareCounts[post.id] || 0,
      deadlineDisplay: formatDeadline(
        post.created_at,
        post.deadline,
        post.category
      ),
    }));
  } catch (err) {
    console.error("카테고리별 posts 가져오기 예외:", err);
    return [];
  }
}

/**
 * 연재도전 가져오기
 */
export async function getPopularPosts() {
  return getPostsByCategory("popular");
}

/**
 * 오늘 마감 posts 가져오기
 * category와 상관없이 created_at + deadline이 오늘인 것만 필터링
 * timezone을 고려하여 date만 비교
 */
export async function getTodayDeadlinePosts() {
  try {
    // 오늘 날짜 문자열 (YYYY-MM-DD 형식, 로컬 타임존 기준)
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // 모든 posts 가져오기 (category 필터 없음)
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("오늘 마감 posts 가져오기 오류:", error);
      return [];
    }

    // 클라이언트 측에서 마감일이 오늘인 것만 필터링
    const filtered = data.filter((post) => {
      if (
        !post.created_at ||
        post.deadline === null ||
        post.deadline === undefined
      ) {
        return false;
      }

      // created_at을 Date 객체로 변환 (자동으로 로컬 타임존으로 변환됨)
      const created = new Date(post.created_at);

      // 로컬 타임존 기준으로 날짜 추출 (년, 월, 일)
      const createdYear = created.getFullYear();
      const createdMonth = created.getMonth();
      const createdDay = created.getDate();

      // deadline 일수를 더한 마감일 계산 (로컬 타임존 기준)
      const deadlineDate = new Date(createdYear, createdMonth, createdDay);
      deadlineDate.setDate(deadlineDate.getDate() + post.deadline);

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
    const postIds = filtered.map((post) => post.id);
    const shareCounts = await getShareCounts(postIds);

    return filtered.map((post) => ({
      ...post,
      tagList: post.tag_list || [],
      shareCount: shareCounts[post.id] || 0,
      deadlineDisplay: formatDeadline(
        post.created_at,
        post.deadline,
        post.category
      ),
    }));
  } catch (err) {
    console.error("오늘 마감 posts 가져오기 예외:", err);
    return [];
  }
}

/**
 * 유료연재 posts 가져오기
 */
export async function getPaidSeriesPosts() {
  return getPostsByCategory("paid");
}

/**
 * 연재시작코너 posts 가져오기
 */
export async function getSerialPosts() {
  return getPostsByCategory("serial");
}

/**
 * 공유 조건 가져오기 (requirement는 이제 INTEGER)
 * @param {number} requirement - 공유 조건 숫자
 * @returns {number|null} - 필요한 공유 개수 또는 null
 */
export function parseRequirement(requirement) {
  if (requirement === null || requirement === undefined) return null;
  // requirement가 이미 숫자이므로 그대로 반환
  return typeof requirement === "number"
    ? requirement
    : parseInt(requirement, 10) || null;
}

/**
 * 연재도전 게시글 중 공유 조건이 충족된 것을 연재시작코너로 이동
 */
export async function movePopularToSerial() {
  try {
    // 연재도전 게시글 가져오기
    const popularPosts = await getPopularPosts();

    if (popularPosts.length === 0) {
      return { moved: 0, errors: [] };
    }

    let movedCount = 0;
    const errors = [];

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
          .from("posts")
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
 * 검색어로 posts 검색
 */
export async function searchPosts(query) {
  try {
    if (!query || !query.trim()) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const isTagSearch = searchTerm.startsWith("#");
    const tagName = isTagSearch ? searchTerm.substring(1) : searchTerm;

    let queryBuilder = supabase.from("posts").select("*");

    if (isTagSearch) {
      // 태그 검색: tag_list 배열에서 검색
      // 배열의 요소 중 하나가 검색어를 포함하는지 확인
      const { data, error } = await queryBuilder.order("created_at", {
        ascending: false,
      });

      if (error) {
        console.error("Posts 검색 오류:", error);
        return [];
      }

      // 클라이언트 측에서 태그 필터링 (Supabase의 배열 검색 제한으로 인해)
      const filtered = data.filter((post) => {
        const tagList = post.tag_list || [];
        return tagList.some(
          (tag) =>
            tag.toLowerCase().replace("#", "") === tagName ||
            tag.toLowerCase().includes(tagName)
        );
      });

      // share 개수 가져오기
      const postIds = filtered.map((post) => post.id);
      const shareCounts = await getShareCounts(postIds);

      return filtered.map((post) => ({
        ...post,
        tagList: post.tag_list || [],
        shareCount: shareCounts[post.id] || 0,
        deadlineDisplay: formatDeadline(
          post.created_at,
          post.deadline,
          post.category
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
        console.error("Posts 검색 오류:", error);
        return [];
      }

      // share 개수 가져오기
      const postIds = data.map((post) => post.id);
      const shareCounts = await getShareCounts(postIds);

      return data.map((post) => ({
        ...post,
        tagList: post.tag_list || [],
        shareCount: shareCounts[post.id] || 0,
        deadlineDisplay: formatDeadline(
          post.created_at,
          post.deadline,
          post.category
        ),
      }));
    }
  } catch (err) {
    console.error("Posts 검색 예외:", err);
    return [];
  }
}

/**
 * Post 생성
 */
export async function createPost(postData) {
  try {
    // 현재 사용자 세션 가져오기
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { data, error } = await supabase
      .from("posts")
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
      console.error("Post 생성 오류:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Post 생성 예외:", err);
    throw err;
  }
}

/**
 * 모든 post ID 가져오기 (정적 생성용)
 */
export async function getAllPostIds() {
  try {
    const { data, error } = await supabase.from("posts").select("id");

    if (error) {
      console.error("Post IDs 가져오기 오류:", error);
      return [];
    }

    return data.map((post) => post.id);
  } catch (err) {
    console.error("Post IDs 가져오기 예외:", err);
    return [];
  }
}

/**
 * Post에 share 추가
 */
export async function addShare(postId, userId) {
  try {
    const { data, error } = await supabase
      .from("shares")
      .insert({
        post_id: postId,
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
export async function removeShare(postId, userId) {
  try {
    const { error } = await supabase
      .from("shares")
      .delete()
      .eq("post_id", postId)
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
export async function hasUserShared(postId, userId) {
  try {
    const { data, error } = await supabase
      .from("shares")
      .select("id")
      .eq("post_id", postId)
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
 * 사용자가 공유한 게시글 목록 가져오기
 */
export async function getUserSharedPosts(userId) {
  try {
    const { data, error } = await supabase
      .from("shares")
      .select(
        `
        post_id,
        created_at,
        posts (*)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("공유한 게시글 가져오기 오류:", error);
      return [];
    }

    // share 개수 가져오기
    const postIds = data.map((share) => share.post_id);
    const shareCounts = await getShareCounts(postIds);

    return data
      .filter((share) => share.posts)
      .map((share) => ({
        ...share.posts,
        tagList: share.posts.tag_list || [],
        shareCount: shareCounts[share.post_id] || 0,
        sharedAt: share.created_at,
        deadlineDisplay: formatDeadline(
          share.posts.created_at,
          share.posts.deadline,
          share.posts.category
        ),
      }));
  } catch (err) {
    console.error("공유한 게시글 가져오기 예외:", err);
    return [];
  }
}

/**
 * 관심있는 글 추가
 */
export async function addFavorite(postId, userId) {
  try {
    const { data, error } = await supabase
      .from("favorites")
      .insert({
        post_id: postId,
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
export async function removeFavorite(postId, userId) {
  try {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("post_id", postId)
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
export async function getUserFavorites(userId) {
  try {
    const { data, error } = await supabase
      .from("favorites")
      .select(
        `
        post_id,
        created_at,
        posts (*)
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
      console.error("관심있는 글 가져오기 오류:", error);
      return [];
    }

    // share 개수 가져오기
    const postIds = data.map((fav) => fav.post_id);
    const shareCounts = await getShareCounts(postIds);

    return data
      .filter((fav) => fav.posts)
      .map((fav) => ({
        ...fav.posts,
        tagList: fav.posts.tag_list || [],
        shareCount: shareCounts[fav.post_id] || 0,
        favoritedAt: fav.created_at,
        deadlineDisplay: formatDeadline(
          fav.posts.created_at,
          fav.posts.deadline,
          fav.posts.category
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
export async function hasUserFavorited(postId, userId) {
  try {
    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("post_id", postId)
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
export async function publishToPopular(postId, userId) {
  try {
    // 먼저 해당 게시글이 현재 사용자의 것인지 확인 (선택사항)
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id, category")
      .eq("id", postId)
      .single();

    if (postError || !post) {
      console.error("게시글 찾기 오류:", postError);
      return {
        success: false,
        error: postError || new Error("게시글을 찾을 수 없습니다."),
      };
    }

    // 카테고리를 popular로 변경
    const { data, error } = await supabase
      .from("posts")
      .update({ category: "popular" })
      .eq("id", postId)
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
