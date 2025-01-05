import { TProductWithCategory } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFavorites = () => {
  return useQuery<TProductWithCategory[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const { data } = await axios.get("/api/favorites");
      return data;
    },
  });
};
