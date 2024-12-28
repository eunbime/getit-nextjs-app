import getCurrentUser from "@/app/actions/getCurrentUser";
import getProductsByUserId from "@/app/actions/getProductsByUserId";
import UserPosts from "@/components/posts/UserPosts";

export default async function UserPostsPage() {
  const currentUser = await getCurrentUser();

  const products = await getProductsByUserId(currentUser?.id as string);

  return (
    <section className="flex-1 p-8">
      <h1 className="text-2xl font-semibold mb-8">내 게시물</h1>
      <UserPosts products={products} currentUser={currentUser} />
    </section>
  );
}
