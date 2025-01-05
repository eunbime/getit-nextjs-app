import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";

import { Product } from "@prisma/client";

export const useSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [searchProducts, setSearchProducts] = useState<Product[]>([]);

  const searchProductsByKeyword = useCallback(async (value: string) => {
    if (!value.trim()) {
      setSearchProducts([]);
      return;
    }

    try {
      const { data } = await axios.get(
        `/api/search?keyword=${encodeURIComponent(value)}`
      );
      setSearchProducts(data);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("검색 중 오류가 발생했습니다");
      setSearchProducts([]);
    }
  }, []);

  const debouncedSearch = useMemo(
    () => debounce(searchProductsByKeyword, 500),
    [searchProducts]
  );

  return {
    keyword,
    setKeyword,
    searchProducts,
    debouncedSearch,
    searchProductsByKeyword,
  };
};
