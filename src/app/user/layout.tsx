import ProfileSidebar from "@/components/profile/ProfileSidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex md:flex-row flex-col">
      <ProfileSidebar />
      <div className="flex-1 p-8 md:pt-16">{children}</div>
    </div>
  );
}
