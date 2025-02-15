import FavoritesList from "@/components/favorites/FavoriteList";

export const dynamic = "force-dynamic";

const FavoritesPage = async () => {
  return (
    // section 부분은 모두 중복되어 layout으로 배치해도 가능할 듯 
    <section className="flex-1 p-8 md:pt-16">
      <h1 className="text-2xl font-semibold py-3">관심 목록</h1>
      <FavoritesList />
    </section>
  );
};

export default FavoritesPage;
