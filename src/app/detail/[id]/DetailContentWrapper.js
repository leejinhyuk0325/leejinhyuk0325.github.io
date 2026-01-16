"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getSerialById } from "@/utils/serials";
import Header from "@/components/Header";
import DetailContent from "@/components/DetailContent";

export default function DetailContentWrapper() {
  const params = useParams();
  const id = params?.id;
  const [serial, setSerial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) {
        setError("게시글 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const serialData = await getSerialById(id);
        if (serialData) {
          setSerial(serialData);
        } else {
          setError("게시글을 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("게시글 로드 오류:", err);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !serial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">
            {error || "요청하신 포스트를 찾을 수 없습니다."}
          </p>
        </div>
      </div>
    );
  }

  const tagList = serial.tagList || serial.tags?.split(" ") || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DetailContent serial={serial} tagList={tagList} />
    </div>
  );
}
