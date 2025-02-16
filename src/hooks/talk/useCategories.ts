import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getCategories = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
    );
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("카테고리를 불러오는 중 오류가 발생했습니다.");
  }
};

export const useCategories = () => {
  try {
    return useQuery({
      queryKey: ["categories"],
      queryFn: async () => {
        const { data } = await axios.get("/api/categories");
        return data;
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("카테고리를 불러오는 중 오류가 발생했습니다.");
  }
};
