import { supabase } from "./supabase";

/**
 * 커뮤니티 카테고리 목록 가져오기
 */
export async function getCommunityCategories() {
  try {
    const { data: categories, error: categoriesError } = await supabase
      .from("community_categories")
      .select("*")
      .order("id");

    if (categoriesError) {
      console.error("커뮤니티 카테고리 가져오기 오류:", categoriesError);
      return [];
    }

    // 전체 게시글 수 가져오기
    const { count: totalCount } = await supabase
      .from("community_posts")
      .select("*", { count: "exact", head: true });

    // 각 카테고리별 게시글 수 가져오기
    const { data: postsByCategory, error: postsError } = await supabase
      .from("community_posts")
      .select("category_id");

    if (postsError) {
      console.error("커뮤니티 게시글 카운트 가져오기 오류:", postsError);
    }

    // 카테고리별 개수 계산
    const categoryCounts = {};
    if (postsByCategory) {
      postsByCategory.forEach((post) => {
        categoryCounts[post.category_id] =
          (categoryCounts[post.category_id] || 0) + 1;
      });
    }

    // 카테고리에 개수 추가
    return categories.map((category) => ({
      ...category,
      count:
        category.id === "all"
          ? totalCount || 0
          : categoryCounts[category.id] || 0,
    }));
  } catch (err) {
    console.error("커뮤니티 카테고리 가져오기 예외:", err);
    return [];
  }
}

/**
 * 커뮤니티 게시글 목록 가져오기
 * @param {string} categoryId - 카테고리 ID (선택사항, 'all'이면 전체)
 */
export async function getCommunityPosts(categoryId = "all") {
  try {
    let query = supabase
      .from("community_posts")
      .select(`
        *,
        community_categories (
          id,
          name
        )
      `)
      .order("created_at", { ascending: false });

    // 카테고리 필터링
    if (categoryId && categoryId !== "all") {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("커뮤니티 게시글 가져오기 오류:", error);
      return [];
    }

    // 데이터 포맷팅
    return data.map((post) => ({
      id: post.id,
      category: post.community_categories?.name || "",
      categoryId: post.category_id,
      title: post.title,
      author: post.author,
      date: new Date(post.created_at).toISOString().split("T")[0],
      views: post.views || 0,
      likes: post.likes || 0,
      comments: post.comments || 0,
      isHot: post.is_hot || false,
      content: post.content || "",
    }));
  } catch (err) {
    console.error("커뮤니티 게시글 가져오기 예외:", err);
    return [];
  }
}

/**
 * 모든 커뮤니티 게시글 ID 가져오기 (정적 생성용)
 */
export async function getAllCommunityPostIds() {
  try {
    const { data, error } = await supabase
      .from("community_posts")
      .select("id");

    if (error) {
      console.error("커뮤니티 게시글 IDs 가져오기 오류:", error);
      return [];
    }

    return data.map((post) => post.id);
  } catch (err) {
    console.error("커뮤니티 게시글 IDs 가져오기 예외:", err);
    return [];
  }
}

/**
 * 커뮤니티 게시글 ID로 가져오기
 */
export async function getCommunityPostById(id) {
  try {
    const { data, error } = await supabase
      .from("community_posts")
      .select(`
        *,
        community_categories (
          id,
          name
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("커뮤니티 게시글 가져오기 오류:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    // 조회수 증가
    await supabase
      .from("community_posts")
      .update({ views: (data.views || 0) + 1 })
      .eq("id", id);

    // 데이터 포맷팅
    return {
      id: data.id,
      category: data.community_categories?.name || "",
      categoryId: data.category_id,
      title: data.title,
      author: data.author,
      content: data.content || "",
      date: new Date(data.created_at).toISOString().split("T")[0],
      views: (data.views || 0) + 1,
      likes: data.likes || 0,
      comments: data.comments || 0,
      isHot: data.is_hot || false,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (err) {
    console.error("커뮤니티 게시글 가져오기 예외:", err);
    return null;
  }
}

/**
 * 커뮤니티 게시글 검색
 */
export async function searchCommunityPosts(searchQuery, searchType = "title") {
  try {
    if (!searchQuery || !searchQuery.trim()) {
      return [];
    }

    let query = supabase
      .from("community_posts")
      .select(`
        *,
        community_categories (
          id,
          name
        )
      `)
      .order("created_at", { ascending: false });

    const searchTerm = searchQuery.trim().toLowerCase();

    // 검색 타입에 따라 필터링
    if (searchType === "title") {
      query = query.ilike("title", `%${searchTerm}%`);
    } else if (searchType === "content") {
      query = query.ilike("content", `%${searchTerm}%`);
    } else if (searchType === "author") {
      query = query.ilike("author", `%${searchTerm}%`);
    } else if (searchType === "title_content") {
      query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("커뮤니티 게시글 검색 오류:", error);
      return [];
    }

    // 데이터 포맷팅
    return data.map((post) => ({
      id: post.id,
      category: post.community_categories?.name || "",
      categoryId: post.category_id,
      title: post.title,
      author: post.author,
      date: new Date(post.created_at).toISOString().split("T")[0],
      views: post.views || 0,
      likes: post.likes || 0,
      comments: post.comments || 0,
      isHot: post.is_hot || false,
      content: post.content || "",
    }));
  } catch (err) {
    console.error("커뮤니티 게시글 검색 예외:", err);
    return [];
  }
}
