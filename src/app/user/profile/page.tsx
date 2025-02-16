import getCurrentUser from "@/app/actions/getCurrentUser";
import { Label } from "@/components/ui/label";
import UserImage from "@/components/profile/UserImage";
import UserName from "@/components/profile/UserName";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "GET!T 중고거래 마켓 마이페이지입니다.",
};

export default async function Profile() {
  const currentUser = await getCurrentUser();

  return (
    <section>
      <h1 className="text-2xl font-semibold py-3">내 정보</h1>

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
