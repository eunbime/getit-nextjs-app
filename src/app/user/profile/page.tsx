import getCurrentUser from "@/app/actions/getCurrentUser";
import { Label } from "@/components/ui/label";
import UserImage from "@/components/profile/UserImage";
import UserName from "@/components/profile/UserName";
export default async function Profile() {
  const currentUser = await getCurrentUser();

  return (
    <section className="flex-1 p-8">
      <h1 className="text-2xl font-semibold mb-8">내 정보</h1>

      <div className="grid gap-8 max-w-2xl">
        <UserImage currentUser={currentUser} />

        <div className="space-y-4">
          <UserName currentUser={currentUser} />

          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <p>{currentUser?.email}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
