import { useQuery } from "@tanstack/react-query";
import { mapApiDataToCostRows } from "@/lib/dataMapper";
import { CostRow, DrillLevel } from "@/lib/types";

interface FetchCostDataParams {
  level: DrillLevel;
  parentName?: string;
}

const fetchTitlesFromApi = async (level: DrillLevel): Promise<string[]> => {
  if (level === "cluster") {
    const res = await fetch("https://dummyjson.com/products?limit=4");
    if (!res.ok) throw new Error("Failed to fetch cluster data");
    const data = await res.json();
    return data.products.map((p: { title: string }) => p.title);
  }

  if (level === "namespace") {
    const res = await fetch("https://dummyjson.com/products?limit=4&skip=4");
    if (!res.ok) throw new Error("Failed to fetch namespace data");
    const data = await res.json();
    return data.products.map((p: { title: string }) => p.title);
  }

  // pod level
  const res = await fetch("https://dummyjson.com/products?limit=4&skip=8");
  if (!res.ok) throw new Error("Failed to fetch pod data");
  const data = await res.json();
  return data.products.map((p: { title: string }) => p.title);
};

export const useCostData = ({
  level,
  parentName = "",
}: FetchCostDataParams): {
  data: CostRow[] | undefined;
  isLoading: boolean;
  isError: boolean;
} => {
  const { data, isLoading, isError } = useQuery<CostRow[]>({
    queryKey: ["costData", level, parentName],
    queryFn: async () => {
      const titles = await fetchTitlesFromApi(level);
      return mapApiDataToCostRows(titles, level, parentName);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes — no redundant requests
    gcTime: 10 * 60 * 1000,   // 10 minutes — stays in cache
    retry: 2,
  });

  return { data, isLoading, isError };
};