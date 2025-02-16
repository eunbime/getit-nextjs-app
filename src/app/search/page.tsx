import SearchForm from "@/components/search/SearchForm";

export default async function Search() {
  return (
    <div className="flex flex-col items-center h-screen w-full py-10 pt-24">
      <SearchForm />
    </div>
  );
}
