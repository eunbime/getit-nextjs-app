import SearchForm from "@/components/search/SearchForm";
import getCurrentUser from "../actions/getCurrentUser";

export default async function Search() {
  const currentUser = await getCurrentUser();
  return (
    <div className="flex flex-col items-center h-screen w-full py-10">
      <SearchForm currentUser={currentUser} />
    </div>
  );
}
