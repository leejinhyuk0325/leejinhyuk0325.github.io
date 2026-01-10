import QADetailClient from "./QADetailClient";

export async function generateStaticParams() {
  return [];
}

export default async function QADetailPage({ params }) {
  const { id } = await params;
  return <QADetailClient questionId={id} />;
}
