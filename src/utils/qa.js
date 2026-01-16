import { supabase } from "./supabase";

/**
 * QA 카테고리 목록 조회 (각 카테고리별 질문 개수 포함)
 */
export async function getQACategories() {
  try {
    // 카테고리 목록 조회
    const { data: categories, error: categoriesError } = await supabase
      .from("qa_categories")
      .select("*")
      .order("id", { ascending: true });

    if (categoriesError) {
      console.error("카테고리 조회 오류:", categoriesError);
      return [];
    }

    // 각 카테고리별 질문 개수 조회
    const { data: questions, error: questionsError } = await supabase
      .from("qa_questions")
      .select("category");

    if (questionsError) {
      console.error("질문 개수 조회 오류:", questionsError);
    }

    // 카테고리별 질문 개수 계산
    const categoryCounts = {};
    if (questions) {
      questions.forEach((q) => {
        const categoryName = q.category;
        categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
      });
    }

    // 전체 개수 계산
    const totalCount = questions ? questions.length : 0;

    // 카테고리 데이터에 count 추가
    const categoriesWithCount = categories.map((cat) => ({
      id: cat.id.toString(),
      name: cat.name,
      count: categoryCounts[cat.name] || 0,
    }));

    // "전체" 카테고리 추가 (id: "all")
    return [
      { id: "all", name: "전체", count: totalCount },
      ...categoriesWithCount,
    ];
  } catch (error) {
    console.error("QA 카테고리 조회 중 오류:", error);
    return [];
  }
}

/**
 * FAQ 목록 조회
 */
export async function getQAFaqs(limit = 4) {
  try {
    const { data, error } = await supabase
      .from("qa_faqs")
      .select("*")
      .order("views", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("FAQ 조회 오류:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("FAQ 조회 중 오류:", error);
    return [];
  }
}

/**
 * QA 질문 목록 조회
 */
export async function getQAQuestions(options = {}) {
  try {
    const {
      category = null,
      limit = 20,
      offset = 0,
      orderBy = "created_at",
      orderDirection = "desc",
    } = options;

    let query = supabase.from("qa_questions").select("*");

    // 카테고리 필터링
    if (category && category !== "all") {
      // 카테고리 ID로 필터링하려면 카테고리 이름을 먼저 조회해야 함
      const { data: categoryData } = await supabase
        .from("qa_categories")
        .select("name")
        .eq("id", parseInt(category))
        .single();

      if (categoryData) {
        query = query.eq("category", categoryData.name);
      }
    }

    // 정렬
    query = query.order(orderBy, { ascending: orderDirection === "asc" });

    // 페이지네이션
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error("질문 조회 오류:", error);
      return [];
    }

    // 데이터 형식 변환 (date 필드 추가)
    return (data || []).map((question) => ({
      ...question,
      date: question.created_at
        ? new Date(question.created_at).toISOString().split("T")[0]
        : "",
      isSolved: question.is_solved,
      isUrgent: question.is_urgent,
    }));
  } catch (error) {
    console.error("질문 조회 중 오류:", error);
    return [];
  }
}

/**
 * QA 질문 총 개수 조회
 */
export async function getQAQuestionsCount(category = null) {
  try {
    let query = supabase.from("qa_questions").select("*", { count: "exact", head: true });

    if (category && category !== "all") {
      const { data: categoryData } = await supabase
        .from("qa_categories")
        .select("name")
        .eq("id", parseInt(category))
        .single();

      if (categoryData) {
        query = query.eq("category", categoryData.name);
      }
    }

    const { count, error } = await query;

    if (error) {
      console.error("질문 개수 조회 오류:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("질문 개수 조회 중 오류:", error);
    return 0;
  }
}
