import { getAllCommunityPostIds } from "@/utils/community";
import CommunityPostContent from "./CommunityPostContent";

export async function generateStaticParams() {
  const postIds = await getAllCommunityPostIds();
  return postIds.map((id) => ({
    id: id.toString(),
  }));
}

export default function CommunityPostPage() {
  return <CommunityPostContent />;
}
