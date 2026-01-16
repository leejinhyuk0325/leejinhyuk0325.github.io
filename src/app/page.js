"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SerialSection from "@/components/SerialSection";
import {
  getPopularSerials,
  getTodayDeadlineSerials,
  getPaidSeriesSerials,
  getSerialPosts,
  movePopularToSerial,
  moveSerialToPaid,
} from "@/utils/serials";

export default function Home() {
  const [popularSerials, setPopularSerials] = useState([]);
  const [todayDeadline, setTodayDeadline] = useState([]);
  const [paidSeries, setPaidSeries] = useState([]);
  const [serialSerials, setSerialSerials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 연재도전 게시글 중 공유 조건 충족된 것을 연재시작코너로 이동
        await movePopularToSerial();

        // 연재시작코너 게시글 중 공유 1000회 이상, 게시글 10개 이상인 것을 유료연재코너로 이동
        await moveSerialToPaid();

        // 모든 데이터 가져오기
        const [popular, deadline, paid, serial] = await Promise.all([
          getPopularSerials(),
          getTodayDeadlineSerials(),
          getPaidSeriesSerials(),
          getSerialPosts(),
        ]);

        setPopularSerials(popular);
        setTodayDeadline(deadline);
        setPaidSeries(paid);
        setSerialSerials(serial);
      } catch (error) {
        console.error("데이터 로드 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">로딩 중...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SerialSection
          title="연재시작코너"
          serials={serialSerials}
          variant="default"
          gridCols="md:grid-cols-2 lg:grid-cols-3"
          initialCount={3}
        />

        <SerialSection
          title="연재도전"
          serials={popularSerials}
          variant="default"
          gridCols="md:grid-cols-2 lg:grid-cols-3"
          initialCount={3}
        />

        <SerialSection
          title="오늘 마감"
          serials={todayDeadline}
          variant="urgent"
          gridCols="md:grid-cols-2 lg:grid-cols-3"
          initialCount={3}
        />

        <SerialSection
          title="유료연재코너"
          serials={paidSeries}
          variant="paid"
          gridCols="md:grid-cols-2 lg:grid-cols-3"
          initialCount={3}
        />
      </main>

      <Footer />
    </div>
  );
}
