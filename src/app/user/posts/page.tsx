import getCurrentUser from "@/app/actions/getCurrentUser";
import UserPosts from "@/components/posts/UserPosts";

export const dynamic = "force-dynamic";

export default async function UserPostsPage() {
  const currentUser = await getCurrentUser();

  return (
    <section className="flex-1 p-8">
      <h1 className="text-2xl font-semibold mb-8">내 게시물</h1>
      <UserPosts currentUser={currentUser} />
    </section>
  );
}
