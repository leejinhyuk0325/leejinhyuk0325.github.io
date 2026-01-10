import { supabase } from "./supabase";

/**
 * Q&A 질문 작성
 */
export async function createQuestion(title, content, category, authorId) {
  try {
    const { data, error } = await supabase
      .from("qa_questions")
      .insert({
        title,
        content,
        category,
        author_id: authorId,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("질문 작성 오류:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Q&A 질문 목록 가져오기
 */
export async function getQuestions(category = "all", limit = 50, offset = 0) {
  try {
    let query = supabase
      .from("qa_questions")
      .select(
        `
        *,
        author:author_id (
          id,
          email
        )
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // 답변 개수 가져오기
    if (data && data.length > 0) {
      const questionIds = data.map((q) => q.id);
      const { data: answersData } = await supabase
        .from("qa_answers")
        .select("question_id")
        .in("question_id", questionIds);

      const answerCounts = {};
      if (answersData) {
        answersData.forEach((answer) => {
          answerCounts[answer.question_id] =
            (answerCounts[answer.question_id] || 0) + 1;
        });
      }

      // 답변 개수 추가
      data.forEach((question) => {
        question.answers = answerCounts[question.id] || 0;
      });
    }

    return { success: true, data, count: count || 0 };
  } catch (error) {
    console.error("질문 목록 가져오기 오류:", error);
    return { success: false, error: error.message, data: [], count: 0 };
  }
}

/**
 * Q&A 질문 상세 가져오기
 */
export async function getQuestionById(questionId) {
  try {
    const { data, error } = await supabase
      .from("qa_questions")
      .select(
        `
        *,
        author:author_id (
          id,
          email
        )
      `
      )
      .eq("id", questionId)
      .single();

    if (error) throw error;

    // 조회수 증가
    await incrementQuestionViews(questionId);

    // 답변 가져오기
    const { data: answers, error: answersError } = await supabase
      .from("qa_answers")
      .select(
        `
        *,
        author:author_id (
          id,
          email
        )
      `
      )
      .eq("question_id", questionId)
      .order("created_at", { ascending: true });

    if (answersError) {
      console.error("답변 가져오기 오류:", answersError);
    }

    return {
      success: true,
      data: { ...data, answers: answers || [] },
    };
  } catch (error) {
    console.error("질문 상세 가져오기 오류:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Q&A 답변 작성
 */
export async function createAnswer(questionId, content, authorId) {
  try {
    const { data, error } = await supabase
      .from("qa_answers")
      .insert({
        question_id: questionId,
        content,
        author_id: authorId,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("답변 작성 오류:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Q&A 질문 조회수 증가
 */
async function incrementQuestionViews(questionId) {
  try {
    // 현재 조회수 가져오기
    const { data, error: fetchError } = await supabase
      .from("qa_questions")
      .select("views")
      .eq("id", questionId)
      .single();

    if (fetchError) {
      console.error("조회수 가져오기 오류:", fetchError);
      return;
    }

    // 조회수 증가
    const { error } = await supabase
      .from("qa_questions")
      .update({ views: (data.views || 0) + 1 })
      .eq("id", questionId);

    if (error) throw error;
  } catch (error) {
    console.error("조회수 증가 오류:", error);
  }
}
