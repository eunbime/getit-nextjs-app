import { useCallback, useEffect, useState } from "react";

const MAX_RECENT_SEARCHES = 5;
const STORAGE_KEY = "recentSearches";

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const savedSearches = localStorage.getItem(STORAGE_KEY);
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const saveRecentSearch = useCallback(
    (search: string) => {
      if (!search.trim()) {
        return;
      }

      const updatedSearches = [
        search,
        ...recentSearches.filter((s) => s !== search),
      ].slice(0, MAX_RECENT_SEARCHES);

      setRecentSearches(updatedSearches);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSearches));
    },
    [recentSearches]
  );

  return {
    recentSearches,
    saveRecentSearch,
  };
};
