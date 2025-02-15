import Link from "next/link";

// force-dynamic 설정을 한 이유??
// 강제로 매번 새로 만들 필요가 있는지?
export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-gray-500 mb-8">
          죄송합니다. 요청하신 페이지를 찾을 수 없습니다. ㅠ_ㅜ
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
