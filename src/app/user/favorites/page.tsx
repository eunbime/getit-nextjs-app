import FavoritesList from "@/components/favorites/FavoriteList";

const FavoritesPage = async () => {
  return (
    <section>
      <h1 className="text-2xl font-semibold py-3">관심 목록</h1>
      <FavoritesList />
    </section>
  );
};

export default FavoritesPage;
