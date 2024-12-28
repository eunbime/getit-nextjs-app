import getCurrentUser from "@/app/actions/getCurrentUser";
import UpdateName from "@/components/profile/UpdataName";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default async function Profile() {
  const currentUser = await getCurrentUser();

  return (
    <section className="flex-1 p-8">
      <h1 className="text-2xl font-semibold mb-8">내 정보</h1>

      <div className="grid gap-8 max-w-2xl">
        <div className="w-48 h-48 bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg"
            alt="Profile"
            width={192}
            height={192}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <UpdateName currentUser={currentUser} />

          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <p>{currentUser?.email}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
