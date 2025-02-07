import Link from "next/link";

const ProfileSidebar = () => {
  return (
    <nav className="md:w-64 min-h-[20px] w-full md:min-h-screen border-r bg-gray-100 pt-16">
      <div className="py-4">
        <h2 className="text-lg font-semibold px-6">마이페이지</h2>
        <hr className="my-4" />
        <div className="flex md:flex-col gap-3 md:gap-1 items-center md:items-start space-x-0 md:space-y-2 px-6">
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
