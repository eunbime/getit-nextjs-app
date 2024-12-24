import getCurrentUser from "@/app/actions/getCurrentUser";
import EmptyState from "@/components/EmptyState";
import FavoritesList from "@/components/favorites/FavoriteList";

const FavoritesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title="로그인이 필요합니다" />;
  }

  return <FavoritesList currentUser={currentUser} />;
};

export default FavoritesPage;
