import { supabase } from "@/utils/supabase";
import QADetailClient from "./QADetailClient";

// output: export 모드에서 동적 라우트를 사용하기 위해 필요
export async function generateStaticParams() {
  try {
    // 모든 질문 ID 가져오기
    const { data, error } = await supabase
      .from("qa_questions")
      .select("id")
      .limit(1000); // 최대 1000개까지

    if (error) {
      console.error("질문 ID 가져오기 오류:", error);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((question) => ({
        id: question.id.toString(),
      }));
    }

    // 질문이 없거나 오류 발생 시 빈 배열 반환
    return [];
  } catch (error) {
    console.error("generateStaticParams 오류:", error);
    // 오류 발생 시 빈 배열 반환 (클라이언트 사이드 라우팅으로 처리)
    return [];
  }
}

export default async function QADetailPage({ params }) {
  const { id } = await params;
  return <QADetailClient questionId={id} />;
}
