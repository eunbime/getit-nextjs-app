import SearchForm from "@/components/search/SearchForm";

export const dynamic = "force-dynamic";

export default async function Search() {
  return (
    <div className="flex flex-col items-center h-screen w-full py-10">
      <SearchForm />
    </div>
  );
}
