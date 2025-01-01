import getCurrentUser from "@/app/actions/getCurrentUser";
import EmptyState from "@/components/EmptyState";
import FavoritesList from "@/components/favorites/FavoriteList";

export const dynamic = "force-dynamic";

const FavoritesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title="로그인이 필요합니다" />;
  }

  return (
    <section className="flex-1 p-8">
      <h1 className="text-2xl font-semibold mb-8">관심 목록</h1>
      <FavoritesList currentUser={currentUser} />
    </section>
  );
};

export default FavoritesPage;
