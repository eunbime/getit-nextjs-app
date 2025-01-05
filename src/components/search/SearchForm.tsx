"use client";

import { IoSearch } from "react-icons/io5";

import { useRecentSearches } from "@/hooks/search/useRecentSearches";
import { useSearch } from "@/hooks/search/useSearch";
import ProductCard from "@/components/products/ProductCard";
import EmptyState from "@/components/EmptyState";

const SearchForm = () => {
  const {
    keyword,
    setKeyword,
    searchProducts,
    debouncedSearch,
    searchProductsByKeyword,
  } = useSearch();

  const { recentSearches, saveRecentSearch } = useRecentSearches();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    debouncedSearch(value);
  };

  const handleRecentSearchClick = (search: string) => {
    setKeyword(search);
    debouncedSearch(search);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    await searchProductsByKeyword(keyword);
    saveRecentSearch(keyword);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-[90%] md:w-1/2 border-2 border-gray-300 rounded-md p-2 mb-4"
      >
        <IoSearch className="text-2xl mr-2" />
        <input
          placeholder="검색어를 입력해주세요"
          className="outline-none"
          value={keyword}
          onChange={handleChange}
        />
      </form>

      {/* 최근 검색어 표시 */}
      {recentSearches.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 items-center px-5">
          <span className="text-sm text-gray-500">최근 검색어:</span>
          {recentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => handleRecentSearchClick(search)}
              className="text-sm bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1"
            >
              {search}
            </button>
          ))}
        </div>
      )}

      <div className="w-full px-10 grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {searchProducts?.map((product: any) => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
      {searchProducts.length === 0 && (
        <EmptyState
          title="검색 결과가 없습니다"
          subtitle="다른 검색어를 시도해보세요"
        />
      )}
    </>
  );
};

export default SearchForm;
