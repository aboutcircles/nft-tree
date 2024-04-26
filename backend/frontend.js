import useSWR from "swr";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);

function useTreeData() {
  const { data, error, mutate } = useSWR("/api/tree-data", fetcher);

  // Function to refresh data
  const refreshData = async () => {
    const id = data?.[data.length - 1]?.id || 0;
    const updatedData = await fetcher(`/api/tree-data?id=${id}`);
    mutate([...data, ...updatedData], false); // false to not re-revalidate
  };

  return {
    data,
    error,
    refreshData,
  };
}
