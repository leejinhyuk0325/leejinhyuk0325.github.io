import PostCard from "./PostCard";

export default function PostSection({ title, posts, variant = "default", gridCols = "md:grid-cols-2 lg:grid-cols-3" }) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <button className="text-blue-600 hover:text-blue-700 font-medium">
          더보기
        </button>
      </div>
      <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
        {posts.map((post, index) => (
          <PostCard key={index} post={post} variant={variant} />
        ))}
      </div>
    </section>
  );
}

