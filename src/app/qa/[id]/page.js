import QADetailClient from "./QADetailClient";

export async function generateStaticParams() {
  const params = [];
  return params;
}

export default async function QADetailPage({ params }) {
  const { id } = await params;
  return <QADetailClient questionId={id} />;
}
