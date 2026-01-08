import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostSection from "@/components/PostSection";
import {
  getPopularPosts,
  getTodayDeadlinePosts,
  getPaidSeriesPosts,
} from "@/utils/posts";

export default async function Home() {
  const [popularPosts, todayDeadline, paidSeries] = await Promise.all([
    getPopularPosts(),
    getTodayDeadlinePosts(),
    getPaidSeriesPosts(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostSection
          title="연재도전"
          posts={popularPosts}
          variant="default"
          gridCols="md:grid-cols-2 lg:grid-cols-3"
          initialCount={3}
        />

        <PostSection
          title="오늘 마감"
          posts={todayDeadline}
          variant="urgent"
          gridCols="md:grid-cols-2 lg:grid-cols-3"
          initialCount={3}
        />

        <PostSection
          title="유료연재코너"
          posts={paidSeries}
          variant="paid"
          gridCols="md:grid-cols-2 lg:grid-cols-3"
          initialCount={3}
        />
      </main>

      <Footer />
    </div>
  );
}
