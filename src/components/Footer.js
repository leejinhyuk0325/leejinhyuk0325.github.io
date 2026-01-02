import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center justify-center space-x-8">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            홈
          </Link>
          <Link
            href="/notice"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            공지사항
          </Link>
          <Link
            href="/community"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            커뮤니티
          </Link>
          <button className="text-gray-600 hover:text-gray-900 font-medium">
            마이페이지
          </button>
        </nav>
      </div>
    </footer>
  );
}
