"use client";

import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";

import { Product, User } from "@prisma/client";
import ProductCard from "@/components/products/ProductCard";
import EmptyState from "@/components/EmptyState";

interface SearchFormProps {
  currentUser: User | null;
}

const SearchForm = ({ currentUser }: SearchFormProps) => {
  const [keyword, setKeyword] = useState("");
  const [searchProducts, setSearchProducts] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saveSearches = localStorage.getItem("recentSearches");
    if (saveSearches) {
      setRecentSearches(JSON.parse(saveSearches));
    }
  }, []);

  const saveRecentSearch = (search: string) => {
    if (!search.trim()) return;

    const updatedSearches = [
      search,
      ...recentSearches.filter((s) => s !== search),
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      if (!value) {
        setSearchProducts([]);
        return;
      }
      try {
        const { data } = await axios.get(`/api/search?keyword=${value}`);
        setSearchProducts(data);
      } catch (error) {
        console.error("Search error:", error);
        setSearchProducts([]);
      }
    }, 500),
    [recentSearches]
  );

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

    try {
      const { data } = await axios.get(`/api/search?keyword=${keyword}`);
      setSearchProducts(data);
      saveRecentSearch(keyword); // submit 시에만 검색어 저장
    } catch (error) {
      console.error("Search error:", error);
      setSearchProducts([]);
    }
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
          <ProductCard
            key={product.id}
            data={product}
            currentUser={currentUser}
          />
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
