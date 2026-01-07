import { getPostById, getAllPostIds } from "@/utils/posts";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import DetailContent from "@/components/DetailContent";

export async function generateStaticParams() {
  const postIds = await getAllPostIds();
  return postIds.map((id) => ({
    id: id.toString(),
  }));
}

export default async function DetailPage({ params }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  const tagList = post.tagList || post.tags.split(" ");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DetailContent post={post} tagList={tagList} />
    </div>
  );
}
