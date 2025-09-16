import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStorage";

interface SearchHistoryItem {
  id: string;
  query: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  searchedAt: number;
}

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useLocalStorage<
    SearchHistoryItem[]
  >("search-history", []);
  
  const queryClient  = useQueryClient();

  const historyQuery =useQuery({
    queryKey: ["search-history"],
    queryFn: () => searchHistory,
    initialData: searchHistory,
   
  });

  const addHistory = useMutation({
    mutationFn: async (newSearchData: Omit<SearchHistoryItem, "id" | "searchedAt">) => {
        const newSearch: SearchHistoryItem = {
            ...newSearchData,
            id: `${newSearchData.lat}-${newSearchData.lon}-${Date.now()}`,
            searchedAt: Date.now(),
        };

        const filteredHistory = searchHistory.filter(
            (item: any) => !(item.lat === newSearch.lat && item.lon === newSearch.lon)
        );

        const newHistory = [newSearch, ...filteredHistory].splice(0, 10);
        setSearchHistory(newHistory);
        return newHistory;
    },
onSuccess : (newHistory) => {
    queryClient.setQueryData(["search-history"], newHistory);
}
  })

  const clearHistory = useMutation({
    mutationFn: async () => {
      setSearchHistory([]);
      return [];
    },
onSuccess : ( ) => {
    queryClient.setQueryData(["search-history"], []);
}
  })
  
  return {
    history: historyQuery.data??[],
    addHistory,
    clearHistory,
  };
}
