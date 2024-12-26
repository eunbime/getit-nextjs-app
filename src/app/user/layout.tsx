import ProfileSidebar from "@/components/profile/ProfileSidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1">
      <ProfileSidebar />
      {children}
    </div>
  );
}
