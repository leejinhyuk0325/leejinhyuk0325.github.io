import CommunityPostContent from "./CommunityPostContent";

export async function generateStaticParams() {
  // 1부터 1000까지의 ID를 미리 생성
  const ids = Array.from({ length: 1000 }, (_, i) => i + 1);
  return ids.map((id) => ({
    id: id.toString(),
  }));
}

export default function CommunityPostPage() {
  return <CommunityPostContent />;
}
