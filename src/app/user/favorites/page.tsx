import FavoritesList from "@/components/favorites/FavoriteList";

export const dynamic = "force-dynamic";

const FavoritesPage = async () => {
  return (
    <section className="flex-1 p-8">
      <h1 className="text-2xl font-semibold mb-8">관심 목록</h1>
      <FavoritesList />
    </section>
  );
};

export default FavoritesPage;
