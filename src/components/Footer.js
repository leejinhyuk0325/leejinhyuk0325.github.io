export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center justify-center space-x-8">
          <button className="text-gray-600 hover:text-gray-900 font-medium">
            홈
          </button>
          <button className="text-gray-600 hover:text-gray-900 font-medium">
            공지사항
          </button>
          <button className="text-gray-600 hover:text-gray-900 font-medium">
            커뮤니티
          </button>
          <button className="text-gray-600 hover:text-gray-900 font-medium">
            마이페이지
          </button>
        </nav>
      </div>
    </footer>
  );
}

