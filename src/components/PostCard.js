import Link from "next/link";

export default function PostCard({ post, variant = "default" }) {
  const variantStyles = {
    default: "bg-white",
    urgent: "bg-white border-l-4 border-orange-500",
    paid: "bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200",
  };

  const deadlineColors = {
    default: "text-red-600",
    urgent: "text-orange-600",
    paid: "text-purple-600",
  };

  const badgeColors = {
    default: "bg-blue-100 text-blue-800",
    urgent: "bg-blue-100 text-blue-800",
    paid: "bg-purple-100 text-purple-800",
  };

  return (
    <Link
      href="/detail"
      className={`block ${variantStyles[variant]} rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm font-medium ${deadlineColors[variant]}`}>
          {post.deadline}
        </span>
        <div className="flex items-center space-x-2">
          <span className={`text-xs ${badgeColors[variant]} px-2 py-1 rounded`}>
            {post.apply}
          </span>
          <span className="text-xs text-gray-500">{post.meta}</span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {post.title}
      </h3>
      <p className="text-sm text-gray-600">{post.tags}</p>
    </Link>
  );
}

