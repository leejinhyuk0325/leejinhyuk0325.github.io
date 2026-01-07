import { supabase } from "./supabase";

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

    // tagList를 배열로 변환하고 shareCount 추가
    return data.map((post) => ({
      ...post,
      tagList: post.tag_list || [],
      shareCount: shareCounts[post.id] || 0,
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
    }));
  } catch (err) {
    console.error("카테고리별 posts 가져오기 예외:", err);
    return [];
  }
}

/**
 * 인기글 가져오기
 */
export async function getPopularPosts() {
  return getPostsByCategory("popular");
}

/**
 * 오늘 마감 posts 가져오기
 */
export async function getTodayDeadlinePosts() {
  return getPostsByCategory("deadline");
}

/**
 * 유료연재 posts 가져오기
 */
export async function getPaidSeriesPosts() {
  return getPostsByCategory("paid");
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
      }));
    }
  } catch (err) {
    console.error("Posts 검색 예외:", err);
    return [];
  }
}

/**
 * 모든 post ID 가져오기 (정적 생성용)
 */
export async function getAllPostIds() {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("id");

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

