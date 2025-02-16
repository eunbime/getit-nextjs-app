import UserProducts from "@/components/products/UserPosts";

export default async function UserPostsPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold py-3">내 게시물</h1>
      <UserProducts />
    </section>
  );
}
