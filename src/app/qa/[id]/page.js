import QAQuestionContent from "./QAQuestionContent";

export async function generateStaticParams() {
  // 1부터 50까지의 ID를 미리 생성
  const ids = Array.from({ length: 100 }, (_, i) => i + 1);
  return ids.map((id) => ({
    id: id.toString(),
  }));
}

export default function QAQuestionPage() {
  return <QAQuestionContent />;
}
