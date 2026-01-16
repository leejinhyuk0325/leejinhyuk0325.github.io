"use client";

import { useState } from "react";
import SerialCard from "./SerialCard";

export default function SerialSection({
  title,
  serials,
  variant = "default",
  gridCols = "md:grid-cols-2 lg:grid-cols-3",
  initialCount = 3,
}) {
  const [displayCount, setDisplayCount] = useState(initialCount);
  const displayedSerials = serials.slice(0, displayCount);
  const hasMore = serials.length > displayCount;

  const handleShowMore = () => {
    setDisplayCount((prev) => Math.min(prev + 3, serials.length));
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
        {displayedSerials.map((serial, index) => (
          <SerialCard
            key={serial.id || index}
            serial={serial}
            variant={variant}
          />
        ))}
      </div>
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={handleShowMore}
            className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            더보기 ({serials.length - displayCount}개 더)
          </button>
        </div>
      )}
    </section>
  );
}
