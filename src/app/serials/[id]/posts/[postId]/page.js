import PostDetailContentWrapper from "./PostDetailContentWrapper";

export async function generateStaticParams() {
  // 중첩된 동적 라우트의 경우 모든 파라미터 조합을 반환해야 함
  // serial ID: 1부터 300까지
  // post ID: 1부터 100까지
  const serialIds = Array.from({ length: 50 }, (_, i) => i + 1);
  const postIds = Array.from({ length: 50 }, (_, i) => i + 1);

  // 모든 조합 생성 (serialId와 postId의 모든 조합)
  return serialIds.flatMap((serialId) =>
    postIds.map((postId) => ({
      id: serialId.toString(),
      postId: postId.toString(),
    }))
  );
}

export default function PostDetailPage() {
  return <PostDetailContentWrapper />;
}
