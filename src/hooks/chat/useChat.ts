import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useChat = () => {
  return useQuery({
    queryKey: ["chat"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/chat`);
      return data;
    },
  });
};
