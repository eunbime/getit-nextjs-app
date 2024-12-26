import Link from "next/link";

const ProfileSidebar = () => {
  return (
    <nav className="w-64 min-h-screen border-r bg-gray-100">
      <div className="py-4 px-6">
        <h2 className="text-lg font-semibold mb-6">마이페이지</h2>
        <div className="space-y-2">
          <Link
            href="/user/favorites"
            className="block text-sm text-gray-600 hover:text-gray-900"
          >
            관심 목록
          </Link>
          <Link
            href="/user/posts"
            className="block text-sm text-gray-600 hover:text-gray-900"
          >
            내 게시물
          </Link>
          <Link
            href="/user/profile"
            className="block text-sm text-gray-600 hover:text-gray-900"
          >
            내 정보
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default ProfileSidebar;
