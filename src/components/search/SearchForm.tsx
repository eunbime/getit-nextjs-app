"use client";

import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { IoSearch } from "react-icons/io5";

import { Product, User } from "@prisma/client";
import ProductCard from "../products/ProductCard";

interface SearchFormProps {
  currentUser: User | null;
}

const SearchForm = ({ currentUser }: SearchFormProps) => {
  const [keyword, setKeyword] = useState("");
  const [searchProducts, setSearchProducts] = useState<Product[]>([]);

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
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    debouncedSearch(value);
  };

  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center w-1/2 border-2 border-gray-300 rounded-md p-2 mb-4"
      >
        <IoSearch className="text-2xl mr-2" />
        <input
          placeholder="검색어를 입력해주세요"
          className="outline-none"
          value={keyword}
          onChange={handleChange}
        />
      </form>
      <div className="grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {searchProducts?.map((product: any) => (
          <ProductCard
            key={product.id}
            data={product}
            currentUser={currentUser}
          />
        ))}
      </div>
    </>
  );
};

export default SearchForm;
